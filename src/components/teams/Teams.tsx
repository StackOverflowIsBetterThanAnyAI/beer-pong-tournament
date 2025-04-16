import { useContext, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import TeamsError from './TeamsError'
import { SERVER_ADDRESS } from '../../constants/constants'
import { ContextRegisteredTeams } from '../../context/ContextRegisteredTeams'
import { getStoredData } from '../../utils/getStoredData'
import { getValidToken } from '../../utils/getValidToken'
import { getValueFromError } from '../../utils/getValueFromError'
import { setItemInStorage } from '../../utils/setItemInStorage'
import { useItemsPerPage } from '../../hooks/useItemsPerPage'
import { useRegisteredTeams } from '../../hooks/useRegisteredTeams'
import { RegisteredTeamProps } from '../../types/tpyes'

export const Teams = () => {
    const parsedStorageData = getStoredData()

    const contextRegisteredTeams = useContext(ContextRegisteredTeams)
    if (!contextRegisteredTeams) {
        throw new Error(
            'Form must be used within a ContextRegisteredTeams.Provider'
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
    const [page, setPage] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useRegisteredTeams({
        accessToken,
        refreshToken,
        setApiError,
        setIsLoading,
        setRegisteredTeams,
    })

    const handleDelete = async (item: RegisteredTeamProps) => {
        try {
            const response = await fetch(
                `${SERVER_ADDRESS}/api/v1/teams/delete/${item.id}/`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${await getValidToken(
                            accessToken,
                            refreshToken
                        )}`,
                    },
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                setApiError(getValueFromError(errorData))
                return
            }
            const updatedTeams = registeredTeams.filter(
                (team) => team.id !== item.id
            )
            setRegisteredTeams(updatedTeams)
            setItemInStorage('registeredteams', updatedTeams)
        } catch (error: any) {
            setApiError('An unexpected error occurred while deleting a team.')
        }
    }

    const previousPage = () => {
        setPage((prev) => prev - 1)
    }

    const nextPage = () => {
        setPage((prev) => prev + 1)
    }

    const teams = registeredTeams.map((item) => {
        return (
            <li
                key={item.name}
                className="flex flex-col max-w-80 bg-stone-400 drop-shadow-stone-600/60 drop-shadow-md my-4 px-4 py-2 m-auto rounded-sm"
            >
                <div className="text-large font-bold text-ellipsis overflow-hidden">
                    {item.name}
                </div>
                <div className="flex gap-x-2 flex-wrap justify-between">
                    <div className="text-normal">{item.member_one}</div>
                    <div className="text-normal">{item.member_two}</div>
                </div>
                <button
                    className="text-normal bg-stone-300 outline outline-red-500 mt-2 py-0.5 rounded-md
                hover:bg-stone-300/60 active:bg-stone-300/30 focus-visible:bg-stone-100"
                    onClick={() => handleDelete(item)}
                >
                    Delete
                </button>
            </li>
        )
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
                <div className="grid min-[216px]:grid-cols-3 text-center max-w-80 m-auto pt-2">
                    <button
                        className="text-normal outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 px-2 py-0.5 rounded-md
                        hover:bg-stone-400/40 active:bg-stone-400/70"
                        aria-label="Go to the previous page."
                        onClick={previousPage}
                        disabled={page <= 1}
                        title="Previous Page."
                    >
                        Previous
                    </button>
                    <span className="text-large">{page}</span>
                    <button
                        className="text-normal outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 px-2 py-0.5 rounded-md
                        hover:bg-stone-400/40 active:bg-stone-400/70"
                        aria-label="Go to the next page."
                        onClick={nextPage}
                        disabled={
                            page >= registeredTeams.length / MAX_ITEMS_PER_PAGE
                        }
                        title="Next Page."
                    >
                        Next
                    </button>
                </div>
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
