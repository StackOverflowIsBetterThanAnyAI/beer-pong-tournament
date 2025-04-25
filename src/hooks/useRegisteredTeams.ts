import { useEffect } from 'react'
import { SERVER_ADDRESS } from '../constants/constants'
import { RegisteredTeamsProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInStorage } from '../utils/setItemInStorage'

type useRegisteredTeamsProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setRegisteredTeams: React.Dispatch<
        React.SetStateAction<RegisteredTeamsProps>
    >
}

export const useRegisteredTeams = ({
    accessToken,
    refreshToken,
    setApiError,
    setIsLoading,
    setRegisteredTeams,
}: useRegisteredTeamsProps) => {
    useEffect(() => {
        const fetchRegisteredTeams = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(
                    `${SERVER_ADDRESS}/api/v1/teams/`,
                    {
                        method: 'GET',
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
                            'An error occurred while fetching the registered teams.'
                    )
                    return
                }

                const result = await response.json()
                setRegisteredTeams(result)
                setItemInStorage('registeredteams', result)
            } catch (error: any) {
                setApiError(
                    'An error occurred while fetching the registered teams.'
                )
            } finally {
                setIsLoading(false)
            }
        }
        fetchRegisteredTeams()
    }, [
        accessToken,
        refreshToken,
        setApiError,
        setIsLoading,
        setRegisteredTeams,
    ])
}
