export const getStoredSessionData = () => {
    const storedData = sessionStorage.getItem('beer-pong-tournament')
    return storedData ? JSON.parse(storedData) : {}
}
