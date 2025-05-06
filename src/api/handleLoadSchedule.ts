import { SERVER_ADDRESS } from '../constants/constants'
import { ScheduleProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'
import { setItemInStorage } from '../utils/setItemInStorage'

type handleLoadScheduleProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setIsGroupstageOver?: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setSchedule: (value: React.SetStateAction<ScheduleProps>) => void
}

export const handleLoadSchedule = async ({
    accessToken,
    refreshToken,
    setApiError,
    setIsGroupstageOver,
    setIsLoading,
    setSchedule,
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
                    'An error occurred while loading the schedule.'
            )
            return
        }

        const schedule: ScheduleProps = await response.json()
        setSchedule(schedule)
        setItemInStorage('schedule', schedule)

        const allMatchesPlayed =
            !!schedule.length && !schedule.filter((item) => !item.played).length
        if (allMatchesPlayed) {
            setItemInStorage('isgroupstageover', true)
            setIsGroupstageOver ? setIsGroupstageOver(true) : null
        } else {
            setItemInStorage('isgroupstageover', false)
            setItemInStorage('kostage', [])
            setItemInSessionStorage('kostagepage', 1)
            setIsGroupstageOver ? setIsGroupstageOver(false) : null
        }
    } catch (error: any) {
        setApiError('An error occurred while loading the schedule.')
    } finally {
        setIsLoading(false)
    }
}
