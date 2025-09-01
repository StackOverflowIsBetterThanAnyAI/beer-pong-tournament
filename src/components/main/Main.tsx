import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FetchLoading } from 'fetch-loading'
import FormHeader from '../form/FormHeader'
import KnockoutChampion from '../knockout/KnockoutChampion'
import MainMatch from './MainMatch'
import { MAX_TEAMS } from '../../constants/constants'
import { ContextGroups } from '../../context/ContextGroups'
import { ContextKOStage } from '../../context/ContextKOStage'
import { ContextRegisteredTeams } from '../../context/ContextRegisteredTeams'
import { ContextSchedule } from '../../context/ContextSchedule'
import { ContextTournamentWinner } from '../../context/ContextTournamentWinner'
import { GameProps, KOMatchProps } from '../../types/types'
import { getStoredData } from '../../utils/getStoredData'
import { handleLoadGroups } from '../../api/handleLoadGroups'
import { handleLoadKOStage } from '../../api/handleLoadKOStage'
import { handleLoadRegisteredTeams } from '../../api/handleLoadRegisteredTeams'
import { handleLoadSchedule } from '../../api/handleLoadSchedule'
import { useAutoFocus } from '../../hooks/useAutoFocus'
import { useWindowScrollYState } from '../../hooks/useWindowScrollYState'

