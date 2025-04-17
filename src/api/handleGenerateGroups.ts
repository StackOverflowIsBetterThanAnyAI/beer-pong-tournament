import { SERVER_ADDRESS } from '../constants/constants'
import { getValidToken } from '../utils/getValidToken'
import { getValueFromError } from '../utils/getValueFromError'

type handleGenerateGroupsProps = {
    accessToken: string
    groups: number[][]
    loadGroups: () => Promise<void>
    refreshToken: string
    setApiError: (value: React.SetStateAction<string>) => void
    setIsSubmitDisabled: (value: React.SetStateAction<boolean>) => void
}

export const handleGenerateGroups = async ({
    accessToken,
    groups,
    loadGroups,
    refreshToken,
    setApiError,
    setIsSubmitDisabled,
}: handleGenerateGroupsProps) => {
    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/v1/groups/bulk/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getValidToken(
                    accessToken,
                    refreshToken
                )}`,
            },
            body: JSON.stringify({ groups }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            setApiError(getValueFromError(errorData))
            return
        }

        loadGroups()
    } catch (error: any) {
        setApiError(
            'An unexpected error occurred while starting the tournament.'
        )
    } finally {
        setIsSubmitDisabled(false)
    }
}
