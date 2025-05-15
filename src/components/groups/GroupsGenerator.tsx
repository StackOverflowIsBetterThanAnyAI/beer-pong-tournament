import { useContext, useEffect, useRef, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import FormError from '../form/FormError'
import FormErrorOpacity from '../form/FormErrorOpacity'
import FormHeader from '../form/FormHeader'
import Groups from './Groups'
import TeamsError from '../teams/TeamsError'
import {
    MAX_TEAMS,
    MIN_TEAMS,
    TEAMS_PER_GROUP,
} from '../../constants/constants'
import { ContextAdmin } from '../../context/ContextAdmin'
import { ContextGroups } from '../../context/ContextGroups'
import { ContextKOStage } from '../../context/ContextKOStage'
import { ContextRegisteredTeams } from '../../context/ContextRegisteredTeams'
import { ContextSchedule } from '../../context/ContextSchedule'
import { getStoredData } from '../../utils/getStoredData'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { handleGenerateGroups } from '../../api/handleGenerateGroups'
import { handleLoadGroups } from '../../api/handleLoadGroups'
import { handleLoadRegisteredTeams } from '../../api/handleLoadRegisteredTeams'
import { useAutoFocus } from '../../hooks/useAutoFocus'

export const GroupsGenerator = () => {
    const parsedStorageData = getStoredData()
    const parsedSessionData = getStoredSessionData()

    const contextAdmin = useContext(ContextAdmin)
    if (!contextAdmin) {
        throw new Error(
            'GroupsGenerator must be used within a ContextAdmin.Provider'
        )
    }
    const [isAdmin, _setIsAdmin] = contextAdmin

    const contextGroups = useContext(ContextGroups)
    if (!contextGroups) {
        throw new Error(
            'GroupGenerator must be used within a ContextGroups.Provider'
        )
    }
    const [groups, setGroups] = contextGroups

    const contextKOStage = useContext(ContextKOStage)
    if (!contextKOStage) {
        throw new Error(
            'GroupsGenerator must be used within a ContextKOStage.Provider'
        )
    }
    const [_koStage, setKOStage] = contextKOStage

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

    const [page, setPage] = useState<number>(parsedSessionData?.grouppage || 1)

    const [isStartDisabled, setIsStartDisabled] = useState<boolean>(true)
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false)

    const [apiErrorGenerate, setApiErrorGenerate] = useState<string>('')
    const [apiErrorLoad, setApiErrorLoad] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const startButtonRef = useRef<HTMLButtonElement>(null)

    useAutoFocus(startButtonRef)

    handleLoadRegisteredTeams({
        accessToken,
        refreshToken,
        setApiError: setApiErrorLoad,
        setIsLoading,
        setRegisteredTeams,
    })

    const loadGroups = async () => {
        handleLoadGroups({
            accessToken,
            refreshToken,
            setApiError: setApiErrorLoad,
            setIsLoading,
            setGroups,
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
                registeredTeams.length <= MAX_TEAMS &&
                registeredTeams.length !== 20
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
        setApiErrorGenerate('')

        handleGenerateGroups({
            accessToken,
            groups,
            loadGroups,
            refreshToken,
            setApiError: setApiErrorGenerate,
            setKOStage,
            setSchedule,
            setIsLoading,
            setIsSubmitDisabled,
        })
    }

    return (
        <main className="w-full max-w-7xl relative isolate flex flex-col bg-stone-300 text-stone-950 lg:rounded-lg p-3 sm:p-4 lg:p-6 drop-shadow-stone-900 drop-shadow-sm">
            <FormHeader header="Groups" />
            {isLoading ? (
                <div className="flex justify-center">
                    <FetchLoading theme="#44403c" />
                </div>
            ) : (
                <div className="text-center text-large">
                    {registeredTeams.length} / {MAX_TEAMS} Teams
                </div>
            )}
            {isAdmin ? (
                <button
                    className="text-normal bg-stone-300 outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 h-7 lg:h-8 w-fit m-auto px-8 py-0.5 mt-2 rounded-md
                        not-[:disabled]:hover:bg-stone-400/40 not-[:disabled]:active:bg-stone-400/70"
                    onClick={handleStartTournament}
                    aria-label={`${
                        isStartDisabled
                            ? 'Start Disabled. The amount of teams has to be divisible by 4, and must be at least 8, but cannot be 20.'
                            : groups.length
                            ? 'Regenerate Groups and restart Tournament. All Process will be lost.'
                            : 'Generate Groups and start Tournament.'
                    }`}
                    title={`${
                        isStartDisabled
                            ? 'The amount of teams has to be divisible by 4, and must be at least 8, but cannot be 20.'
                            : groups.length
                            ? 'Regenerate Groups and restart Tournament. All Process will be lost.'
                            : 'Generate Groups and start Tournament.'
                    }`}
                    disabled={isStartDisabled || isSubmitDisabled || isLoading}
                    ref={startButtonRef}
                >
                    {isSubmitDisabled ? (
                        <FetchLoading theme="#44403c" />
                    ) : groups.length ? (
                        'Restart Tournament'
                    ) : (
                        'Start Tournament'
                    )}
                </button>
            ) : null}
            {apiErrorGenerate ? (
                <div className="text-center pt-4">
                    <FormErrorOpacity error={apiErrorGenerate} />
                </div>
            ) : null}
            {apiErrorLoad ? (
                <div className="text-center pt-4">
                    <FormError error={apiErrorLoad} />
                </div>
            ) : groups.length ? (
                <>
                    <div className="w-full">
                        <Groups groups={groups} page={page} setPage={setPage} />
                    </div>
                </>
            ) : (
                <div className="pt-2">
                    {!isAdmin ? (
                        <FormHeader subHeader="no content" />
                    ) : isStartDisabled ? (
                        <TeamsError error="The amount of teams has to be divisible by 4, and must be at least 8, but cannot be 20." />
                    ) : (
                        <FormHeader subHeader="no content" />
                    )}
                </div>
            )}
        </main>
    )
}

export default GroupsGenerator
