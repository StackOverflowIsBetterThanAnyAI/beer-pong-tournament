import { SERVER_ADDRESS } from '../constants/constants'
import { KOStageProps } from '../types/types'
import { getAbortSignal } from './abortControllerManager'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { handleLoadKOStage } from './handleLoadKOStage'

type handleGenerateNextRoundProps = {
    accessToken: string
    currentRound: string
    nextRound: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setKOStage: React.Dispatch<React.SetStateAction<KOStageProps>>
    setTournamentWinner: React.Dispatch<React.SetStateAction<string>>
}

export const handleGenerateNextRound = async ({
    accessToken,
    currentRound,
    nextRound,
    refreshToken,
    setApiError,
    setKOStage,
    setTournamentWinner,
}: handleGenerateNextRoundProps) => {
    const roundData = {
        current_round: currentRound,
        next_round: nextRound,
    }
    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/v1/ko-stage/next-round/`,
            {
                method: 'POST',
                signal: getAbortSignal(),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await getValidToken(
                        accessToken,
                        refreshToken
                    )}`,
                },
                body: JSON.stringify(roundData),
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            setApiError(
                getValueFromError(errorData) ||
                    'An error occurred while generating the next round of the Knockout Stage.'
            )
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
        setApiError(
            'An error occurred while generating the next round of the Knockout Stage.'
        )
    }
}
