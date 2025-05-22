import { SERVER_ADDRESS } from '../constants/constants'
import { getAbortSignal } from './abortControllerManager'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInStorage } from '../utils/setItemInStorage'

type handleAdminProps = {
    setApiError: (value: React.SetStateAction<string>) => void
    setIsAdmin: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: (value: React.SetStateAction<boolean | undefined>) => void
    token: { access: string; refresh: string }
}

export const handleAdmin = async ({
    setApiError,
    setIsAdmin,
    setIsLoggedIn,
    token,
}: handleAdminProps) => {
    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/v1/me/`, {
            method: 'GET',
            signal: getAbortSignal(),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getValidToken(
                    token.access,
                    token.refresh
                )}`,
            },
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

        const admin: { data: { is_staff: boolean } } = await response.json()
        setItemInStorage('isadmin', admin.data.is_staff)
        setIsAdmin(admin.data.is_staff)

        setIsLoggedIn(true)
        setItemInStorage('isloggedin', true)
        setItemInStorage('access', token.access)
        setItemInStorage('refresh', token.refresh)
    } catch (error: any) {
        setApiError('An error occurred while trying to login.')
    }
}
