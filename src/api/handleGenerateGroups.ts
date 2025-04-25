import { SERVER_ADDRESS } from '../constants/constants'
import { ScheduleProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { handleLoadSchedule } from './handleLoadSchedule'

type handleGenerateGroupsProps = {
    accessToken: string
    groups: number[][]
    loadGroups: () => Promise<void>
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setSchedule: (value: React.SetStateAction<ScheduleProps>) => void
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsSubmitDisabled: (value: React.SetStateAction<boolean>) => void
    setPage?: React.Dispatch<React.SetStateAction<number>>
}

export const handleGenerateGroups = async ({
    accessToken,
    groups,
    loadGroups,
    refreshToken,
    setApiError,
    setSchedule,
    setIsLoading,
    setIsSubmitDisabled,
    setPage,
}: handleGenerateGroupsProps) => {
    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/v1/groups/bulk/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getValidToken(
                    accessToken,
                    refreshToken
                )}`,
            },
            body: JSON.stringify({ groups }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            setApiError(getValueFromError(errorData))
            return
        }

        loadGroups()

        handleLoadSchedule({
            accessToken,
            refreshToken,
            setApiError,
            setIsLoading,
            setPage,
            setSchedule,
        })
    } catch (error: any) {
        setApiError(
            'An unexpected error occurred while starting the tournament.'
        )
    } finally {
        setIsSubmitDisabled(false)
    }
}
