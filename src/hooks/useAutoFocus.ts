import { useEffect } from 'react'

export const useAutoFocus = (ref: React.RefObject<any>) => {
    useEffect(() => {
        ref?.current?.focus()
    }, [ref])
}