const Main = () => {
    const parsedStorageData = getStoredData()
    const navigate = useNavigate()

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
            'Knockout must be used within a ContextKOStage.Provider'
        )
    }
    const [koStage, setKOStage] = contextKOStage

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
    const [schedule, setSchedule] = contextSchedule

    const contextTournamentWinner = useContext(ContextTournamentWinner)
    if (!contextTournamentWinner) {
        throw new Error(
            'KnockoutMatchScore must be used within a ContextTournamentWinner.Provider'
        )
    }
    const [tournamentWinner, setTournamentWinner] = contextTournamentWinner

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )

    const [apiError, setApiError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [lastMatch, setLastMatch] = useState<GameProps | null>(null)
    const [upcomingMatch, setUpcomingMatch] = useState<GameProps | null>(null)

    const [lastKOMatch, setLastKOMatch] = useState<KOMatchProps | null>(null)
    const [upcomingKOMatch, setUpcomingKOMatch] = useState<KOMatchProps | null>(
        null
    )

    const [isGroupstageOver, _setIsGroupstageOver] = useState<boolean>(
        parsedStorageData?.isgroupstageover ?? false
    )

    const anchorRef = useRef<HTMLAnchorElement>(null)

    useAutoFocus(anchorRef, !isLoading)

    const loadSchedule = async () => {
        handleLoadSchedule({
            accessToken,
            refreshToken,
            setApiError,
            setSchedule,
            setIsLoading,
        })
    }

    const loadGroups = async () => {
        handleLoadGroups({
            accessToken,
            refreshToken,
            setApiError,
            setIsLoading,
            setGroups,
        })
    }

    useEffect(() => {
        loadGroups()
        loadSchedule()
    }, [accessToken, refreshToken])

    useEffect(() => {
        handleLoadRegisteredTeams({
            accessToken,
            refreshToken,
            setApiError,
            setIsLoading,
            setRegisteredTeams,
        })
    }, [
        accessToken,
        refreshToken,
        setApiError,
        setIsLoading,
        setRegisteredTeams,
    ])

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLAnchorElement>,
        href: string
    ) => {
        if (e.key === ' ') {
            e.preventDefault()
            navigate(href)
        }
    }

    useEffect(() => {
        const played = schedule.filter((item) => item.played)
        setLastMatch(played.length ? played[played.length - 1] : null)

        const notPlayed = schedule.filter((item) => !item.played)
        setUpcomingMatch(notPlayed.length ? notPlayed[0] : null)
    }, [schedule])

    useEffect(() => {
        if (isGroupstageOver) {
            handleLoadKOStage({
                accessToken,
                refreshToken,
                setApiError,
                setKOStage,
                setTournamentWinner,
            })
        }
    }, [isGroupstageOver])

    useEffect(() => {
        const played = koStage.filter((item) => item.played)
        setLastKOMatch(played.length ? played[played.length - 1] : null)

        const notPlayed = koStage.filter((item) => !item.played)
        setUpcomingKOMatch(notPlayed.length ? notPlayed[0] : null)
    }, [koStage])

    useWindowScrollYState()

    return (
        <main
            className="w-full max-w-7xl relative isolate bg-stone-300 text-stone-950 lg:rounded-lg p-3 sm:p-4 lg:p-6
            drop-shadow-stone-500 dark:drop-shadow-stone-900 drop-shadow-sm"
        >
            <FormHeader header="Welcome to the Beer Pong Tournament!" />
            {isLoading ? (
                <div className="flex justify-center pt-2 sm:pb-1 lg:pb-3">
                    <FetchLoading theme="#44403c" />
                </div>
            ) : apiError ? (
                <div className="pb-2">
                    <FormHeader subHeader="no content main" />
                </div>
            ) : tournamentWinner ? (
                <div className="flex flex-col justify-center">
                    <FormHeader subHeader="tournament over" />
                    <KnockoutChampion />
                    <div className="text-center text-normal m-auto pb-2">
                        Stay tuned, the next tournament is just around the
                        corner!
                    </div>
                </div>
            ) : koStage.length ? (
                <div className="flex flex-col justify-center">
                    <FormHeader subHeader="kostage" />
                    <ul
                        className={`flex flex-wrap gap-4 lg:gap-5
                        max-w-96 w-full sm:w-2/3 lg:w-full sm:max-w-lg lg:max-w-5xl
                        mx-auto my-4 lg:my-5`}
                        role="menu"
                    >
                        {lastKOMatch ? <MainMatch item={lastKOMatch} /> : null}
                        {upcomingKOMatch ? (
                            <MainMatch item={upcomingKOMatch} />
                        ) : null}
                    </ul>
                    <Link
                        to="/knockout-stage"
                        onKeyDown={(e) => handleKeyDown(e, '/knockout-stage')}
                        className="relative text-center w-full max-w-64 my-2 mx-auto px-4 py-1 lg:py-1.5 rounded-lg bg-stone-100/90 outline outline-stone-500 active:bg-stone-300 animate-stone-50-stone-300"
                        aria-label="Go to the Knockout Stage."
                        title="Go to the Knockout Stage."
                        ref={anchorRef}
                    >
                        Knockout Stage
                    </Link>
                </div>
            ) : groups.length ? (
                <div className="flex flex-col justify-center">
                    <FormHeader
                        subHeader={`${
                            isGroupstageOver ? 'groupstage over' : 'groupstage'
                        }`}
                    />
                    <ul
                        className={`flex flex-wrap gap-4 lg:gap-5
                        max-w-96 w-full sm:w-2/3 lg:w-full sm:max-w-lg lg:max-w-5xl
                        mx-auto my-4 lg:my-5`}
                        role="menu"
                    >
                        {lastMatch ? <MainMatch item={lastMatch} /> : null}
                        {upcomingMatch ? (
                            <MainMatch item={upcomingMatch} />
                        ) : null}
                    </ul>
                    <Link
                        to="/schedule"
                        onKeyDown={(e) => handleKeyDown(e, '/schedule')}
                        className="relative text-center w-full max-w-64 my-2 mx-auto px-4 py-1 lg:py-1.5 rounded-lg bg-stone-100/90 outline outline-stone-500 active:bg-stone-300 animate-stone-50-stone-300"
                        aria-label="Go to the Results."
                        title="Go to the Results."
                        ref={anchorRef}
                    >
                        Results
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-0.5 lg:gap-1 text-center text-normal">
                    <FormHeader subHeader="no content main" />
                    <div
                        aria-label={`Currently registered Teams: ${registeredTeams.length} out of ${MAX_TEAMS}`}
                    >
                        Currently registered Teams: {registeredTeams.length} /{' '}
                        {MAX_TEAMS}
                    </div>
                    {registeredTeams.length < MAX_TEAMS ? (
                        <>
                            <Link
                                to="/register-team"
                                onKeyDown={(e) =>
                                    handleKeyDown(e, '/register-team')
                                }
                                className="relative text-center w-full max-w-64 my-2 mx-auto px-4 py-1 lg:py-1.5 rounded-lg bg-stone-100/90 outline outline-stone-500 active:bg-stone-300 animate-stone-50-stone-300"
                                aria-label="Register a new Team."
                                title="Register a new Team."
                                ref={anchorRef}
                            >
                                Register Team
                            </Link>
                            <div>Register now before it starts.</div>
                        </>
                    ) : (
                        <div>Unfortunately, all places are already taken.</div>
                    )}
                </div>
            )}
        </main>
    )
}

export default Main
