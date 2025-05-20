import { FetchLoading } from 'fetch-loading'
import { GameProps } from '../../types/types'
import { useScreenWidth } from '../../hooks/useScreenWidth'

type ScheduleItemButtonProps = {
    handleClick: (id: number, score_team1: string, score_team2: string) => void
    i: GameProps
    index: number
    isDisabled: boolean
    isLoading: boolean
    scoreTeam1: string | null
    scoreTeam2: string | null
    x: number
}

const ScheduleItemButton = ({
    handleClick,
    i,
    index,
    isDisabled,
    isLoading,
    scoreTeam1,
    scoreTeam2,
    x,
}: ScheduleItemButtonProps) => {
    const SCREEN_WIDTH = useScreenWidth()

    const redTheme =
        'bg-red-50 outline-red-400 active:bg-red-200 disabled:bg-red-100/80 animate-red-50-red-100'
    const stoneTheme =
        'bg-stone-100/90 outline-stone-500 active:bg-stone-300 disabled:bg-stone-50/20 animate-stone-50-stone-300'

    const theme = (() => {
        switch (SCREEN_WIDTH) {
            case 'DESKTOP':
                if ([1, 2, 5, 6].includes(index)) {
                    return ![2, 3].includes(x) ? redTheme : stoneTheme
                }
                return [2, 3].includes(x) ? redTheme : stoneTheme
            default:
                if (index % 2) {
                    return ![2, 3].includes(x) ? redTheme : stoneTheme
                }
                return [2, 3].includes(x) ? redTheme : stoneTheme
        }
    })()

    return (
        <button
            className={`relative flex justify-center items-center outline text-normal rounded-md h-7 lg:h-8 mt-2 p-0.5 disabled:text-stone-600 z-10 ${theme}`}
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

export default ScheduleItemButton
