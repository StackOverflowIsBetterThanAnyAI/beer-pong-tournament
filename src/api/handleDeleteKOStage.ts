import { SERVER_ADDRESS } from '../constants/constants'
import { KOStageProps } from '../types/types'
import { getAbortSignal } from './abortControllerManager'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'
import { setItemInStorage } from '../utils/setItemInStorage'

type handleDeleteKOStageProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setKOStage: React.Dispatch<React.SetStateAction<KOStageProps>>
}

export const handleDeleteKOStage = async ({
    accessToken,
    refreshToken,
    setApiError,
    setKOStage,
}: handleDeleteKOStageProps) => {
    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/v1/ko-stage/delete/`,
            {
                method: 'DELETE',
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
                    'An error occurred while deleting the current knockout stage.'
            )
            return
        }

        setItemInStorage('isgroupstageover', false)
        setItemInStorage('kostage', [])
        setItemInSessionStorage('kostagepage', 1)
        setKOStage([])
    } catch (error: any) {
        setApiError(
            'An error occurred while deleting the current knockout stage.'
        )
    }
}
