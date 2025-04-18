import { SERVER_ADDRESS } from '../constants/constants'
import { RegisteredTeamsProps, TournamentGroupsProps } from '../types/tpyes'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
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
    setItemInStorage(key: string, value: any): void
    setRegisteredTeams: (
        value: React.SetStateAction<RegisteredTeamsProps>
    ) => void
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
    setItemInStorage,
    setRegisteredTeams,
    setSendingRequest,
    setSubmitDisabled,
}: handleRegisterTeamProps) => {
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
            setApiError(getValueFromError(errorData))
            return
        }

        const result = await response.json()
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
            setItemInStorage,
        })

        setSubmitDisabled(true)
    } catch (error: any) {
        setApiError('An unexpected error occurred while adding your team.')
        setSubmitDisabled(false)
    } finally {
        setSendingRequest(false)
    }
}
