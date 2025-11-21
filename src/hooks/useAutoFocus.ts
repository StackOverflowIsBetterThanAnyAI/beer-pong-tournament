import { useEffect } from 'react'

export const useAutoFocus = <T extends HTMLElement | null>(
    ref: React.RefObject<T>,
    enabled = true
) => {
    useEffect(() => {
        if (enabled && ref?.current) {
            ref.current.focus()
        }
    }, [enabled, ref])
}
