import { useContext, useState } from 'react'
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
    const [registeredTeams, _setRegisteredTeams] = contextRegisteredTeams

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )

    const [apiError, setApiError] = useState<string>('')

    useRegisteredTeams({ accessToken, refreshToken, setApiError })

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

    return (
        <main className="w-full bg-stone-300 text-stone-950 sm:w-80 md:w-112 sm:rounded-lg p-3 sm:p-4 md:p-6">
            <h1 className="text-center font-semibold text-extra-large">
                Team Overview
            </h1>
            {apiError ? (
                <TeamsError error={apiError} />
            ) : registeredTeams.length ? (
                <>
                    <h2 className="text-center text-large px-1">
                        Currently registered Teams:
                    </h2>
                    <ul>{teams}</ul>
                </>
            ) : (
                <h2 className="text-center text-large px-1">
                    Currently, no Teams have registered yet.
                </h2>
            )}
        </main>
    )
}

export default Teams
