let controller: AbortController | null = null

export const getAbortSignal = (): AbortSignal => {
    if (!controller) controller = new AbortController()
    return controller.signal
}

export const cancelAllRequests = () => {
    if (controller) controller.abort()
    controller = new AbortController()
}
