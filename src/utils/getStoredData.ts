export const getStoredData = () => {
    const storedData = localStorage.getItem('beer-pong-tournament')
    return storedData ? JSON.parse(storedData) : {}
}
