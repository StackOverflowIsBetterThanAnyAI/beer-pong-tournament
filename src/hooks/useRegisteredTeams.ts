import { useEffect } from 'react'
import { SERVER_ADDRESS } from '../constants/constants'
import { getValidToken } from '../utils/getValidToken'
import { setItemInStorage } from '../utils/setItemInStorage'
import { RegisteredTeamsProps } from '../types/tpyes'

type useRegisteredTeamsProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setRegisteredTeams: React.Dispatch<
        React.SetStateAction<RegisteredTeamsProps>
    >
}

export const useRegisteredTeams = ({
    accessToken,
    refreshToken,
    setApiError,
    setRegisteredTeams,
}: useRegisteredTeamsProps) => {
    useEffect(() => {
        const fetchRegisteredTeams = async () => {
            try {
                const response = await fetch(`${SERVER_ADDRESS}/api/v1/teams`, {
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
                    setApiError(
                        'An error occurred while fetching the registered teams.'
                    )
                    return
                }

                const result = await response.json()
                setRegisteredTeams(result)
                setItemInStorage('registeredteams', result)
            } catch (error: any) {
                setApiError(error)
            }
        }
        fetchRegisteredTeams()
    }, [accessToken, refreshToken, setApiError])
}
