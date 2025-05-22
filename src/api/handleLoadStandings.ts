import { SERVER_ADDRESS } from '../constants/constants'
import { StandingsProps } from '../types/types'
import { getAbortSignal } from './abortControllerManager'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInStorage } from '../utils/setItemInStorage'

type handleLoadStandingsProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setStandings: React.Dispatch<React.SetStateAction<StandingsProps>>
}

export const handleLoadStandings = async ({
    accessToken,
    refreshToken,
    setApiError,
    setIsLoading,
    setStandings,
}: handleLoadStandingsProps) => {
    setIsLoading(true)
    setApiError('')
    setItemInStorage('standings', [])
    setStandings([])

    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/v1/groups/standings/`,
            {
                method: 'GET',
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
                    'An error occurred while fetching the current standings.'
            )
            return
        }

        const standings: StandingsProps = await response.json()
        setItemInStorage('standings', standings)
        setStandings(standings)
    } catch (error: any) {
        setApiError('An error occurred while fetching the current standings.')
    } finally {
        setIsLoading(false)
    }
}
