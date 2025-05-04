import { getStoredData } from './getStoredData'
import { setItemInStorage } from './setItemInStorage'

type setLogoutProps = {
    isSessionExpired: boolean
}

export const setLogout = ({ isSessionExpired }: setLogoutProps) => {
    const parsedData = getStoredData()
    const userName = parsedData?.username || ''
    window.location.href = isSessionExpired ? '/?session=expired' : '/'
    localStorage.clear()
    setItemInStorage('issigningup', false)
    setItemInStorage('username', userName)

    return false
}
