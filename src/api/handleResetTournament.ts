import { SERVER_ADDRESS } from '../constants/constants'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'
import { setItemInStorage } from '../utils/setItemInStorage'

type handleResetTournamentProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setIsDisabled: (value: React.SetStateAction<boolean>) => void
}

export const handleResetTournament = async ({
    accessToken,
    refreshToken,
    setApiError,
    setIsDisabled,
}: handleResetTournamentProps) => {
    setIsDisabled(true)

    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/v1/reset-tournament/`,
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
                    'An error occurred while resetting the tournament.'
            )
            setTimeout(() => setApiError(''), 4000)
            return
        }

        setItemInSessionStorage('grouppage', 1)
        setItemInSessionStorage('schedulepage', 1)
        setItemInSessionStorage('standingspage', 1)

        setItemInStorage('groups', [])
        setItemInStorage('isgroupstageover', false)
        setItemInStorage('kostage', [])
        setItemInStorage('registeredteams', [])
        setItemInStorage('schedule', [])
        setItemInStorage('standings', [])

        window.location.href = '/'
    } catch (error: any) {
        setApiError('An error occurred while resetting the tournament.')
        setTimeout(() => setApiError(''), 4000)
    } finally {
        setIsDisabled(false)
    }
}
