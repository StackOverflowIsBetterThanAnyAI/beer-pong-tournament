import { SERVER_ADDRESS } from '../constants/constants'
import { RegisteredTeamsProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInStorage } from '../utils/setItemInStorage'

type handleLoadRegisteredTeamsProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setRegisteredTeams: React.Dispatch<
        React.SetStateAction<RegisteredTeamsProps>
    >
}

export const handleLoadRegisteredTeams = async ({
    accessToken,
    refreshToken,
    setApiError,
    setIsLoading,
    setRegisteredTeams,
}: handleLoadRegisteredTeamsProps) => {
    setIsLoading(true)
    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/v1/teams/`, {
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
                    'An error occurred while fetching the registered teams.'
            )
            return
        }

        const teams: RegisteredTeamsProps = await response.json()
        setRegisteredTeams(teams)
        setItemInStorage('registeredteams', teams)
    } catch (error: any) {
        setApiError('An error occurred while fetching the registered teams.')
    } finally {
        setIsLoading(false)
    }
}
