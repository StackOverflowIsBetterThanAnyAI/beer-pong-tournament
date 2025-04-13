type getValueFromErrorType = {
    [key: string]: string | string[]
}

export const getValueFromError = (obj: getValueFromErrorType) => {
    const value = Object.values(obj)[0]
    typeof value === 'string' ? value : value.join('') || ''
    return value.toString()
}
