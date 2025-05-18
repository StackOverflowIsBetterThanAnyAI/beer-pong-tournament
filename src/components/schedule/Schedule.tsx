import { useContext, useEffect, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import FormError from '../form/FormError'
import FormHeader from '../form/FormHeader'
import ScheduleItem from './ScheduleItem'
import { MATCHES_PER_GROUP } from '../../constants/constants'
import { ContextSchedule } from '../../context/ContextSchedule'
import { getStoredData } from '../../utils/getStoredData'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { handleLoadSchedule } from '../../api/handleLoadSchedule'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import { useTeamsPerPage } from '../../hooks/useTeamsPerPage'
import { useUpdatePage } from '../../hooks/useUpdatePage'
import { useWindowScrollYState } from '../../hooks/useWindowScrollyState'

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

    useUpdatePage({
        items: schedule,
        key: 'schedulepage',
        MAX_ITEMS_PER_PAGE: MAX_ITEMS_PER_PAGE * MATCHES_PER_GROUP,
        page,
        setPage,
    })

    useEffect(() => {
        handleLoadSchedule({
            accessToken,
            refreshToken,
            setApiError,
            setSchedule,
            setIsLoading,
        })
    }, [])

    useWindowScrollYState()

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
        <main className="w-full max-w-7xl relative isolate bg-stone-300 text-stone-950 lg:rounded-lg p-3 sm:p-4 lg:p-6 drop-shadow-stone-900 drop-shadow-sm">
            <FormHeader
                header="Schedule"
                subHeader={`${schedule.length ? 'schedule' : ''}`}
            />
            {apiError ? (
                <div className="text-center pt-4">
                    <FormError error={apiError} />
                </div>
            ) : isLoading ? (
                <div className="flex justify-center pt-4 pb-2">
                    <FetchLoading theme="#44403c" />
                </div>
            ) : schedule.length ? (
                <ScheduleItem
                    MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE}
                    nextPage={nextPage}
                    page={page}
                    previousPage={previousPage}
                />
            ) : (
                <div className="pt-1 pb-5 sm:pb-4 lg:pb-2">
                    <FormHeader subHeader="no content" />
                </div>
            )}
        </main>
    )
}

export default Schedule
