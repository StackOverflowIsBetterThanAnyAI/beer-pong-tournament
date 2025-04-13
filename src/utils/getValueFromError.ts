type getValueFromErrorProps = {
    [key: string]: string | string[]
}

export const getValueFromError = (obj: getValueFromErrorProps) => {
    const value = Object.values(obj)[0]
    typeof value === 'string' ? value : value.join('') || ''
    return value.toString()
}
