import { useContext, useEffect, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import FormHeader from '../form/FormHeader'
import PageNavigation from '../page/PageNavigation'
import StandingsItem from './StandingsItem'
import TeamsError from '../teams/TeamsError'
import { ContextStandings } from '../../context/ContextStandings'
import { getStoredData } from '../../utils/getStoredData'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import { handleLoadStandings } from '../../api/handleLoadStandings'
import { useTeamsPerPage } from '../../hooks/useTeamsPerPage'

const Standings = () => {
    const MAX_ITEMS_PER_PAGE = useTeamsPerPage()

    const parsedStorageData = getStoredData()

    const contextStandings = useContext(ContextStandings)
    if (!contextStandings) {
        throw new Error(
            'Standings must be used within a ContextStandings.Provider'
        )
    }
    const [standings, setStandings] = contextStandings

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )

    const [apiError, setApiError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(
        parsedStorageData?.standingspage || 1
    )

    const previousPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1)
            setItemInSessionStorage('standingspage', page - 1)
        }
    }

    const nextPage = () => {
        setPage((prev) => prev + 1)
        setItemInSessionStorage('standingspage', page + 1)
    }

    useEffect(() => {
        handleLoadStandings({
            accessToken,
            refreshToken,
            setApiError,
            setIsLoading,
            setStandings,
        })
    }, [])

    return (
        <main className="w-full bg-stone-300 text-stone-950 sm:w-80 md:w-112 sm:rounded-lg p-3 sm:p-4 md:p-6 drop-shadow-stone-900 drop-shadow-sm">
            <FormHeader
                header="Standings"
                subHeader={`${!standings.length ? 'no content' : ''}`}
            />
            {isLoading ? (
                <div className="flex justify-center pt-4 pb-2">
                    <FetchLoading theme="#44403c" />
                </div>
            ) : apiError ? (
                <TeamsError error={apiError} />
            ) : standings.length ? (
                <>
                    <StandingsItem
                        MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE}
                        page={page}
                        standings={standings}
                    />
                    <PageNavigation
                        MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE}
                        nextPage={nextPage}
                        page={page}
                        previousPage={previousPage}
                        registeredTeams={standings}
                    />
                </>
            ) : null}
        </main>
    )
}

export default Standings
