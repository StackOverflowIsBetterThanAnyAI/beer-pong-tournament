import { getStoredData } from './getStoredData'
import { setItemInStorage } from './setItemInStorage'

export const setLogout = () => {
    const parsedData = getStoredData()
    const userName = parsedData?.username || ''
    localStorage.clear()
    setItemInStorage('issigningup', false)
    setItemInStorage('username', userName)
    window.location.href = '/'

    return false
}
