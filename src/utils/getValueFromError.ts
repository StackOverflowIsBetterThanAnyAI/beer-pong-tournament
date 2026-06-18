type getValueFromErrorProps = {
    [key: string]: string | string[]
}

export const getValueFromError = (obj: getValueFromErrorProps) => {
    let value = Object.values(obj)[0]
    if (!value) return ''
    value = typeof value === 'string' ? value : value.join('')
    return value.toString()
}
