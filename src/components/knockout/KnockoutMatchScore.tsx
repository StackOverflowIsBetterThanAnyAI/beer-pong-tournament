import { useContext, useState } from 'react'
import FormError from '../form/FormError'
import KnockoutMatchButton from './KnockoutMatchButton'
import { KOMatchProps, KOStageProps } from '../../types/types'
import { ContextAdmin } from '../../context/ContextAdmin'
import { ContextTournamentWinner } from '../../context/ContextTournamentWinner'
import { getStoredData } from '../../utils/getStoredData'
import { handleUpdateKOStageScore } from '../../api/handleUpdateKOStageScore'

type KnockoutMatchScoreProps = {
    i: KOMatchProps
    setKOStage: React.Dispatch<React.SetStateAction<KOStageProps>>
}

const KnockoutMatchScore = ({ i, setKOStage }: KnockoutMatchScoreProps) => {
    const parsedStorageData = getStoredData()

    const contextAdmin = useContext(ContextAdmin)
    if (!contextAdmin) {
        throw new Error(
            'KnockoutMatchScore must be used within a ContextAdmin.Provider'
        )
    }
    const [isAdmin, _setIsAdmin] = contextAdmin

    const contextTournamentWinner = useContext(ContextTournamentWinner)
    if (!contextTournamentWinner) {
        throw new Error(
            'KnockoutMatchScore must be used within a ContextTournamentWinner.Provider'
        )
    }
    const [_tournamentWinner, setTournamentWinner] = contextTournamentWinner

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )

    const [scoreTeam1, setScoreTeam1] = useState<string | null>(null)
    const [scoreTeam2, setScoreTeam2] = useState<string | null>(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [inputErrorTeam1, setInputErrorTeam1] = useState<string>('')
    const [inputErrorTeam2, setInputErrorTeam2] = useState<string>('')
    const [apiError, setApiError] = useState<string>('')

    const inputRegex = /^([0-9]|[1-9][0-9])$/

    const isDisabled: boolean =
        i.played ||
        !scoreTeam1 ||
        !scoreTeam2 ||
        parseInt(scoreTeam1) === parseInt(scoreTeam2) ||
        (parseInt(scoreTeam1) < 10 && parseInt(scoreTeam2) < 10) ||
        (parseInt(scoreTeam1) < 10 && parseInt(scoreTeam2) > 10) ||
        (parseInt(scoreTeam1) > 10 && parseInt(scoreTeam2) < 10) ||
        apiError.length > 0 ||
        inputErrorTeam1.length > 0 ||
        inputErrorTeam2.length > 0 ||
        isLoading

    const marginBottom = !isAdmin
        ? 'mb-1'
        : apiError || inputErrorTeam1 || inputErrorTeam2
        ? 'mb-1'
        : 'mb-5 sm:mb-6'

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        otherScore: string | null,
        setState: (value: React.SetStateAction<string | null>) => void,
        setInputError: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setApiError('')
        setInputError('')
        const score = e.target.value.replace(/[^\d]/g, '')
        setState(score)
        setInputError(
            !inputRegex.test(score) && score.length
                ? 'Please use an integer between 0 and 99.'
                : score?.length &&
                  otherScore?.length &&
                  parseInt(score) < 10 &&
                  parseInt(otherScore) < 10
                ? 'At least on team has to score 10 cups.'
                : score?.length &&
                  otherScore?.length &&
                  ((parseInt(score) < 10 && parseInt(otherScore) > 10) ||
                      (parseInt(score) > 10 && parseInt(otherScore) < 10))
                ? 'For overtime, both teams have to score 10 cups.'
                : otherScore && parseInt(score) === parseInt(otherScore)
                ? 'In this stage, one team has to win.'
                : ''
        )
    }

    const handleClick = (
        id: number,
        score_team1: string,
        score_team2: string
    ) => {
        handleUpdateKOStageScore({
            accessToken,
            id,
            refreshToken,
            score_team1,
            score_team2,
            setApiError,
            setIsLoading,
            setKOStage,
            setTournamentWinner,
        })
    }

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        id: number
    ) => {
        if (!isDisabled && e.key === 'Enter') {
            handleClick(id, scoreTeam1!, scoreTeam2!)
        }
    }

    return (
        <>
            <div className="flex flex-wrap items-center max-[280px]:flex-col justify-between gap-x-2 text-ellipsis overflow-hidden pb-1">
                {i.played ? (
                    <span
                        className={`${
                            i.score_team1! > i.score_team2! ? 'font-bold' : ''
                        } text-ellipsis overflow-hidden max-w-full`}
                    >
                        {i.team1_name}
                    </span>
                ) : (
                    <label
                        htmlFor={`input${i.team1}vs${i.team2}`}
                        className="text-ellipsis overflow-hidden max-w-full"
                    >
                        {i.team1_name}
                    </label>
                )}
                <span
                    className={`!m-1 ${
                        i.score_team1! > i.score_team2! ? 'font-bold' : ''
                    }`}
                >
                    {typeof i.score_team1 === 'number' && i.score_team1 >= 0 ? (
                        i.score_team1
                    ) : isAdmin ? (
                        <input
                            id={`input${i.team1}vs${i.team2}`}
                            inputMode="numeric"
                            type="text"
                            min={0}
                            max={10}
                            onChange={(e) =>
                                handleInput(
                                    e,
                                    scoreTeam2,
                                    setScoreTeam1,
                                    setInputErrorTeam1
                                )
                            }
                            onKeyDown={(e) => handleKeyDown(e, i.id)}
                            value={scoreTeam1 ?? ''}
                            aria-label="Score between 0 and 10 for Regulation Time, Score between 0 and 99 for Overtime."
                            title="Score between 0 and 99."
                            className={`page ${
                                i.round === 'QF' || i.round === 'F'
                                    ? 'bg-red-400 !outline-red-600'
                                    : 'bg-stone-400/70 !outline-stone-500'
                            } w-16 pl-1 rounded-sm`}
                        />
                    ) : (
                        '-'
                    )}
                </span>
            </div>
            <hr
                className={`border-t-2 pt-1 ${
                    i.round === 'QF' || i.round === 'F'
                        ? 'border-red-500/50'
                        : 'border-stone-500/50'
                }`}
            />
            <div
                className={`flex flex-wrap items-center max-[280px]:flex-col justify-between gap-x-2 text-ellipsis overflow-hidden ${marginBottom}`}
            >
                {i.played ? (
                    <span
                        className={`${
                            i.score_team2! > i.score_team1! ? 'font-bold' : ''
                        } text-ellipsis overflow-hidden max-w-full`}
                    >
                        {i.team2_name}
                    </span>
                ) : (
                    <label
                        htmlFor={`input${i.team2}vs${i.team1}`}
                        className="text-ellipsis overflow-hidden max-w-full"
                    >
                        {i.team2_name}
                    </label>
                )}
                <span
                    className={`!m-1 ${
                        i.score_team2! > i.score_team1! ? 'font-bold' : ''
                    }`}
                >
                    {typeof i.score_team2 === 'number' && i.score_team2 >= 0 ? (
                        i.score_team2
                    ) : isAdmin ? (
                        <input
                            id={`input${i.team2}vs${i.team1}`}
                            inputMode="numeric"
                            type="text"
                            min={0}
                            max={10}
                            onChange={(e) =>
                                handleInput(
                                    e,
                                    scoreTeam1,
                                    setScoreTeam2,
                                    setInputErrorTeam2
                                )
                            }
                            onKeyDown={(e) => handleKeyDown(e, i.id)}
                            value={scoreTeam2 ?? ''}
                            aria-label="Score between 0 and 10 for Regulation Time, Score between 0 and 99 for Overtime."
                            title="Score between 0 and 99."
                            className={`page ${
                                i.round === 'QF' || i.round === 'F'
                                    ? 'bg-red-400 !outline-red-600'
                                    : 'bg-stone-400/70 !outline-stone-500'
                            } w-16 pl-1 rounded-sm`}
                        />
                    ) : (
                        '-'
                    )}
                </span>
            </div>
            {inputErrorTeam1 || inputErrorTeam2 ? (
                <FormError error={inputErrorTeam1 || inputErrorTeam2} />
            ) : null}
            {isAdmin ? (
                <KnockoutMatchButton
                    handleClick={handleClick}
                    i={i}
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                    scoreTeam1={scoreTeam1}
                    scoreTeam2={scoreTeam2}
                />
            ) : null}
        </>
    )
}

export default KnockoutMatchScore
