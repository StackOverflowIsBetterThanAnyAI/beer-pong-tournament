import { useEffect, useState } from 'react'
import {
    MAX_GROUPS_DESKTOP,
    MAX_GROUPS_MOBILE,
    MAX_GROUPS_TABLET,
} from '../constants/constants'

export const useTeamsPerPage = (): number => {
    const [teamsPerPage, setTeamsPerPage] = useState<number>(MAX_GROUPS_MOBILE)

    useEffect(() => {
        const handleTeamsPerPage = () => {
            if (window.innerWidth < 640) {
                setTeamsPerPage(MAX_GROUPS_MOBILE)
            } else if (window.innerWidth < 1024) {
                setTeamsPerPage(MAX_GROUPS_TABLET)
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
