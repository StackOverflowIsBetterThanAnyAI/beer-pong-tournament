import { FetchLoading } from 'fetch-loading'
import { KOMatchProps } from '../../types/types'

type KnockoutMatchButtonProps = {
    handleClick: (id: number, score_team1: string, score_team2: string) => void
    i: KOMatchProps
    isDisabled: boolean
    isLoading: boolean
    scoreTeam1: string | null
    scoreTeam2: string | null
}

const KnockoutMatchButton = ({
    handleClick,
    i,
    isDisabled,
    isLoading,
    scoreTeam1,
    scoreTeam2,
}: KnockoutMatchButtonProps) => {
    return (
        <button
            className={`relative flex justify-center items-center outline text-normal rounded-md min-h-7 mt-2 p-0.5 disabled:text-stone-600 z-10 
        ${
            i.round === 'QF' || i.round === 'F'
                ? 'bg-red-50 outline-red-400 active:bg-red-200 disabled:bg-red-100/80 animate-red-50-red-100'
                : 'bg-stone-100/90 outline-stone-500 active:bg-stone-300 disabled:bg-stone-50/20 animate-stone-50-stone-300'
        }`}
            aria-label={
                i.played
                    ? 'Match Over. Score has been saved.'
                    : isDisabled
                    ? 'Enter a valid Score.'
                    : 'Save Score.'
            }
            title={
                i.played
                    ? 'Match Over. Score has been saved.'
                    : isDisabled
                    ? 'Enter a valid Score.'
                    : 'Save Score.'
            }
            onClick={() => handleClick(i.id, scoreTeam1!, scoreTeam2!)}
            aria-disabled={isDisabled}
            disabled={isDisabled}
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

export default KnockoutMatchButton
