import { SERVER_ADDRESS } from '../constants/constants'
import { KOStageProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { handleLoadKOStage } from './handleLoadKOStage'

type handleUpdateKOStageScoreProps = {
    accessToken: string
    id: number
    refreshToken: string
    score_team1: string
    score_team2: string
    setApiError: (value: React.SetStateAction<string>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setKOStage: React.Dispatch<React.SetStateAction<KOStageProps>>
    setTournamentWinner: React.Dispatch<React.SetStateAction<string>>
}

export const handleUpdateKOStageScore = async ({
    accessToken,
    id,
    refreshToken,
    score_team1,
    score_team2,
    setApiError,
    setIsLoading,
    setKOStage,
    setTournamentWinner,
}: handleUpdateKOStageScoreProps) => {
    const scoreData = {
        score_team1: score_team1,
        score_team2: score_team2,
        played: true,
    }

    setApiError('')
    setIsLoading(true)

    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/v1/ko-stage/${id}/`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await getValidToken(
                        accessToken,
                        refreshToken
                    )}`,
                },
                body: JSON.stringify(scoreData),
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            setApiError(
                getValueFromError(errorData) ||
                    'An error occurred while updating the Score.'
            )
            setTimeout(() => setApiError(''), 4000)
            return
        }

        handleLoadKOStage({
            accessToken,
            refreshToken,
            setApiError,
            setKOStage,
            setTournamentWinner,
        })
    } catch (error: any) {
        setApiError('An error occurred while updating the Score.')
        setTimeout(() => setApiError(''), 4000)
    } finally {
        setIsLoading(false)
    }
}
