import { setItemInStorage } from './setItemInStorage'

export const setLogout = () => {
    localStorage.clear()
    setItemInStorage('issigningup', false)
    window.location.href = '/'

    return false
}
