import { useContext, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import PageNavigation from '../page/PageNavigation'
import Team from './Team'
import TeamsError from './TeamsError'
import TeamsErrorOpacity from './TeamsErrorOpacity'
import { ContextGroups } from '../../context/ContextGroups'
import { ContextRegisteredTeams } from '../../context/ContextRegisteredTeams'
import { ContextSchedule } from '../../context/ContextSchedule'
import { RegisteredTeamProps } from '../../types/types'
import { getStoredData } from '../../utils/getStoredData'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import { handleDeleteTeam } from '../../api/handleDeleteTeam'
import { useItemsPerPage } from '../../hooks/useItemsPerPage'
import { useRegisteredTeams } from '../../hooks/useRegisteredTeams'

export const Teams = () => {
    const parsedStorageData = getStoredData()
    const parsedSessionData = getStoredSessionData()

    const contextGroups = useContext(ContextGroups)
    if (!contextGroups) {
        throw new Error('Teams must be used within a ContextGroups.Provider')
    }
    const [_groups, setGroups] = contextGroups

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

    useRegisteredTeams({
        accessToken,
        refreshToken,
        setApiError: setApiErrorLoad,
        setIsLoading,
        setRegisteredTeams,
    })

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

    const teams = registeredTeams.map((item) => {
        return <Team handleDelete={handleDelete} item={item} key={item.id} />
    })

    let content

    if (isLoading) {
        content = (
            <div className="flex justify-center pt-8 pb-4">
                <FetchLoading theme="#44403c" />
            </div>
        )
    } else if (apiErrorLoad) {
        content = <TeamsError error={apiErrorLoad} />
    } else if (registeredTeams?.length > 0) {
        content = (
            <>
                <h2 className="text-center text-large px-1">
                    Currently registered Teams:
                </h2>
                <ul role="menu">
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
                <PageNavigation
                    MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE}
                    nextPage={nextPage}
                    page={page}
                    previousPage={previousPage}
                    registeredTeams={registeredTeams}
                />
            </>
        )
    } else {
        content = (
            <h2 className="text-center text-large px-1">
                Currently, no Teams have registered yet.
            </h2>
        )
    }

    return (
        <main className="w-full bg-stone-300 text-stone-950 sm:w-80 md:w-112 sm:rounded-lg p-3 sm:p-4 md:p-6 drop-shadow-stone-900 drop-shadow-sm">
            <h1 className="text-center font-semibold text-extra-large pt-2">
                Registered Teams
            </h1>
            {content}
        </main>
    )
}

export default Teams
