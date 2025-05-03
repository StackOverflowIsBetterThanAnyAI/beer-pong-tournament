import { useContext, useEffect, useState } from 'react'
import FormError from '../form/FormError'
import FormHeader from '../form/FormHeader'
import ScheduleItem from './ScheduleItem'
import { ContextSchedule } from '../../context/ContextSchedule'
import { FetchLoading } from 'fetch-loading'
import { getStoredData } from '../../utils/getStoredData'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import { handleLoadSchedule } from '../../api/handleLoadSchedule'
import { useTeamsPerPage } from '../../hooks/useTeamsPerPage'

const Schedule = () => {
    const MAX_ITEMS_PER_PAGE = useTeamsPerPage()

    const parsedStorageData = getStoredData()
    const parsedSessionData = getStoredSessionData()

    const contextSchedule = useContext(ContextSchedule)
    if (!contextSchedule) {
        throw new Error(
            'Schedule must be used within a ContextSchedule.Provider'
        )
    }
    const [schedule, setSchedule] = contextSchedule

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )

    const [apiError, setApiError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(
        parsedSessionData?.schedulepage || 1
    )

    useEffect(() => {
        handleLoadSchedule({
            accessToken,
            refreshToken,
            setApiError,
            setSchedule,
            setIsLoading,
        })
    }, [])

    const previousPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1)
            setItemInSessionStorage('schedulepage', page - 1)
        }
    }

    const nextPage = () => {
        setPage((prev) => prev + 1)
        setItemInSessionStorage('schedulepage', page + 1)
    }

    return (
        <main className="w-full relative isolate bg-stone-300 text-stone-950 sm:rounded-lg p-3 sm:p-4 md:p-6 drop-shadow-stone-900 drop-shadow-sm">
            <FormHeader
                header="Schedule"
                subHeader={`${!schedule.length ? 'no content' : 'schedule'}`}
            />
            {apiError ? (
                <div className="text-center pt-4">
                    <FormError error={apiError} />
                </div>
            ) : isLoading ? (
                <div className="flex justify-center">
                    <FetchLoading theme="#44403c" />
                </div>
            ) : schedule.length ? (
                <ScheduleItem
                    MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE}
                    nextPage={nextPage}
                    page={page}
                    previousPage={previousPage}
                />
            ) : null}
        </main>
    )
}

export default Schedule
