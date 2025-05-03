import { SERVER_ADDRESS } from '../constants/constants'
import { TournamentGroupsProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'
import { setItemInStorage } from '../utils/setItemInStorage'

type handleLoadGroupsProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setGroups: (value: React.SetStateAction<TournamentGroupsProps>) => void
}

export const handleLoadGroups = async ({
    accessToken,
    refreshToken,
    setApiError,
    setGroups,
}: handleLoadGroupsProps) => {
    setApiError('')

    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/v1/groups/`, {
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
                    'An error occurred while loading the groups.'
            )
            return
        }

        const groups: { data: TournamentGroupsProps } = await response.json()
        setGroups(groups.data)
        setItemInStorage('groups', groups.data)
    } catch (error: any) {
        setApiError('An error occurred while loading the groups.')
    }
}
