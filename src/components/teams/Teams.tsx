import { useContext, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import PageNavigation from '../page/PageNavigation'
import Team from './Team'
import TeamsError from './TeamsError'
import { ContextGroups } from '../../context/ContextGroups'
import { ContextRegisteredTeams } from '../../context/ContextRegisteredTeams'
import { getStoredData } from '../../utils/getStoredData'
import { handleDeleteTeam } from '../../api/handleDeleteTeam'
import { setItemInStorage } from '../../utils/setItemInStorage'
import { useItemsPerPage } from '../../hooks/useItemsPerPage'
import { useRegisteredTeams } from '../../hooks/useRegisteredTeams'
import { RegisteredTeamProps } from '../../types/types'

export const Teams = () => {
    const parsedStorageData = getStoredData()

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

    const MAX_ITEMS_PER_PAGE = useItemsPerPage()

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )

    const [apiError, setApiError] = useState<string>('')
    const [page, setPage] = useState<number>(parsedStorageData?.teampage || 1)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useRegisteredTeams({
        accessToken,
        refreshToken,
        setApiError,
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
            setApiError,
            setItemInStorage,
            setGroups,
            setRegisteredTeams,
        })
    }

    const previousPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1)
            setItemInStorage('teampage', page - 1)
        }
    }

    const nextPage = () => {
        setPage((prev) => prev + 1)
        setItemInStorage('teampage', page + 1)
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
    } else if (apiError) {
        content = <TeamsError error={apiError} />
    } else if (registeredTeams?.length > 0) {
        content = (
            <>
                <h2 className="text-center text-large px-1">
                    Currently registered Teams:
                </h2>
                <ul>
                    {teams.filter((item, index) => {
                        if (
                            index >= (page - 1) * MAX_ITEMS_PER_PAGE &&
                            index < page * MAX_ITEMS_PER_PAGE
                        )
                            return item
                    })}
                </ul>
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
            <h1 className="text-center font-semibold text-extra-large">
                Registered Teams
            </h1>
            {content}
        </main>
    )
}

export default Teams
