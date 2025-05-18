import { useEffect, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import FormHeader from '../form/FormHeader'
import PageNavigation from '../page/PageNavigation'
import StandingsItem from './StandingsItem'
import StandingsLegend from './StandingsLegend'
import TeamsError from '../teams/TeamsError'
import { StandingsProps } from '../../types/types'
import { getStoredData } from '../../utils/getStoredData'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { handleLoadStandings } from '../../api/handleLoadStandings'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import { useTeamsPerPage } from '../../hooks/useTeamsPerPage'
import { useUpdatePage } from '../../hooks/useUpdatePage'
import { useWindowScrollYState } from '../../hooks/useWindowScrollYState'

const Standings = () => {
    const MAX_ITEMS_PER_PAGE = useTeamsPerPage()
    const parsedSessionData = getStoredSessionData()

    const parsedStorageData = getStoredData()

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )

    const [standings, setStandings] = useState<StandingsProps>(
        parsedStorageData?.standings || []
    )

    const [apiError, setApiError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(
        parsedSessionData?.standingspage || 1
    )

    useUpdatePage({
        items: standings,
        key: 'standingspage',
        MAX_ITEMS_PER_PAGE,
        page,
        setPage,
    })

    useEffect(() => {
        handleLoadStandings({
            accessToken,
            refreshToken,
            setApiError,
            setIsLoading,
            setStandings,
        })
    }, [])

    useWindowScrollYState()

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

    return (
        <main className="w-full max-w-7xl relative isolate bg-stone-300 text-stone-950 lg:rounded-lg p-3 sm:p-4 lg:p-6 drop-shadow-stone-900 drop-shadow-sm">
            <FormHeader
                header="Standings"
                subHeader={`${standings.length ? 'standings' : ''}`}
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
                    <StandingsLegend standings={standings} />
                    {standings.length > MAX_ITEMS_PER_PAGE ? (
                        <PageNavigation
                            MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE}
                            nextPage={nextPage}
                            page={page}
                            previousPage={previousPage}
                            registeredTeams={standings}
                        />
                    ) : null}
                </>
            ) : (
                <div className="pt-1 pb-5 sm:pb-4 lg:pb-2">
                    <FormHeader subHeader="no content" />
                </div>
            )}
        </main>
    )
}

export default Standings
