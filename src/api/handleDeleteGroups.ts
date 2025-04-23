import { SERVER_ADDRESS } from '../constants/constants'
import { TournamentGroupsProps } from '../types/types'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'

type handleDeleteGroupsProps = {
    accessToken: string
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setGroups: (value: React.SetStateAction<TournamentGroupsProps>) => void
    setItemInStorage(key: string, value: any): void
}

export const handleDeleteGroups = async ({
    accessToken,
    refreshToken,
    setApiError,
    setGroups,
    setItemInStorage,
}: handleDeleteGroupsProps) => {
    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/v1/groups/delete/`,
            {
                method: 'DELETE',
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
            setApiError(getValueFromError(errorData))
            return
        }

        setItemInStorage('groups', [])
        setItemInStorage('grouppage', 1)
        setGroups([])
    } catch (error: any) {
        setApiError(
            'An unexpected error occurred while deleting the current groups.'
        )
    }
}
