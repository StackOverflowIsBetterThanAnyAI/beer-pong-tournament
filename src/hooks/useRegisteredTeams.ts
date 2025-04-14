import { useEffect } from 'react'
import { SERVER_ADDRESS } from '../constants/constants'
import { getValidToken } from '../utils/getValidToken'
import { setItemInStorage } from '../utils/setItemInStorage'

type useRegisteredTeamsProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
}

export const useRegisteredTeams = ({
    accessToken,
    refreshToken,
    setApiError,
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
                    const errorData = await response.json()
                    setApiError(errorData.error.join(''))
                    return
                }

                const result = await response.json()
                setItemInStorage('registeredteams', result)
            } catch (error) {
                console.error(error)
            }
        }
        fetchRegisteredTeams()
    }, [])
}
