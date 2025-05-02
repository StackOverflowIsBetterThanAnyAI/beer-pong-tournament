import { FetchLoading } from 'fetch-loading'
import { GameProps } from '../../types/types'

type ScheduleItemButtonProps = {
    disabled: boolean
    handleClick: (id: number, score_team1: string, score_team2: string) => void
    i: GameProps
    isLoading: boolean
    scoreTeam1: string | null
    scoreTeam2: string | null
    x: number
}

const ScheduleItemButton = ({
    disabled,
    handleClick,
    i,
    isLoading,
    scoreTeam1,
    scoreTeam2,
    x,
}: ScheduleItemButtonProps) => {
    return (
        <button
            className={`flex justify-center items-center bg-stone-100/90 outline text-normal rounded-md min-h-7 mt-2 p-0.5 focus-visible:bg-stone-50 
            ${
                x % 2
                    ? 'outline-red-400 not-[:disabled]:hover:bg-red-100 active:bg-red-200 disabled:bg-red-50/20'
                    : 'outline-stone-500 not-[:disabled]:hover:bg-stone-200/80 active:bg-stone-300 disabled:bg-stone-50/20'
            }`}
            aria-label={
                i.played
                    ? 'Match Over. Score has been saved.'
                    : disabled
                    ? 'Enter a valid Score.'
                    : 'Save Score.'
            }
            title={
                i.played
                    ? 'Match Over. Score has been saved.'
                    : disabled
                    ? 'Enter a valid Score.'
                    : 'Save Score.'
            }
            onClick={() => handleClick(i.id, scoreTeam1!, scoreTeam2!)}
            aria-disabled={disabled}
            disabled={disabled}
        >
            {isLoading ? (
                <FetchLoading theme="#44403c" />
            ) : i.played ? (
                'Match Over'
            ) : (
                'Save Score'
            )}
        </button>
    )
}

export default ScheduleItemButton
