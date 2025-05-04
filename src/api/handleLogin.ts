import { SERVER_ADDRESS } from '../constants/constants'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInStorage } from '../utils/setItemInStorage'
import { handleAdmin } from './handleAdmin'

type handleLoginProps = {
    setApiError: (value: React.SetStateAction<string>) => void
    setIsLoggedIn: (value: React.SetStateAction<boolean | undefined>) => void
    setIsSendingRequest: (value: React.SetStateAction<boolean>) => void
    userData: {
        username: string
        password: string
    }
}

export const handleLogin = async ({
    setApiError,
    setIsLoggedIn,
    setIsSendingRequest,
    userData,
}: handleLoginProps) => {
    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/v1/token/`, {
            method: 'POST',
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

        handleAdmin({ setApiError, setIsLoggedIn, token })
    } catch (error: any) {
        setApiError('An error occurred while trying to login.')
    } finally {
        setIsSendingRequest(false)
    }
}
