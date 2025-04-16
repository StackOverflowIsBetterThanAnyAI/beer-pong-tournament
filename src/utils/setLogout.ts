import { getStoredData } from './getStoredData'
import { setItemInStorage } from './setItemInStorage'

export const setLogout = () => {
    const parsedData = getStoredData()
    const userName = parsedData?.username || ''
    window.location.href = '/'
    localStorage.clear()
    setItemInStorage('issigningup', false)
    setItemInStorage('username', userName)

    return false
}
