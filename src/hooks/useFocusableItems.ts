import { useEffect } from 'react'
import { useFocusableItemsProps } from '../types/types'

export const useFocusableItems = ({
    page,
    registeredTeams,
    setFocusableItems,
}: useFocusableItemsProps) => {
    useEffect(() => {
        const focusableElements = Array.from(
            document.querySelectorAll('.page')
        ) as (HTMLInputElement | HTMLButtonElement)[]

        setFocusableItems(focusableElements)
    }, [page, registeredTeams, setFocusableItems])
}
