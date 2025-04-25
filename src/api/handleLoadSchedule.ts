import { SERVER_ADDRESS } from '../constants/constants'
import { ScheduleProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInStorage } from '../utils/setItemInStorage'

type handleLoadScheduleProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setSchedule: (value: React.SetStateAction<ScheduleProps>) => void
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const handleLoadSchedule = async ({
    accessToken,
    refreshToken,
    setApiError,
    setSchedule,
    setIsLoading,
}: handleLoadScheduleProps) => {
    setApiError('')
    setIsLoading(true)

    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/v1/games/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getValidToken(
                    accessToken,
                    refreshToken
                )}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            setApiError(
                getValueFromError(errorData) ||
                    'An unexpected error occurred while loading the schedule.'
            )
            return
        }

        const schedule: ScheduleProps = await response.json()
        setSchedule(schedule)
        setItemInStorage('schedule', schedule)
    } catch (error: any) {
        setApiError('An unexpected error occurred while loading the schedule.')
    } finally {
        setIsLoading(false)
    }
}
