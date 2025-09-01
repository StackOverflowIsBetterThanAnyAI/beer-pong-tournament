import { useContext, useEffect, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import FormHeader from '../form/FormHeader'
import PageNavigation from '../page/PageNavigation'
import Team from './Team'
import TeamsError from './TeamsError'
import TeamsErrorOpacity from './TeamsErrorOpacity'
import { MAX_TEAMS } from '../../constants/constants'
import { ContextGroups } from '../../context/ContextGroups'
import { ContextKOStage } from '../../context/ContextKOStage'
import { ContextRegisteredTeams } from '../../context/ContextRegisteredTeams'
import { ContextSchedule } from '../../context/ContextSchedule'
import { RegisteredTeamProps } from '../../types/types'
import { getStoredData } from '../../utils/getStoredData'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import { handleDeleteTeam } from '../../api/handleDeleteTeam'
import { handleLoadRegisteredTeams } from '../../api/handleLoadRegisteredTeams'
import { useItemsPerPage } from '../../hooks/useItemsPerPage'
import { useWindowScrollYState } from '../../hooks/useWindowScrollYState'

export const Teams = () => {
    const parsedStorageData = getStoredData()
    const parsedSessionData = getStoredSessionData()

    const contextGroups = useContext(ContextGroups)
    if (!contextGroups) {
        throw new Error('Teams must be used within a ContextGroups.Provider')
    }
    const [_groups, setGroups] = contextGroups

    const contextKOStage = useContext(ContextKOStage)
    if (!contextKOStage) {
        throw new Error('Teams must be used within a ContextKOStage.Provider')
    }
    const [_koStage, setKOStage] = contextKOStage

    const contextRegisteredTeams = useContext(ContextRegisteredTeams)
    if (!contextRegisteredTeams) {
        throw new Error(
            'Teams must be used within a ContextRegisteredTeams.Provider'
        )
    }
    const [registeredTeams, setRegisteredTeams] = contextRegisteredTeams

    const contextSchedule = useContext(ContextSchedule)
    if (!contextSchedule) {
        throw new Error('Teams must be used within a ContextSchedule.Provider')
    }
    const [_schedule, setSchedule] = contextSchedule

    const MAX_ITEMS_PER_PAGE = useItemsPerPage()

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )

    const [apiErrorLoad, setApiErrorLoad] = useState<string>('')
    const [apiErrorDelete, setApiErrorDelete] = useState<string>('')
    const [page, setPage] = useState<number>(parsedSessionData?.teampage || 1)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        handleLoadRegisteredTeams({
            accessToken,
            refreshToken,
            setApiError: setApiErrorLoad,
            setIsLoading,
            setRegisteredTeams,
        })
    }, [
        accessToken,
        refreshToken,
        setApiErrorLoad,
        setIsLoading,
        setRegisteredTeams,
    ])

    useWindowScrollYState()

    const handleDelete = async (item: RegisteredTeamProps) => {
        handleDeleteTeam({
            accessToken,
            item,
            MAX_ITEMS_PER_PAGE,
            page,
            previousPage,
            refreshToken,
            registeredTeams,
            setApiError: setApiErrorDelete,
            setIsLoading,
            setKOStage,
            setSchedule,
            setGroups,
            setRegisteredTeams,
        })
    }

    const previousPage = () => {
        if (page > 1) {
            setApiErrorDelete('')
            setPage((prev) => prev - 1)
            setItemInSessionStorage('teampage', page - 1)
        }
    }

    const nextPage = () => {
        setApiErrorDelete('')
        setPage((prev) => prev + 1)
        setItemInSessionStorage('teampage', page + 1)
    }

    const teams = registeredTeams.map((item, index) => {
        return (
            <Team
                handleDelete={handleDelete}
                index={index}
                isLoading={isLoading}
                item={item}
                key={item.id}
            />
        )
    })

    return (
        <main
            className="w-full max-w-7xl relative isolate bg-stone-300 text-stone-950 lg:rounded-lg p-3 sm:p-4 lg:p-6
            drop-shadow-stone-500 dark:drop-shadow-stone-900 drop-shadow-sm"
        >
            <h1 className="text-center font-semibold text-extra-large pt-2">
                Registered Teams
            </h1>
            {isLoading ? (
                <div className="flex justify-center pt-4 pb-2">
                    <FetchLoading theme="#44403c" />
                </div>
            ) : apiErrorLoad ? (
                <TeamsError error={apiErrorLoad} />
            ) : registeredTeams?.length > 0 ? (
                <>
                    <h2
                        className="text-center text-pretty text-large px-1 lg:py-1"
                        aria-label={`Currently registered Teams: ${registeredTeams.length} out of ${MAX_TEAMS}`}
                    >
                        Currently registered Teams: {registeredTeams.length} /{' '}
                        {MAX_TEAMS}
                    </h2>
                    <ul
                        className="flex flex-col sm:grid [grid-template-columns:repeat(auto-fit,minmax(256px,1fr))] gap-4 lg:gap-5 max-w-96 w-full sm:max-w-5xl mx-auto my-4 p-1.5 lg:p-2 rounded-sm"
                        role="menu"
                    >
                        {teams.filter((item, index) => {
                            if (
                                index >= (page - 1) * MAX_ITEMS_PER_PAGE &&
                                index < page * MAX_ITEMS_PER_PAGE
                            )
                                return item
                        })}
                    </ul>
                    {apiErrorDelete ? (
                        <TeamsErrorOpacity error={apiErrorDelete} />
                    ) : null}
                    {teams.length > MAX_ITEMS_PER_PAGE ? (
                        <PageNavigation
                            MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE}
                            nextPage={nextPage}
                            page={page}
                            previousPage={previousPage}
                            registeredTeams={registeredTeams}
                        />
                    ) : null}
                </>
            ) : (
                <div className="pt-1 pb-5 sm:pb-4 lg:pb-2">
                    <FormHeader subHeader="no content teams" />
                </div>
            )}
        </main>
    )
}

export default Teams
