import { useContext, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import TeamsError from './TeamsError'
import { SERVER_ADDRESS } from '../../constants/constants'
import { ContextRegisteredTeams } from '../../context/ContextRegisteredTeams'
import { getStoredData } from '../../utils/getStoredData'
import { getValidToken } from '../../utils/getValidToken'
import { getValueFromError } from '../../utils/getValueFromError'
import { setItemInStorage } from '../../utils/setItemInStorage'
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

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )

    const [apiError, setApiError] = useState<string>('')
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

    const teams = registeredTeams.map((item) => {
        return (
            <li
                key={item.name}
                className="flex flex-col max-w-80 bg-stone-400 my-2 px-4 py-2 m-auto rounded-sm"
            >
                <div className="text-large font-bold text-ellipsis overflow-hidden">
                    {item.name}
                </div>
                <div className="flex gap-x-2 flex-wrap justify-between">
                    <div className="text-normal">{item.member_one}</div>
                    <div className="text-normal">{item.member_two}</div>
                </div>
                <button
                    className="text-normal bg-stone-300 outline-2 outline-red-500 mt-2 py-0.5 rounded-md
                hover:bg-stone-300/60 active:bg-stone-300/30"
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
                <ul>{teams}</ul>
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
        <main className="w-full bg-stone-300 text-stone-950 sm:w-80 md:w-112 sm:rounded-lg p-3 sm:p-4 md:p-6">
            <h1 className="text-center font-semibold text-extra-large">
                Team Overview
            </h1>
            {content}
        </main>
    )
}

export default Teams
