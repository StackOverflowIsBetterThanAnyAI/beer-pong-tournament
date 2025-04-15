import { useContext, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import TeamsError from './TeamsError'
import { ContextRegisteredTeams } from '../../context/ContextRegisteredTeams'
import { getStoredData } from '../../utils/getStoredData'
import { useRegisteredTeams } from '../../hooks/useRegisteredTeams'

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
