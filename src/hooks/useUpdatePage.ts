import { useEffect } from 'react'
import {
    KOStageProps,
    ScheduleProps,
    StandingsProps,
    TournamentGroupsProps,
} from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

type useUpdatePageProps = {
    items: KOStageProps | ScheduleProps | StandingsProps | TournamentGroupsProps
    key: string
    MAX_ITEMS_PER_PAGE: number
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
}

export const useUpdatePage = ({
    items,
    key,
    MAX_ITEMS_PER_PAGE,
    page,
    setPage,
}: useUpdatePageProps) => {
    useEffect(() => {
        const maxPages = Math.ceil(items.length / MAX_ITEMS_PER_PAGE)
        if (page > maxPages && maxPages) {
            setPage(maxPages)
            setItemInSessionStorage(key, maxPages)
        }
    }, [MAX_ITEMS_PER_PAGE, items.length, key, page, setPage])
}
