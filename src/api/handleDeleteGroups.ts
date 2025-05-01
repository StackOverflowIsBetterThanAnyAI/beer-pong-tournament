import { SERVER_ADDRESS } from '../constants/constants'
import { ScheduleProps, TournamentGroupsProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'
import { setItemInStorage } from '../utils/setItemInStorage'

type handleDeleteGroupsProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setGroups: (value: React.SetStateAction<TournamentGroupsProps>) => void
    setSchedule: React.Dispatch<React.SetStateAction<ScheduleProps>>
}

export const handleDeleteGroups = async ({
    accessToken,
    refreshToken,
    setApiError,
    setGroups,
    setSchedule,
}: handleDeleteGroupsProps) => {
    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/v1/groups/delete/`,
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
                    'An error occurred while deleting the current groups.'
            )
            return
        }

        setItemInStorage('groups', [])
        setItemInSessionStorage('grouppage', 1)
        setGroups([])

        setItemInStorage('schedule', [])
        setItemInSessionStorage('schedulepage', 1)
        setSchedule([])

        setItemInStorage('standings', [])

        setItemInStorage('isgroupstageover', false)
        setItemInStorage('kostage', [])
    } catch (error: any) {
        setApiError('An error occurred while deleting the current groups.')
    }
}
