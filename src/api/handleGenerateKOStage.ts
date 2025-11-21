import { SERVER_ADDRESS } from '../constants/constants'
import { KOStageProps } from '../types/types'
import { getAbortSignal } from './abortControllerManager'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { handleLoadKOStage } from './handleLoadKOStage'

type handleGenerateKOStageProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setIsSubmitDisabled: React.Dispatch<React.SetStateAction<boolean>>
    setKOStage: React.Dispatch<React.SetStateAction<KOStageProps>>
    setTournamentWinner: React.Dispatch<React.SetStateAction<string>>
}

export const handleGenerateKOStage = async ({
    accessToken,
    refreshToken,
    setApiError,
    setIsSubmitDisabled,
    setKOStage,
    setTournamentWinner,
}: handleGenerateKOStageProps) => {
    setIsSubmitDisabled(true)

    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/v1/ko-stage/generate/`,
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
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            setApiError(
                getValueFromError(errorData) ||
                    'An error occurred while generating the Knockout Stage.'
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
    } catch (_error) {
        setApiError('An error occurred while generating the Knockout Stage.')
    } finally {
        setIsSubmitDisabled(false)
    }
}
