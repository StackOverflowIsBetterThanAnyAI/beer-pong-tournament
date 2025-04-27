import { SERVER_ADDRESS } from '../constants/constants'
import {
    RegisteredTeamProps,
    RegisteredTeamsProps,
    ScheduleProps,
    TournamentGroupsProps,
} from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInStorage } from '../utils/setItemInStorage'
import { handleDeleteGroups } from './handleDeleteGroups'

type handleDeleteTeamProps = {
    accessToken: string
    item: RegisteredTeamProps
    MAX_ITEMS_PER_PAGE: number
    page: number
    previousPage: () => void
    refreshToken: string
    registeredTeams: RegisteredTeamsProps
    setApiError: (value: React.SetStateAction<string>) => void
    setGroups: (value: React.SetStateAction<TournamentGroupsProps>) => void
    setRegisteredTeams: (
        value: React.SetStateAction<RegisteredTeamsProps>
    ) => void
    setSchedule: React.Dispatch<React.SetStateAction<ScheduleProps>>
}

export const handleDeleteTeam = async ({
    accessToken,
    item,
    MAX_ITEMS_PER_PAGE,
    page,
    previousPage,
    refreshToken,
    registeredTeams,
    setApiError,
    setGroups,
    setRegisteredTeams,
    setSchedule,
}: handleDeleteTeamProps) => {
    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/v1/teams/delete/${item.id}/`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await getValidToken(
                        accessToken,
                        refreshToken
                    )}`,
                },
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            setApiError(
                getValueFromError(errorData) ||
                    'An error occurred while deleting a team.'
            )
            setTimeout(() => setApiError(''), 4000)
            return
        }
        const updatedTeams = registeredTeams.filter(
            (team) => team.id !== item.id
        )
        setRegisteredTeams(updatedTeams)
        setItemInStorage('registeredteams', updatedTeams)

        if (
            page === updatedTeams.length / 4 + 1 &&
            updatedTeams.length % MAX_ITEMS_PER_PAGE === 0
        ) {
            previousPage()
        }

        handleDeleteGroups({
            accessToken,
            refreshToken,
            setApiError,
            setGroups,
            setSchedule,
        })
    } catch (error: any) {
        setApiError('An error occurred while deleting a team.')
        setTimeout(() => setApiError(''), 4000)
    }
}
