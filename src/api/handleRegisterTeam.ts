import { SERVER_ADDRESS } from '../constants/constants'
import {
    KOStageProps,
    RegisteredTeamProps,
    RegisteredTeamsProps,
    ScheduleProps,
    ToastProps,
    TournamentGroupsProps,
} from '../types/types'
import { getAbortSignal } from './abortControllerManager'
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
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsSubmitDisabled: (value: React.SetStateAction<boolean>) => void
    setKOStage: React.Dispatch<React.SetStateAction<KOStageProps>>
    setRegisteredTeams: (
        value: React.SetStateAction<RegisteredTeamsProps>
    ) => void
    setSchedule: React.Dispatch<React.SetStateAction<ScheduleProps>>
    showToast: (toast: ToastProps) => void
}

export const handleRegisterTeam = async ({
    accessToken,
    refreshToken,
    registerTeamData,
    registeredTeams,
    setApiError,
    setGroups,
    setIsLoading,
    setIsSubmitDisabled,
    setKOStage,
    setRegisteredTeams,
    setSchedule,
    showToast,
}: handleRegisterTeamProps) => {
    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/v1/teams/`, {
            method: 'POST',
            signal: getAbortSignal(),
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
            setKOStage,
            setSchedule,
        })

        setIsSubmitDisabled(true)
        showToast({
            isSuccess: true,
            label: 'Successfully registered Team!',
        })
    } catch (_error) {
        setApiError('An error occurred while adding your team.')
        setIsSubmitDisabled(false)
        setTimeout(() => setApiError(''), 4000)
    } finally {
        setIsLoading(false)
    }
}
