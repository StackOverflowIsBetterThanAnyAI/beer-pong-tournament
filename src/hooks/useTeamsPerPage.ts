import { useEffect, useState } from 'react'
import { MAX_GROUPS_DESKTOP, MAX_GROUPS_MOBILE } from '../constants/constants'

export const useTeamsPerPage = (): number => {
    const [teamsPerPage, setTeamsPerPage] = useState<number>(MAX_GROUPS_MOBILE)

    useEffect(() => {
        const handleTeamsPerPage = () => {
            if (window.innerWidth < 640) {
                setTeamsPerPage(MAX_GROUPS_MOBILE)
            } else setTeamsPerPage(MAX_GROUPS_DESKTOP)
        }
        window.addEventListener('resize', handleTeamsPerPage)
        handleTeamsPerPage()

        return () => {
            window.removeEventListener('resize', handleTeamsPerPage)
        }
    }, [])

    return teamsPerPage
}
