import { useContext, useEffect, useRef, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import FormError from '../form/FormError'
import FormErrorOpacity from '../form/FormErrorOpacity'
import FormHeader from '../form/FormHeader'
import KnockoutMatch from './KnockoutMatch'
import { ContextAdmin } from '../../context/ContextAdmin'
import { ContextGroups } from '../../context/ContextGroups'
import { ContextKOStage } from '../../context/ContextKOStage'
import { ContextSchedule } from '../../context/ContextSchedule'
import { ContextTournamentWinner } from '../../context/ContextTournamentWinner'
import { getStoredData } from '../../utils/getStoredData'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { handleGenerateKOStage } from '../../api/handleGenerateKOStage'
import { handleLoadSchedule } from '../../api/handleLoadSchedule'
import { handleLoadKOStage } from '../../api/handleLoadKOStage'
import { useAutoFocus } from '../../hooks/useAutoFocus'

const Knockout = () => {
    const parsedStorageData = getStoredData()
    const parsedSessionData = getStoredSessionData()

    const contextAdmin = useContext(ContextAdmin)
    if (!contextAdmin) {
        throw new Error('Knockout must be used within a ContextAdmin.Provider')
    }
    const [isAdmin, _setIsAdmin] = contextAdmin

    const contextGroups = useContext(ContextGroups)
    if (!contextGroups) {
        throw new Error('Knockout must be used within a ContextGroups.Provider')
    }
    const [groups, _setGroups] = contextGroups

    const contextKOStage = useContext(ContextKOStage)
    if (!contextKOStage) {
        throw new Error(
            'Knockout must be used within a ContextKOStage.Provider'
        )
    }
    const [koStage, setKOStage] = contextKOStage

    const contextSchedule = useContext(ContextSchedule)
    if (!contextSchedule) {
        throw new Error(
            'Knockout must be used within a ContextSchedule.Provider'
        )
    }
    const [_schedule, setSchedule] = contextSchedule

    const [tournamentWinner, setTournamentWinner] = useState<string>('')

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )

    const [page, setPage] = useState<number>(
        parsedSessionData?.kostagepage || 1
    )

    const [isGroupstageOver, setIsGroupstageOver] = useState<boolean>(
        parsedStorageData?.isgroupstageover ?? false
    )
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false)

    const [apiErrorLoad, setApiErrorLoad] = useState<string>('')
    const [apiErrorGenerate, setApiErrorGenerate] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const startButtonRef = useRef<HTMLButtonElement>(null)

    useAutoFocus(startButtonRef)

    useEffect(() => {
        handleLoadSchedule({
            accessToken,
            refreshToken,
            setApiError: setApiErrorLoad,
            setIsGroupstageOver,
            setIsLoading,
            setSchedule,
        })
    }, [])

    useEffect(() => {
        if (isGroupstageOver) {
            handleLoadKOStage({
                accessToken,
                refreshToken,
                setApiError: setApiErrorLoad,
                setKOStage,
                setTournamentWinner,
            })
        }
    }, [isGroupstageOver])

    const handleKOStage = () => {
        handleGenerateKOStage({
            accessToken,
            refreshToken,
            setApiError: setApiErrorGenerate,
            setIsSubmitDisabled,
            setKOStage,
            setTournamentWinner,
        })
    }

    return (
        <main className="w-full max-w-7xl relative isolate flex flex-col bg-stone-300 text-stone-950 lg:rounded-lg p-3 sm:p-4 lg:p-6 drop-shadow-stone-900 drop-shadow-sm">
            <FormHeader
                header="Knockout Stage"
                subHeader={`${koStage.length ? 'knockout' : ''}`}
            />
            <ContextTournamentWinner.Provider
                value={[tournamentWinner, setTournamentWinner]}
            >
                {isAdmin && !koStage.length ? (
                    <button
                        className="text-normal bg-stone-300 outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 h-7 lg:h-8 w-fit m-auto px-8 py-0.5 mt-2 rounded-md
                         disabled:text-stone-600 not-[:disabled]:hover:bg-stone-400/40 not-[:disabled]:active:bg-stone-400/70"
                        onClick={handleKOStage}
                        aria-label={`${
                            !isGroupstageOver
                                ? 'Start Disabled. Not all Group Stage Matches have been played yet.'
                                : 'Start Knockout Stage.'
                        }`}
                        title={`${
                            !isGroupstageOver
                                ? 'Start Disabled. Not all Group Stage Matches have been played yet.'
                                : 'Start Knockout Stage.'
                        }`}
                        disabled={
                            !isGroupstageOver || isSubmitDisabled || isLoading
                        }
                        ref={startButtonRef}
                    >
                        {isSubmitDisabled ? (
                            <FetchLoading theme="#44403c" />
                        ) : (
                            'Start Knockout Stage'
                        )}
                    </button>
                ) : null}
                {apiErrorGenerate ? (
                    <div className="text-center pt-4">
                        <FormErrorOpacity error={apiErrorGenerate} />
                    </div>
                ) : null}
                {isLoading ? (
                    <div className="flex justify-center pt-8 pb-4">
                        <FetchLoading theme="#44403c" />
                    </div>
                ) : apiErrorLoad ? (
                    <div className="text-center pt-4">
                        <FormError error={apiErrorLoad} />
                    </div>
                ) : koStage.length ? (
                    <KnockoutMatch
                        koStage={koStage}
                        page={page}
                        setKOStage={setKOStage}
                        setPage={setPage}
                        tournamentWinner={tournamentWinner}
                    />
                ) : (
                    <div className="pt-2">
                        {!isAdmin ? (
                            <FormHeader subHeader="no content ko" />
                        ) : !isGroupstageOver ? (
                            groups.length ? (
                                <FormHeader subHeader="knockout error" />
                            ) : (
                                <FormHeader subHeader="no content" />
                            )
                        ) : (
                            <FormHeader subHeader="no content ko" />
                        )}
                    </div>
                )}
            </ContextTournamentWinner.Provider>
        </main>
    )
}

export default Knockout
