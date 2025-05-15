import { useEffect, useState } from 'react'
import {
    MAX_MATCHES_KO_STAGE,
    MAX_MATCHES_KO_STAGE_DESKTOP,
} from '../constants/constants'

export const useKOMatchesPerPage = (): number => {
    const [koMatchesPerPage, setKOMatchesPerPage] =
        useState<number>(MAX_MATCHES_KO_STAGE)

    useEffect(() => {
        const handleKOMatchesPerPage = () => {
            if (window.innerWidth < 640) {
                setKOMatchesPerPage(MAX_MATCHES_KO_STAGE)
            } else setKOMatchesPerPage(MAX_MATCHES_KO_STAGE_DESKTOP)
        }
        window.addEventListener('resize', handleKOMatchesPerPage)
        handleKOMatchesPerPage()

        return () => {
            window.removeEventListener('resize', handleKOMatchesPerPage)
        }
    }, [])

    return koMatchesPerPage
}
