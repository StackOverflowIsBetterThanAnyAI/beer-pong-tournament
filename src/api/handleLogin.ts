import { SERVER_ADDRESS } from '../constants/constants'
import { getAbortSignal } from './abortControllerManager'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInStorage } from '../utils/setItemInStorage'
import { handleAdmin } from './handleAdmin'

type handleLoginProps = {
    setApiError: (value: React.SetStateAction<string>) => void
    setIsAdmin: (value: React.SetStateAction<boolean>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: (value: React.SetStateAction<boolean | undefined>) => void
    userData: {
        username: string
        password: string
    }
}

export const handleLogin = async ({
    setApiError,
    setIsAdmin,
    setIsLoading,
    setIsLoggedIn,
    userData,
}: handleLoginProps) => {
    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/v1/token/`, {
            method: 'POST',
            signal: getAbortSignal(),
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            setIsLoggedIn(false)
            setItemInStorage('isloggedin', false)
            setApiError(
                getValueFromError(errorData) ||
                    'Currently, you are unable to login.'
            )
            return
        }

        const token: { access: string; refresh: string } = await response.json()

        handleAdmin({ setApiError, setIsAdmin, setIsLoggedIn, token })
    } catch (error: any) {
        setApiError('An error occurred while trying to login.')
    } finally {
        setIsLoading(false)
    }
}
