import { SERVER_ADDRESS } from '../constants/constants'
import { TournamentGroupsProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'

type handleLoadGroupsProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setGroups: (value: React.SetStateAction<TournamentGroupsProps>) => void
    setItemInStorage(key: string, value: any): void
    setPage: React.Dispatch<React.SetStateAction<number>>
}

export const handleLoadGroups = async ({
    accessToken,
    refreshToken,
    setApiError,
    setGroups,
    setItemInStorage,
    setPage,
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
            setApiError(getValueFromError(errorData))
            return
        }

        const groups: TournamentGroupsProps = await response.json()
        setGroups(groups)
        setItemInStorage('groups', groups)
        setItemInStorage('grouppage', 1)
        setPage(1)
    } catch (error: any) {
        setApiError('An unexpected error occurred while loading the groups.')
    }
}
