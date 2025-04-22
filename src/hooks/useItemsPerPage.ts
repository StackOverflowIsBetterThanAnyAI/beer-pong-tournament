import { useEffect, useState } from 'react'
import { MAX_ITEMS_DESKTOP, MAX_ITEMS_MOBILE } from '../constants/constants'

export const useItemsPerPage = (): number => {
    const [itemsPerPage, setItemsPerPage] = useState<number>(MAX_ITEMS_MOBILE)

    useEffect(() => {
        const handleItemsPerPage = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(MAX_ITEMS_MOBILE)
            } else setItemsPerPage(MAX_ITEMS_DESKTOP)
        }
        window.addEventListener('resize', handleItemsPerPage)
        handleItemsPerPage()

        return () => {
            window.removeEventListener('resize', handleItemsPerPage)
        }
    }, [])

    return itemsPerPage
}
