import { SERVER_ADDRESS } from '../constants/constants'
import { ScheduleProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { handleLoadSchedule } from './handleLoadSchedule'

type handleUpdateScoreProps = {
    accessToken: string
    id: number
    refreshToken: string
    score_team1: string
    score_team2: string
    setApiError: (value: React.SetStateAction<string>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setSchedule: React.Dispatch<React.SetStateAction<ScheduleProps>>
}

export const handleUpdateScore = async ({
    accessToken,
    id,
    refreshToken,
    score_team1,
    score_team2,
    setApiError,
    setIsLoading,
    setSchedule,
}: handleUpdateScoreProps) => {
    const scoreData = {
        score_team1: score_team1,
        score_team2: score_team2,
        played: true,
    }

    setApiError('')
    setIsLoading(true)

    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/v1/games/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getValidToken(
                    accessToken,
                    refreshToken
                )}`,
            },
            body: JSON.stringify(scoreData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            setApiError(getValueFromError(errorData))
            return
        }

        handleLoadSchedule({
            accessToken,
            refreshToken,
            setApiError,
            setIsLoading,
            setSchedule,
        })
    } catch (error: any) {
        setApiError('An unexpected error happened while updating the Score.')
    } finally {
        setIsLoading(false)
    }
}
