import { SERVER_ADDRESS } from '../constants/constants'
import { KOStageProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInStorage } from '../utils/setItemInStorage'
import { handleGenerateNextRound } from './handleGenerateNextRound'

type handleLoadKOStageProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setKOStage: React.Dispatch<React.SetStateAction<KOStageProps>>
}

export const handleLoadKOStage = async ({
    accessToken,
    refreshToken,
    setApiError,
    setKOStage,
}: handleLoadKOStageProps) => {
    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/v1/ko-stage/`, {
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
                    'An error occurred while loading the Knockout Stage.'
            )
            return
        }

        const koStage: KOStageProps = await response.json()
        setItemInStorage('kostage', koStage)
        setKOStage(koStage)

        const allMatchesPlayed =
            !!koStage.length && !koStage.filter((item) => !item.played).length

        if (allMatchesPlayed) {
            const currentRound = koStage[koStage.length - 1].round
            const nextRound = (() => {
                switch (currentRound) {
                    case 'R16':
                        return 'QF'
                    case 'QF':
                        return 'SF'
                    case 'SF':
                        return 'F'
                    default:
                        return ''
                }
            })()
            if (currentRound && currentRound !== 'F') {
                handleGenerateNextRound({
                    accessToken,
                    currentRound,
                    nextRound,
                    refreshToken,
                    setApiError,
                    setKOStage,
                })
            }
        }
    } catch (error: any) {
        setApiError('An error occurred while loading the Knockout Stage.')
    }
}
