import { useEffect } from 'react'

export const useAutoFocus = (ref: React.RefObject<any>, enabled = true) => {
    useEffect(() => {
        if (enabled && ref?.current) {
            ref.current.focus()
        }
    }, [enabled])
}
