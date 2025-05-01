import { SERVER_ADDRESS } from '../constants/constants'
import { KOStageProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { handleLoadKOStage } from './handleLoadKOStage'

type handleGenerateKOStageProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setIsSubmitDisabled: React.Dispatch<React.SetStateAction<boolean>>
    setKOStage: React.Dispatch<React.SetStateAction<KOStageProps>>
}

export const handleGenerateKOStage = async ({
    accessToken,
    refreshToken,
    setApiError,
    setIsSubmitDisabled,
    setKOStage,
}: handleGenerateKOStageProps) => {
    setIsSubmitDisabled(true)

    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/v1/ko-stage/generate/`,
            {
                method: 'POST',
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
        })
    } catch (error: any) {
        setApiError('An error occurred while generating the Knockout Stage.')
    } finally {
        setIsSubmitDisabled(false)
    }
}
