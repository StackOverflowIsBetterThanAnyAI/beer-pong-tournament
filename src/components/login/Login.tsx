import { useContext, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FormError from './../form/FormError'
import FormHeader from './../form/FormHeader'
import FormInput from './../form/FormInput'
import FormInputPassword from './../form/FormInputPassword'
import FormSubmit from './../form/FormSubmit'
import FormSwitch from './../form/FormSwitch'
import { ContextAdmin } from '../../context/ContextAdmin'
import { ContextIsLoggedIn } from '../../context/ContextLogin'
import { ContextPasswordVisibility } from '../../context/ContextPasswordVisibility'
import { getStoredData } from '../../utils/getStoredData'
import { handleLogin } from '../../api/handleLogin'
import { handleRegister } from '../../api/handleRegister'
import { setItemInStorage } from '../../utils/setItemInStorage'
import { useAutoFocus } from '../../hooks/useAutoFocus'
import {
    useErrorConfirmPassword,
    useErrorPassword,
    useErrorName,
} from '../../hooks/useError'
import { useContextToast } from '../../context/ContextToast'
import { useSessionExpired } from '../../hooks/useSessionExpired'
import { useSubmitDisabledLogin } from '../../hooks/useSubmitDisabled'
import { useWindowScrollYState } from '../../hooks/useWindowScrollYState'

const Login = () => {
    const parsedStorageData = getStoredData()
    const { showToast } = useContextToast()

    const location = useLocation()
    const navigate = useNavigate()

    const contextAdmin = useContext(ContextAdmin)
    if (!contextAdmin) {
        throw new Error(
            'GroupsGenerator must be used within a ContextAdmin.Provider'
        )
    }
    const [_isAdmin, setIsAdmin] = contextAdmin

    const contextIsLoggedIn = useContext(ContextIsLoggedIn)
    if (!contextIsLoggedIn) {
        throw new Error(
            'Login must be used within a ContextIsLoggedIn.Provider'
        )
    }
    const [_isLoggedIn, setIsLoggedIn] = contextIsLoggedIn

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
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true)

    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>('')
    const [errorPassword, setErrorPassword] = useState<string>('')
    const [errorUserName, setErrorUserName] = useState<string>('')

    const userNamePattern = useMemo<RegExp>(() => /^[a-z0-9]{5,20}$/i, [])
    const passwordPattern = useMemo<RegExp>(() => /^[^\s]{8,25}$/, [])

    useAutoFocus(userNameRef)
    useSessionExpired({ location, navigate, showToast })

    useSubmitDisabledLogin({
        confirmPassword,
        isSigningUp,
        password,
        passwordPattern,
        setIsSubmitDisabled,
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

    useWindowScrollYState()

    const handleUserNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiError('')
        setUserName(e.target.value)
        setItemInStorage('username', e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isSubmitDisabled) {
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
        setIsLoading(true)
        setIsSubmitDisabled(true)

        const userData = {
            username: userName,
            password: password,
        }

        if (isSigningUp) {
            handleRegister({
                setApiError,
                setIsAdmin,
                setIsLoading,
                setIsLoggedIn,
                setIsSubmitDisabled,
                userData,
            })
        } else {
            handleLogin({
                setApiError,
                setIsAdmin,
                setIsLoading,
                setIsLoggedIn,
                userData,
            })
        }
    }

    return (
        <main
            className="flex justify-center w-full max-w-7xl relative isolate bg-stone-300 text-stone-950 lg:rounded-b-lg p-3 sm:p-4 lg:p-6 drop-shadow-stone-900 drop-shadow-sm"
            data-testid="login-main"
        >
            <div className="w-96">
                <FormHeader
                    header={isSigningUp ? 'Signup' : 'Login'}
                    subHeader="required"
                />
                <FormSwitch
                    isSigningUp={isSigningUp}
                    handleClick={handleSwitch}
                />
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
                            testID="login-user-input"
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
                            id={`${isSigningUp ? 'signup' : 'login'}Password`}
                            isHidden={isPasswordHidden}
                            label="Password"
                            maxLength={25}
                            minLength={8}
                            onInput={handlePasswordInput}
                            onKeyDown={handleKeyDown}
                            testID="login-password-input"
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
                                    error={apiError || errorConfirmPassword}
                                    id="signupConfirmPassword"
                                    isDisabled={confirmPasswordDisabled}
                                    isHidden={isPasswordHidden}
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
                            handleClick={handleClickAuthenticate}
                            isDisabled={isSubmitDisabled}
                            isLoading={isLoading}
                            testID="login-submit"
                            value={isSigningUp ? 'Signup' : 'Login'}
                        />
                    </form>
                </ContextPasswordVisibility.Provider>
            </div>
        </main>
    )
}

export default Login
