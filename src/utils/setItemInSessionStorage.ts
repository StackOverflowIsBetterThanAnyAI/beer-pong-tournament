export const setItemInSessionStorage = (key: string, value: unknown) => {
    const storage = sessionStorage.getItem('beer-pong-tournament')
    const parsedTracker = storage ? JSON.parse(storage) : {}
    parsedTracker[key] = value
    sessionStorage.setItem(
        'beer-pong-tournament',
        JSON.stringify(parsedTracker)
    )
}
