import { SERVER_ADDRESS } from '../constants/constants'
import { getValueFromError } from '../utils/getValueFromError'
import { handleLogin } from './handleLogin'
import { setItemInStorage } from '../utils/setItemInStorage'

type handleRegisterProps = {
    setApiError: (value: React.SetStateAction<string>) => void
    setIsAdmin: (value: React.SetStateAction<boolean>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: (value: React.SetStateAction<boolean | undefined>) => void
    setIsSubmitDisabled: (value: React.SetStateAction<boolean>) => void
    userData: {
        username: string
        password: string
    }
}

export const handleRegister = async ({
    setApiError,
    setIsAdmin,
    setIsLoading,
    setIsLoggedIn,
    setIsSubmitDisabled,
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

        handleLogin({
            setApiError,
            setIsAdmin,
            setIsLoading,
            setIsLoggedIn,
            userData,
        })
    } catch (error: any) {
        setApiError('An error occurred while trying to signup.')
    } finally {
        setIsLoading(false)
        setIsSubmitDisabled(false)
    }
}
