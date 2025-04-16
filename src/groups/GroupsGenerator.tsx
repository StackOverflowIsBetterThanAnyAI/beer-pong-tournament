import { useContext, useEffect, useState } from 'react'
import { ContextRegisteredTeams } from '../context/ContextRegisteredTeams'
import { MAX_TEAMS, SERVER_ADDRESS } from '../constants/constants'
import FormError from '../components/form/FormError'
import FormHeader from '../components/form/FormHeader'
import Groups from './Groups'
import { getStoredData } from '../utils/getStoredData'
import { getValueFromError } from '../utils/getValueFromError'
import { getValidToken } from '../utils/getValidToken'
import { setItemInStorage } from '../utils/setItemInStorage'
import { TournamentGroupsProps } from '../types/tpyes'
import { FetchLoading } from 'fetch-loading'

export const GroupsGenerator = () => {
    const parsedStorageData = getStoredData()

    const contextRegisteredTeams = useContext(ContextRegisteredTeams)
    if (!contextRegisteredTeams) {
        throw new Error(
            'StartTournament must be used within a ContextRegisteredTeams.Provider'
        )
    }
    const [registeredTeams, _setRegisteredTeams] = contextRegisteredTeams

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )

    const [isStartDisabled, setIsStartDisabled] = useState<boolean>(true)
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false)

    const [groups, setGroups] = useState<TournamentGroupsProps>(
        parsedStorageData?.groups || []
    )

    const [apiError, setApiError] = useState<string>('')

    const loadGroups = async () => {
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

            const groups = await response.json()
            setGroups(groups)
            setItemInStorage('groups', groups)
        } catch (error: any) {
            setApiError(
                'An unexpected error occurred while loading the groups.'
            )
        }
    }

    useEffect(() => {
        loadGroups()
    }, [accessToken, refreshToken])

    useEffect(() => {
        setIsStartDisabled(
            !(
                registeredTeams.length >= 8 &&
                registeredTeams.length % 4 === 0 &&
                registeredTeams.length <= 32
            )
        )
    }, [registeredTeams])

    const handleStartTournament = async () => {
        const shuffledTeams = [...registeredTeams].sort(
            () => 0.5 - Math.random()
        )
        const groups: number[][] = []
        let arr: number[] = []
        for (let i = 0; i < shuffledTeams.length; i++) {
            arr.push(shuffledTeams[i].id)
            if (arr.length % 4 === 0) {
                groups.push(arr)
                arr = []
            }
        }

        setIsSubmitDisabled(true)
        setApiError('')

        try {
            const response = await fetch(
                `${SERVER_ADDRESS}/api/v1/groups/bulk/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${await getValidToken(
                            accessToken,
                            refreshToken
                        )}`,
                    },
                    body: JSON.stringify({ groups }),
                }
            )

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

    return (
        <main className="w-full flex flex-col bg-stone-300 text-stone-950 sm:w-80 md:w-112 sm:rounded-lg p-3 sm:p-4 md:p-6 drop-shadow-stone-900 drop-shadow-sm">
            <FormHeader header="Tournament" />
            <div className="text-center text-large">
                {registeredTeams.length} / {MAX_TEAMS} Teams
            </div>
            <button
                className="text-normal outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 h-7 w-fit m-auto px-8 py-0.5 mt-2 rounded-md
                        not-[:disabled]:hover:bg-stone-400/40 not-[:disabled]:active:bg-stone-400/70"
                onClick={handleStartTournament}
                title={`${
                    isStartDisabled
                        ? 'The amount of teams has to be divisible by 4, and must be at least 8.'
                        : isSubmitDisabled
                        ? 'Re-generate Groups.'
                        : 'Generate Groups.'
                }`}
                disabled={isStartDisabled || isSubmitDisabled}
            >
                {isSubmitDisabled ? (
                    <FetchLoading theme="#44403c" />
                ) : (
                    'Generate Groups'
                )}
            </button>
            {apiError ? (
                <div className="text-center pt-4">
                    <FormError error={apiError} />
                </div>
            ) : (
                <Groups groups={groups} />
            )}
        </main>
    )
}

export default GroupsGenerator
