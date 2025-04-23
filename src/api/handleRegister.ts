import { SERVER_ADDRESS } from '../constants/constants'
import { LoggedInUserProps } from '../types/types'
import { getValueFromError } from '../utils/getValueFromError'
import { handleLogin } from './handleLogin'

type handleRegisterProps = {
    setApiError: (value: React.SetStateAction<string>) => void
    setIsLoggedIn: (value: React.SetStateAction<boolean | undefined>) => void
    setItemInStorage(key: string, value: any): void
    setLoggedInUser: (
        value: React.SetStateAction<LoggedInUserProps | undefined>
    ) => void
    setSendingRequest: (value: React.SetStateAction<boolean>) => void
    setSubmitDisabled: (value: React.SetStateAction<boolean>) => void
    userData: {
        username: string
        password: string
    }
}

export const handleRegister = async ({
    setApiError,
    setIsLoggedIn,
    setItemInStorage,
    setLoggedInUser,
    setSendingRequest,
    setSubmitDisabled,
    userData,
}: handleRegisterProps) => {
    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/v1/user/register/`,
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
                    'Currently, you are unable to signup.'
            )
            return
        }

        const token = await response.json()

        setLoggedInUser({
            user: token.username,
            token: userData.password,
        })

        handleLogin({
            setApiError,
            setIsLoggedIn,
            setItemInStorage,
            setSendingRequest,
            userData,
        })
    } catch (error: any) {
        setApiError('An unexpected error occurred while trying to signup.')
    } finally {
        setSendingRequest(false)
        setSubmitDisabled(false)
    }
}
