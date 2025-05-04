import { jwtDecode } from 'jwt-decode'
import { SERVER_ADDRESS } from '../constants/constants'
import { setItemInStorage } from './setItemInStorage'
import { setLogout } from './setLogout'

const refreshToken = async (refresh: string) => {
    try {
        const refreshData = {
            refresh: refresh,
        }
        const res = await fetch(`${SERVER_ADDRESS}/api/v1/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(refreshData),
        })
        if (res.status === 200) {
            const data = await res.json()
            setItemInStorage('access', data.access)
            return data.access
        } else if (res.status >= 400) {
            setLogout({ isSessionExpired: true })
        } else {
            throw new Error('Error refreshing the Token.')
        }
    } catch (error: any) {
        setLogout({ isSessionExpired: true })
    }
}

export const getValidToken = async (access: string, refresh: string) => {
    const decoded = jwtDecode(access)
    const tokenExpiration = decoded.exp
    const now = Date.now() / 1000

    if (tokenExpiration && tokenExpiration < now) {
        return await refreshToken(refresh)
    } else {
        return access
    }
}
