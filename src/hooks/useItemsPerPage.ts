import { useEffect, useState } from 'react'

export const useItemsPerPage = (): 4 | 8 => {
    const [itemsPerPage, setItemsPerPage] = useState<4 | 8>(4)

    useEffect(() => {
        const handleItemsPerPage = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(4)
            } else setItemsPerPage(8)
        }
        window.addEventListener('resize', handleItemsPerPage)
        handleItemsPerPage()

        return () => {
            window.removeEventListener('resize', handleItemsPerPage)
        }
    }, [])

    return itemsPerPage
}
