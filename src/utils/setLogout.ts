import { getStoredData } from './getStoredData'
import { setItemInStorage } from './setItemInStorage'

type setLogoutProps = {
    sessionExpired: boolean
}

export const setLogout = ({ sessionExpired }: setLogoutProps) => {
    const parsedData = getStoredData()
    const userName = parsedData?.username || ''
    window.location.href = sessionExpired ? '/?session=expired' : '/'
    localStorage.clear()
    setItemInStorage('issigningup', false)
    setItemInStorage('username', userName)

    return false
}
