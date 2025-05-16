import { useContext, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import FormHeader from '../form/FormHeader'
import TeamsErrorOpacity from '../teams/TeamsErrorOpacity'
import { ContextAdmin } from '../../context/ContextAdmin'
import { ContextTournamentWinner } from '../../context/ContextTournamentWinner'
import { getStoredData } from '../../utils/getStoredData'
import { handleResetTournament } from '../../api/handleResetTournament'

const KnockoutChampion = () => {
    const parsedStorageData = getStoredData()

    const contextAdmin = useContext(ContextAdmin)
    if (!contextAdmin) {
        throw new Error(
            'GroupsGenerator must be used within a ContextAdmin.Provider'
        )
    }
    const [isAdmin, _setIsAdmin] = contextAdmin

    const contextTournamentWinner = useContext(ContextTournamentWinner)
    if (!contextTournamentWinner) {
        throw new Error(
            'KnockoutMatchScore must be used within a ContextTournamentWinner.Provider'
        )
    }
    const [tournamentWinner, _setTournamentWinner] = contextTournamentWinner

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )
    const [apiError, setApiError] = useState<string>('')
    const [isDisabled, setIsDisabled] = useState<boolean>(false)

    const handleClick = () => {
        handleResetTournament({
            accessToken,
            refreshToken,
            setApiError,
            setIsDisabled,
        })
    }

    return (
        <div className="flex flex-col gap-2 justify-center max-w-96 w-full sm:w-2/3 lg:w-full sm:max-w-lg text-normal bg-stone-200 drop-shadow-stone-600/60 drop-shadow-sm my-4 p-2 m-auto rounded-sm">
            <div className="winner relative flex flex-col justify-center w-full bg-amber-300 rounded-sm pb-2">
                <FormHeader header="Tournament Winner" />
                <span className="text-center py-1.5 lg:py-2 text-ellipsis overflow-hidden max-w-full">
                    {tournamentWinner}
                </span>
            </div>
            {isAdmin ? (
                <>
                    <button
                        className="flex justify-center items-center bg-stone-100 outline text-normal rounded-md mt-2 p-0.5 text-normal min-h-7 sm:min-h-8 w-full focus-visible:bg-stone-50 outline-stone-500
                        not-[:disabled]:hover:bg-stone-300 not-[:disabled]:active:bg-stone-400/40 disabled:outline-stone-400 disabled:bg-stone-400/20"
                        aria-label="Start new Tournament."
                        title="Start new Tournament."
                        disabled={isDisabled}
                        aria-disabled={isDisabled}
                        onClick={handleClick}
                    >
                        {isDisabled ? (
                            <FetchLoading theme="#44403c" />
                        ) : (
                            'New Tournament'
                        )}
                    </button>
                    {apiError ? <TeamsErrorOpacity error={apiError} /> : null}
                </>
            ) : null}
        </div>
    )
}

export default KnockoutChampion
