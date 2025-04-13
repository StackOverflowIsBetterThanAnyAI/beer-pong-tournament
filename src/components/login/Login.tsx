import { useContext, useMemo, useRef, useState } from 'react'
import FormError from './../form/FormError'
import FormHeader from './../form/FormHeader'
import FormInput from './../form/FormInput'
import FormInputPassword from './../form/FormInputPassword'
import FormSubmit from './../form/FormSubmit'
import FormSwitch from './../form/FormSwitch'
import {
    ContextIsLoggedIn,
    ContextLoggedInUser,
} from '../../context/LoginContext'
import { ContextPasswordVisibility } from '../../context/ContextPasswordVisibility'
import { SERVER_ADDRESS } from '../../constants/constants'
import { getStoredData } from '../../utils/getStoredData'
import { getValueFromError } from '../../utils/getValueFromError'
import { setItemInStorage } from '../../utils/setItemInStorage'
import { useAutoFocus } from '../../hooks/useAutoFocus'
import {
    useErrorConfirmPassword,
    useErrorPassword,
    useErrorName,
} from '../../hooks/useError'
import { useSubmitDisabledLogin } from '../../hooks/useSubmitDisabled'

const Login = () => {
    const contextIsLoggedIn = useContext(ContextIsLoggedIn)
    if (!contextIsLoggedIn) {
        throw new Error('Form must be used within a ContextIsLoggedIn.Provider')
    }
    // eslint-disable-next-line
    const [_isLoggedIn, setIsLoggedIn] = contextIsLoggedIn

    const contextLoggedInUser = useContext(ContextLoggedInUser)
    if (!contextLoggedInUser) {
        throw new Error(
            'Form must be used within a ContextLoggedInUser.Provider'
        )
    }
    // eslint-disable-next-line
    const [_loggedInUser, setLoggedInUser] = contextLoggedInUser

    const parsedStorageData = getStoredData()

    const [userName, setUserName] = useState<string>(
        parsedStorageData?.username || ''
    )
    const [isSigningUp, setIsSigningUp] = useState<boolean>(
        parsedStorageData?.issigningup ?? true
    )
    const userNameRef = useRef<HTMLInputElement>(null)

    const [apiError, setApiError] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true)
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [confirmPasswordDisabled, setConfirmPasswordDisabled] =
        useState<boolean>(true)
    const [sendingRequest, setSendingRequest] = useState<boolean>(false)
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)

    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>('')
    const [errorPassword, setErrorPassword] = useState<string>('')
    const [errorUserName, setErrorUserName] = useState<string>('')

    const userNamePattern = useMemo<RegExp>(() => /^[a-z0-9]{5,20}$/i, [])
    const passwordPattern = useMemo<RegExp>(() => /^[^\s]{8,25}$/, [])

    useAutoFocus(userNameRef)

    useSubmitDisabledLogin({
        confirmPassword,
        isSigningUp,
        password,
        passwordPattern,
        setSubmitDisabled,
        userName,
        userNamePattern,
    })

    useErrorName({
        setErrorName: setErrorUserName,
        name: userName,
        namePattern: userNamePattern,
        type: 'user',
    })

    useErrorPassword({
        password,
        passwordPattern,
        setConfirmPasswordDisabled,
        setErrorPassword,
    })

    useErrorConfirmPassword({
        confirmPassword,
        password,
        setErrorConfirmPassword,
    })

    const handleUserNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiError('')
        setUserName(e.target.value)
        setItemInStorage('username', e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !submitDisabled) {
            handleClickAuthenticate(e)
        }
    }

    const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiError('')
        setPassword(e.target.value)
        setConfirmPassword('')
    }

    const handleConfirmPasswordInput = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setConfirmPassword(e.target.value)
    }

    const handleSwitch = () => {
        setApiError('')
        setIsSigningUp((prev) => !prev)
        setPassword('')
        setConfirmPassword('')
        setItemInStorage('issigningup', !isSigningUp)
        setIsPasswordHidden(true)
        setConfirmPasswordDisabled(true)
    }

    const handleClickAuthenticate = async (
        e:
            | React.MouseEvent<HTMLInputElement>
            | React.KeyboardEvent<HTMLInputElement>
    ) => {
        e.preventDefault()
        setApiError('')
        setSendingRequest(true)
        setSubmitDisabled(true)

        const userData = {
            username: userName,
            password: password,
        }

        try {
            const response = await fetch(
                `${SERVER_ADDRESS}/api/v1/${
                    isSigningUp ? 'user/register/' : 'token/'
                }`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                setIsLoggedIn(false)
                setItemInStorage('isloggedin', false)
                setApiError(
                    getValueFromError(errorData) ||
                        `Currently, you are unable to ${
                            isSigningUp ? 'signup.' : 'login.'
                        }`
                )
                return
            }

            const token = await response.json()

            setLoggedInUser({
                user: token.username,
                token: password,
            })

            try {
                const response = await fetch(
                    `${SERVER_ADDRESS}/api/v1/token/`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    }
                )

                if (!response.ok) {
                    const errorData = await response.json()
                    setIsLoggedIn(false)
                    setItemInStorage('isloggedin', false)
                    setApiError(
                        getValueFromError(errorData) ||
                            `Currently, you are unable to ${
                                isSigningUp ? 'signup.' : 'login.'
                            }`
                    )
                    return
                }

                const token = await response.json()
                setIsLoggedIn(true)
                setItemInStorage('isloggedin', true)
                setItemInStorage('access', token.access)
                setItemInStorage('refresh', token.refresh)
            } catch (error: any) {
                setApiError(error)
            }
        } catch (error: any) {
            setApiError(error)
        } finally {
            setSendingRequest(false)
            setSubmitDisabled(false)
        }
    }

    return (
        <main className="w-full bg-stone-300 text-stone-950 sm:w-80 md:w-112 sm:rounded-lg p-3 sm:p-4 md:p-6">
            <FormHeader
                header={isSigningUp ? 'Signup' : 'Login'}
                subHeader="required"
            />
            <FormSwitch isSigningUp={isSigningUp} handleClick={handleSwitch} />
            <ContextPasswordVisibility.Provider
                value={[isPasswordHidden, setIsPasswordHidden]}
            >
                <form
                    className="flex flex-col"
                    autoComplete="on"
                    aria-label={isSigningUp ? 'Signup' : 'Login'}
                    name={isSigningUp ? 'signup' : 'login'}
                    method="post"
                    target="_self"
                >
                    <FormInput
                        autoComplete="username"
                        error={errorUserName}
                        id={`${isSigningUp ? 'signup' : 'login'}User`}
                        label="User Name"
                        maxLength={20}
                        minLength={5}
                        onInput={handleUserNameInput}
                        onKeyDown={handleKeyDown}
                        placeholder="JohnDoe1337"
                        ref={userNameRef}
                        title={
                            isSigningUp
                                ? 'Choose a user name containing between 5 and 20 characters and only Latin letters or numbers.'
                                : 'Enter your user name.'
                        }
                        type="text"
                        value={userName}
                    />
                    <FormError error={errorUserName} />
                    <FormInputPassword
                        autoComplete={`${
                            isSigningUp ? 'new' : 'current'
                        }-password`}
                        error={(!isSigningUp && apiError) || errorPassword}
                        hidden={isPasswordHidden}
                        id={`${isSigningUp ? 'signup' : 'login'}Password`}
                        label="Password"
                        maxLength={25}
                        minLength={8}
                        onInput={handlePasswordInput}
                        onKeyDown={handleKeyDown}
                        title={
                            isSigningUp
                                ? 'Choose a password containing between 8 and 25 characters.'
                                : 'Enter your password.'
                        }
                        value={password}
                    />
                    {!isSigningUp && apiError ? (
                        <FormError error={apiError} />
                    ) : (
                        <FormError error={errorPassword} />
                    )}
                    {isSigningUp && (
                        <>
                            <FormInputPassword
                                autoComplete="new-password"
                                aria-disabled={confirmPasswordDisabled}
                                disabled={confirmPasswordDisabled}
                                error={apiError || errorConfirmPassword}
                                hidden={isPasswordHidden}
                                id="signupConfirmPassword"
                                label="Confirm Password"
                                maxLength={25}
                                minLength={8}
                                onInput={handleConfirmPasswordInput}
                                onKeyDown={handleKeyDown}
                                title={
                                    confirmPasswordDisabled
                                        ? 'Currently disabled, enter a valid password first.'
                                        : 'Confirm the password by entering it again.'
                                }
                                value={confirmPassword}
                            />
                            {apiError ? (
                                <FormError error={apiError} />
                            ) : (
                                <FormError error={errorConfirmPassword} />
                            )}
                        </>
                    )}
                    <FormSubmit
                        disabled={submitDisabled}
                        handleClick={handleClickAuthenticate}
                        sendingRequest={sendingRequest}
                        value={isSigningUp ? 'Signup' : 'Login'}
                    />
                </form>
            </ContextPasswordVisibility.Provider>
        </main>
    )
}

export default Login
