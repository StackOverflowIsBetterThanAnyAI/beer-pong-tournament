import { useContext, useEffect, useState } from 'react'
import FormError from '../form/FormError'
import FormHeader from '../form/FormHeader'
import ScheduleItem from './ScheduleItem'
import { getStoredData } from '../../utils/getStoredData'
import { setItemInStorage } from '../../utils/setItemInStorage'
import { handleLoadSchedule } from '../../api/handleLoadSchedule'
import { ContextSchedule } from '../../context/ContextSchedule'
import { FetchLoading } from 'fetch-loading'
import { useTeamsPerPage } from '../../hooks/useTeamsPerPage'

const Schedule = () => {
    const MAX_ITEMS_PER_PAGE = useTeamsPerPage()

    const parsedStorageData = getStoredData()

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
        parsedStorageData?.schedulepage || 1
    )

    useEffect(() => {
        handleLoadSchedule({
            accessToken,
            refreshToken,
            setApiError,
            setSchedule,
            setIsLoading,
            setItemInStorage,
            setPage,
        })
    }, [])

    const previousPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1)
            setItemInStorage('schedulepage', page - 1)
        }
    }

    const nextPage = () => {
        setPage((prev) => prev + 1)
        setItemInStorage('schedulepage', page + 1)
    }

    return (
        <main className="w-full bg-stone-300 text-stone-950 sm:w-80 md:w-112 sm:rounded-lg p-3 sm:p-4 md:p-6 drop-shadow-stone-900 drop-shadow-sm">
            <FormHeader
                header="Schedule"
                subHeader={`${!schedule.length ? 'schedule' : null}`}
            />
            {apiError ? (
                <div className="text-center pt-4">
                    <FormError error={apiError} />
                </div>
            ) : null}
            {isLoading ? (
                <div className="flex justify-center">
                    <FetchLoading theme="#44403c" />
                </div>
            ) : schedule.length ? (
                <ScheduleItem
                    MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE}
                    nextPage={nextPage}
                    page={page}
                    previousPage={previousPage}
                    schedule={schedule}
                />
            ) : null}
        </main>
    )
}

export default Schedule
