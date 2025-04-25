import { FetchLoading } from 'fetch-loading'
import { GameProps } from '../../types/types'

type ScheduleItemButtonProps = {
    error: string
    handleClick: (id: number, score_team1: string, score_team2: string) => void
    i: GameProps
    isLoading: boolean
    scoreTeam1: string | null
    scoreTeam2: string | null
    x: number
}

const ScheduleItemButton = ({
    error,
    handleClick,
    i,
    isLoading,
    scoreTeam1,
    scoreTeam2,
    x,
}: ScheduleItemButtonProps) => {
    const disabled: boolean =
        i.played ||
        !scoreTeam1 ||
        !scoreTeam2 ||
        (parseInt(scoreTeam1) < 10 && parseInt(scoreTeam2) < 10) ||
        error.length > 0

    return (
        <button
            className={`flex justify-center bg-stone-100/90 outline text-normal rounded-md mt-2 p-0.5 focus-visible:bg-stone-50 
            ${
                x % 2
                    ? 'outline-red-400 not-[:disabled]:hover:bg-red-100 active:bg-red-200 disabled:bg-red-50/20'
                    : 'outline-stone-500 not-[:disabled]:hover:bg-stone-200/80 active:bg-stone-300 disabled:bg-stone-50/20'
            }`}
            aria-label={
                i.played ? 'Match Over. Score has been saved.' : 'Save Score.'
            }
            title={
                i.played ? 'Match Over. Score has been saved.' : 'Save Score.'
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
