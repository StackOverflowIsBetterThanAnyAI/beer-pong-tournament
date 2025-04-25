import { useContext, useEffect, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import { ContextGroups } from '../../context/ContextGroups'
import { ContextRegisteredTeams } from '../../context/ContextRegisteredTeams'
import { ContextSchedule } from '../../context/ContextSchedule'
import {
    MAX_TEAMS,
    MIN_TEAMS,
    TEAMS_PER_GROUP,
} from '../../constants/constants'
import FormError from '../form/FormError'
import FormHeader from '../form/FormHeader'
import Groups from './Groups'
import { getStoredData } from '../../utils/getStoredData'
import { handleGenerateGroups } from '../../api/handleGenerateGroups'
import { handleLoadGroups } from '../../api/handleLoadGroups'
import { useRegisteredTeams } from '../../hooks/useRegisteredTeams'

export const GroupsGenerator = () => {
    const parsedStorageData = getStoredData()

    const contextGroups = useContext(ContextGroups)
    if (!contextGroups) {
        throw new Error(
            'GroupGenerator must be used within a ContextGroups.Provider'
        )
    }
    const [groups, setGroups] = contextGroups

    const contextRegisteredTeams = useContext(ContextRegisteredTeams)
    if (!contextRegisteredTeams) {
        throw new Error(
            'GroupGenerator must be used within a ContextRegisteredTeams.Provider'
        )
    }
    const [registeredTeams, setRegisteredTeams] = contextRegisteredTeams

    const contextSchedule = useContext(ContextSchedule)
    if (!contextSchedule) {
        throw new Error(
            'GroupGenerator must be used within a ContextSchedule.Provider'
        )
    }
    const [_schedule, setSchedule] = contextSchedule

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )

    const [page, setPage] = useState<number>(parsedStorageData?.grouppage || 1)

    const [isStartDisabled, setIsStartDisabled] = useState<boolean>(true)
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false)

    const [apiError, setApiError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useRegisteredTeams({
        accessToken,
        refreshToken,
        setApiError,
        setIsLoading,
        setRegisteredTeams,
    })

    const loadGroups = async () => {
        handleLoadGroups({
            accessToken,
            refreshToken,
            setApiError,
            setGroups,
            setPage,
        })
    }

    useEffect(() => {
        loadGroups()
    }, [accessToken, refreshToken])

    useEffect(() => {
        setIsStartDisabled(
            !(
                registeredTeams.length >= MIN_TEAMS &&
                registeredTeams.length % TEAMS_PER_GROUP === 0 &&
                registeredTeams.length <= MAX_TEAMS
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

        handleGenerateGroups({
            accessToken,
            groups,
            loadGroups,
            refreshToken,
            setApiError,
            setSchedule,
            setIsLoading,
            setIsSubmitDisabled,
        })
    }

    return (
        <main className="w-full flex flex-col bg-stone-300 text-stone-950 sm:w-80 md:w-112 sm:rounded-lg p-3 sm:p-4 md:p-6 drop-shadow-stone-900 drop-shadow-sm">
            <FormHeader header="Tournament" />
            {isLoading ? (
                <div className="flex justify-center">
                    <FetchLoading theme="#44403c" />
                </div>
            ) : (
                <div className="text-center text-large">
                    {registeredTeams.length} / {MAX_TEAMS} Teams
                </div>
            )}
            <button
                className="text-normal outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 h-7 w-fit m-auto px-8 py-0.5 mt-2 rounded-md
                        not-[:disabled]:hover:bg-stone-400/40 not-[:disabled]:active:bg-stone-400/70"
                onClick={handleStartTournament}
                aria-label={`${
                    isStartDisabled
                        ? 'The amount of teams has to be divisible by 4, and must be at least 8.'
                        : 'Generate Groups.'
                }`}
                title={`${
                    isStartDisabled
                        ? 'The amount of teams has to be divisible by 4, and must be at least 8.'
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
            ) : groups.length ? (
                <Groups groups={groups} page={page} setPage={setPage} />
            ) : null}
        </main>
    )
}

export default GroupsGenerator
