export const setItemInStorage = (key: string, value: string | boolean) => {
    const storage = localStorage.getItem('beer-pong-tournament')
    const parsedTracker = storage ? JSON.parse(storage) : {}
    parsedTracker[key] = value
    localStorage.setItem('beer-pong-tournament', JSON.stringify(parsedTracker))
}
