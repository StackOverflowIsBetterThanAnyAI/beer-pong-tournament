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

type handleRegisterTeamProps = {
    accessToken: string
    refreshToken: string
    registerTeamData: {
        name: string
        member_one: string
        member_two: string
    }
    registeredTeams: RegisteredTeamsProps
    setApiError: (value: React.SetStateAction<string>) => void
    setGroups: (value: React.SetStateAction<TournamentGroupsProps>) => void
    setIsSuccess: (value: React.SetStateAction<boolean>) => void
    setIsTriggered: (value: React.SetStateAction<boolean>) => void
    setRegisteredTeams: (
        value: React.SetStateAction<RegisteredTeamsProps>
    ) => void
    setSchedule: React.Dispatch<React.SetStateAction<ScheduleProps>>
    setSendingRequest: (value: React.SetStateAction<boolean>) => void
    setSubmitDisabled: (value: React.SetStateAction<boolean>) => void
}

export const handleRegisterTeam = async ({
    accessToken,
    refreshToken,
    registerTeamData,
    registeredTeams,
    setApiError,
    setGroups,
    setIsSuccess,
    setIsTriggered,
    setRegisteredTeams,
    setSchedule,
    setSendingRequest,
    setSubmitDisabled,
}: handleRegisterTeamProps) => {
    setIsSuccess(false)
    setIsTriggered(false)

    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/v1/teams/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getValidToken(
                    accessToken,
                    refreshToken
                )}`,
            },
            body: JSON.stringify(registerTeamData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            setApiError(
                getValueFromError(errorData) ||
                    'An error occurred while adding your team.'
            )
            setTimeout(() => setApiError(''), 4000)
            return
        }

        const result: RegisteredTeamProps = await response.json()
        const updatedTeams = [
            ...registeredTeams,
            {
                id: result.id,
                name: registerTeamData.name,
                member_one: registerTeamData.member_one,
                member_two: registerTeamData.member_two,
            },
        ]
        setRegisteredTeams(updatedTeams)
        setItemInStorage('registeredteams', updatedTeams)

        handleDeleteGroups({
            accessToken,
            refreshToken,
            setApiError,
            setGroups,
            setSchedule,
        })

        setSubmitDisabled(true)
        setIsSuccess(true)
        setIsTriggered(true)
        setTimeout(() => setIsSuccess(false), 3750)
        setTimeout(() => setIsTriggered(false), 3000)
    } catch (error: any) {
        setApiError('An error occurred while adding your team.')
        setSubmitDisabled(false)
        setTimeout(() => setApiError(''), 4000)
    } finally {
        setSendingRequest(false)
    }
}
