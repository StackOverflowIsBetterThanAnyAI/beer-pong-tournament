import { useContext, useState } from 'react'
import { GameProps } from '../../types/types'
import FormError from '../form/FormError'
import ScheduleItemButton from './ScheduleItemButton'
import { ContextSchedule } from '../../context/ContextSchedule'
import { getStoredData } from '../../utils/getStoredData'
import { handleUpdateScore } from '../../api/handleUpdateScore'

type ScheduleItemScoreProps = {
    i: GameProps
    x: number
}

export const ScheduleItemScore = ({ i, x }: ScheduleItemScoreProps) => {
    const parsedStorageData = getStoredData()

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
    const [inputError, setInputError] = useState<string>('')
    const [apiError, setApiError] = useState<string>('')

    const inputRegex = /^([0-9]|10)$/

    const handleInputTeam1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const score = e.target.value.replace(/[^\d]/g, '')
        setScoreTeam1(score)
        setInputError(
            !inputRegex.test(score) && score.length
                ? 'Please use an integer between 0 and 10.'
                : ''
        )
    }

    const handleInputTeam2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const score = e.target.value.replace(/[^\d]/g, '')
        setScoreTeam2(score)
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

    const marginBottom = apiError || inputError ? 'mb-1' : 'mb-5 md:mb-6'

    return (
        <>
            <div className="flex flex-wrap items-center max-[280px]:flex-col justify-between gap-x-2 font-bold text-ellipsis overflow-hidden">
                <label
                    htmlFor={
                        i.played ? undefined : `input${i.team1}vs${i.team2}`
                    }
                >
                    {i.team1}
                </label>
                <span className="m-1">
                    {i.score_team1 ?? (
                        <input
                            id={`input${i.team1}vs${i.team2}`}
                            inputMode="numeric"
                            type="text"
                            min={0}
                            max={10}
                            onChange={(e) => handleInputTeam1(e)}
                            value={scoreTeam1 ?? ''}
                            aria-label="Score between 0 and 10."
                            title="Score between 0 and 10."
                            className={`${
                                x % 2
                                    ? 'bg-red-400 !outline-red-600'
                                    : 'bg-stone-400/70 !outline-stone-500'
                            } w-16 pl-1 rounded-sm`}
                        />
                    )}
                </span>
            </div>
            <div
                className={`flex flex-wrap items-center max-[280px]:flex-col justify-between gap-x-2 font-bold text-ellipsis overflow-hidden ${marginBottom}`}
            >
                <label
                    htmlFor={
                        i.played ? undefined : `input${i.team2}vs${i.team1}`
                    }
                >
                    {i.team2}
                </label>
                <span className="m-1">
                    {i.score_team2 ?? (
                        <input
                            id={`input${i.team2}vs${i.team1}`}
                            inputMode="numeric"
                            type="text"
                            min={0}
                            max={10}
                            onChange={(e) => handleInputTeam2(e)}
                            value={scoreTeam2 ?? ''}
                            aria-label="Score between 0 and 10."
                            title="Score between 0 and 10."
                            className={`${
                                x % 2
                                    ? 'bg-red-400 !outline-red-600'
                                    : 'bg-stone-400/70 !outline-stone-500'
                            } w-16 pl-1 rounded-sm`}
                        />
                    )}
                </span>
            </div>
            <FormError error={apiError || inputError} />
            <ScheduleItemButton
                error={apiError || inputError}
                handleClick={handleClick}
                i={i}
                isLoading={isLoading}
                scoreTeam1={scoreTeam1}
                scoreTeam2={scoreTeam2}
                x={x}
            />
        </>
    )
}

export default ScheduleItemScore
