import { cancelAllRequests } from '../api/abortControllerManager'
import { getStoredData } from './getStoredData'
import { setItemInStorage } from './setItemInStorage'
import { setLogoutProps } from '../types/types'

export const setLogout = ({ isSessionExpired }: setLogoutProps) => {
    cancelAllRequests()

    const parsedData = getStoredData()
    const userName = parsedData?.username || ''

    localStorage.clear()
    sessionStorage.clear()
    setItemInStorage('issigningup', false)
    setItemInStorage('username', userName)

    window.location.href = isSessionExpired ? '/?session=expired' : '/'

    return false
}
