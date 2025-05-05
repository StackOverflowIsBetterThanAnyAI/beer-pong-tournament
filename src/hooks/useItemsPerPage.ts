import { useEffect, useState } from 'react'
import { MAX_TEAMS_DESKTOP, MAX_TEAMS_MOBILE } from '../constants/constants'

export const useItemsPerPage = (): number => {
    const [itemsPerPage, setItemsPerPage] = useState<number>(MAX_TEAMS_MOBILE)

    useEffect(() => {
        const handleItemsPerPage = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(MAX_TEAMS_MOBILE)
            } else setItemsPerPage(MAX_TEAMS_DESKTOP)
        }
        window.addEventListener('resize', handleItemsPerPage)
        handleItemsPerPage()

        return () => {
            window.removeEventListener('resize', handleItemsPerPage)
        }
    }, [])

    return itemsPerPage
}
