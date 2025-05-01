import { useContext, useState } from 'react'
import { GameProps } from '../../types/types'
import FormError from '../form/FormError'
import FormErrorOpacity from '../form/FormErrorOpacity'
import ScheduleItemButton from './ScheduleItemButton'
import { ContextAdmin } from '../../context/ContextAdmin'
import { ContextSchedule } from '../../context/ContextSchedule'
import { getStoredData } from '../../utils/getStoredData'
import { handleUpdateScore } from '../../api/handleUpdateScore'

type ScheduleItemScoreProps = {
    i: GameProps
    x: number
}

export const ScheduleItemScore = ({ i, x }: ScheduleItemScoreProps) => {
    const parsedStorageData = getStoredData()

    const contextAdmin = useContext(ContextAdmin)
    if (!contextAdmin) {
        throw new Error(
            'ScheduleItemScore must be used within a ContextAdmin.Provider'
        )
    }
    const [isAdmin, _setIsAdmin] = contextAdmin

    const contextSchedule = useContext(ContextSchedule)
    if (!contextSchedule) {
        throw new Error(
            'ScheduleItemScore must be used within a ContextSchedule.Provider'
        )
    }
    const [_schedule, setSchedule] = contextSchedule

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

    const inputRegex = /^([0-9]|10)$/

    const disabled: boolean =
        i.played ||
        !scoreTeam1 ||
        !scoreTeam2 ||
        (parseInt(scoreTeam1) < 10 && parseInt(scoreTeam2) < 10) ||
        apiError.length > 0 ||
        inputErrorTeam1.length > 0 ||
        inputErrorTeam2.length > 0

    const marginBottom = !isAdmin
        ? 'mb-1'
        : apiError || inputErrorTeam1 || inputErrorTeam2
        ? 'mb-1'
        : 'mb-5 md:mb-6'

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        setState: (value: React.SetStateAction<string | null>) => void,
        setInputError: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setApiError('')
        setInputError('')
        const score = e.target.value.replace(/[^\d]/g, '')
        setState(score)
        setInputError(
            !inputRegex.test(score) && score.length
                ? 'Please use an integer between 0 and 10.'
                : ''
        )
    }

    const handleClick = (
        id: number,
        score_team1: string,
        score_team2: string
    ) => {
        handleUpdateScore({
            accessToken,
            id,
            refreshToken,
            score_team1,
            score_team2,
            setApiError,
            setIsLoading,
            setSchedule,
        })
    }

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        id: number
    ) => {
        if (!disabled && e.key === 'Enter') {
            handleClick(id, scoreTeam1!, scoreTeam2!)
        }
    }

    return (
        <>
            <div className="flex flex-wrap items-center max-[280px]:flex-col justify-between gap-x-2 text-ellipsis overflow-hidden pb-1">
                {i.played ? (
                    <span
                        className={`${i.score_team1 === 10 ? 'font-bold' : ''}`}
                    >
                        {i.team1}
                    </span>
                ) : (
                    <label htmlFor={`input${i.team1}vs${i.team2}`}>
                        {i.team1}
                    </label>
                )}
                <span
                    className={`!m-1 ${
                        i.score_team1 === 10 ? 'font-bold' : ''
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
                                    setScoreTeam1,
                                    setInputErrorTeam1
                                )
                            }
                            onKeyDown={(e) => handleKeyDown(e, i.id)}
                            value={scoreTeam1 ?? ''}
                            aria-label="Score between 0 and 10."
                            title="Score between 0 and 10."
                            className={`${
                                x % 2
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
                    x % 2 ? 'border-red-500/50' : 'border-stone-500/50'
                }`}
            />
            <div
                className={`flex flex-wrap items-center max-[280px]:flex-col justify-between gap-x-2 text-ellipsis overflow-hidden ${marginBottom}`}
            >
                {i.played ? (
                    <span
                        className={`${i.score_team2 === 10 ? 'font-bold' : ''}`}
                    >
                        {i.team2}
                    </span>
                ) : (
                    <label htmlFor={`input${i.team2}vs${i.team1}`}>
                        {i.team2}
                    </label>
                )}
                <span
                    className={`!m-1 ${
                        i.score_team2 === 10 ? 'font-bold' : ''
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
                                    setScoreTeam2,
                                    setInputErrorTeam2
                                )
                            }
                            onKeyDown={(e) => handleKeyDown(e, i.id)}
                            value={scoreTeam2 ?? ''}
                            aria-label="Score between 0 and 10."
                            title="Score between 0 and 10."
                            className={`${
                                x % 2
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
            {apiError ? <FormErrorOpacity error={apiError} /> : null}
            {isAdmin ? (
                <ScheduleItemButton
                    disabled={disabled}
                    handleClick={handleClick}
                    i={i}
                    isLoading={isLoading}
                    scoreTeam1={scoreTeam1}
                    scoreTeam2={scoreTeam2}
                    x={x}
                />
            ) : null}
        </>
    )
}

export default ScheduleItemScore
