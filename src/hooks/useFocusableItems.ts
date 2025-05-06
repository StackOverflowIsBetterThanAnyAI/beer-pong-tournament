import { useEffect } from 'react'
import {
    KOStageProps,
    RegisteredTeamsProps,
    ScheduleProps,
    StandingsProps,
    TournamentGroupsProps,
} from '../types/types'

type useFocusableItemsProps = {
    page: number
    registeredTeams:
        | KOStageProps
        | RegisteredTeamsProps
        | ScheduleProps
        | StandingsProps
        | TournamentGroupsProps
    setFocusableItems: (
        value: React.SetStateAction<(HTMLInputElement | HTMLButtonElement)[]>
    ) => void
}

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
