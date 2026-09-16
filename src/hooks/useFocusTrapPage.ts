import { useEffect } from 'react'
import { useFocusTrapPageProps } from '../types/types'

export const useFocusTrapPage = ({ focusableItems }: useFocusTrapPageProps) => {
    useEffect(() => {
        const focusTrap = (
            e: KeyboardEvent,
            focusableElements: (HTMLInputElement | HTMLButtonElement)[]
        ) => {
            if (e.key !== 'Tab' || !focusableElements.length) return

            const previousButton = document.querySelector(
                '.previouspage'
            ) as HTMLButtonElement

            const nextButton = document.querySelector(
                '.nextpage'
            ) as HTMLButtonElement

            if (e.shiftKey) {
                if (document.activeElement === focusableElements[0]) {
                    e.preventDefault()
                    if (!previousButton.disabled) {
                        previousButton?.focus()
                    } else {
                        nextButton?.focus()
                    }
                }
            }
        }

        const handleFocusTrap = (e: KeyboardEvent) =>
            focusTrap(e, focusableItems)
        document.addEventListener('keydown', handleFocusTrap)

        return () => {
            document.removeEventListener('keydown', handleFocusTrap)
        }
    }, [focusableItems])
}
