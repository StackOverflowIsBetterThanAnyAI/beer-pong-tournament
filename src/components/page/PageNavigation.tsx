import { useState } from 'react'
import { useFocusTrapPage } from '../../hooks/useFocusTrapPage'
import {
    KOStageProps,
    RegisteredTeamsProps,
    ScheduleProps,
    StandingsProps,
    TournamentGroupsProps,
} from './../../types/types'
import { useFocusableItems } from '../../hooks/useFocusableItems'

type PageNavigationProps = {
    isMatch?: boolean
    MAX_ITEMS_PER_PAGE: number
    nextPage: () => void
    page: number
    previousPage: () => void
    registeredTeams:
        | KOStageProps
        | RegisteredTeamsProps
        | ScheduleProps
        | StandingsProps
        | TournamentGroupsProps
}

const PageNavigation = ({
    isMatch = false,
    MAX_ITEMS_PER_PAGE,
    nextPage,
    page,
    previousPage,
    registeredTeams,
}: PageNavigationProps) => {
    const [focusableItems, setFocusableItems] = useState<
        (HTMLInputElement | HTMLButtonElement)[]
    >([])

    useFocusableItems({ page, registeredTeams, setFocusableItems })

    useFocusTrapPage({ focusableItems })

    const goToFirstItemKeyDown = (
        e: React.KeyboardEvent<HTMLButtonElement>
    ) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            if (focusableItems.length > 0) focusableItems[0].focus()
        }
    }

    const goToFirstItemClick = () => {
        if (focusableItems.length > 0) focusableItems[0].focus()
    }

    return (
        <div className="flex flex-col gap-2 w-full max-w-96 mt-4 mx-auto">
            <div className="bg-stone-300 grid min-[280px]:grid-cols-3 gap-y-1 w-full text-center m-auto p-1 rounded-lg">
                <button
                    className="previouspage text-normal bg-stone-300 outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 disabled:text-stone-600 px-2 py-0.5 rounded-md
                    hover:bg-stone-400/30 active:bg-stone-400/60"
                    aria-label={`${
                        page <= 1
                            ? 'You are already at the first page.'
                            : 'Go to the previous page'
                    }`}
                    onClick={previousPage}
                    aria-disabled={page <= 1}
                    disabled={page <= 1}
                    title={`${
                        page <= 1
                            ? 'You are already at the first page.'
                            : 'Go to previous page'
                    }`}
                >
                    Previous
                </button>
                <span className="text-large">{page}</span>
                <button
                    className="nextpage text-normal bg-stone-300 outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 disabled:text-stone-600 px-2 py-0.5 rounded-md
                    hover:bg-stone-400/30 active:bg-stone-400/60"
                    aria-label={`${
                        page >= registeredTeams.length / MAX_ITEMS_PER_PAGE
                            ? 'You are already at the last page.'
                            : 'Go to the next page'
                    }`}
                    onClick={nextPage}
                    aria-disabled={
                        page >= registeredTeams.length / MAX_ITEMS_PER_PAGE
                    }
                    disabled={
                        page >= registeredTeams.length / MAX_ITEMS_PER_PAGE
                    }
                    title={`${
                        page >= registeredTeams.length / MAX_ITEMS_PER_PAGE
                            ? 'You are already at the last page.'
                            : 'Go to next page'
                    }`}
                >
                    Next
                </button>
            </div>
            {focusableItems.length ? (
                <button
                    className="firstitempage text-normal w-full bg-stone-300 outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 disabled:text-stone-600 px-2 py-0.5 rounded-md
                    hover:bg-stone-400/30 active:bg-stone-400/60"
                    aria-label={`Go to the first ${
                        isMatch ? 'Match' : 'Team'
                    }.`}
                    title={`Go to the first ${isMatch ? 'Match' : 'Team'}.`}
                    onClick={goToFirstItemClick}
                    onKeyDown={(e) => goToFirstItemKeyDown(e)}
                >
                    {`Go to First ${isMatch ? 'Match' : 'Team'}`}
                </button>
            ) : null}
        </div>
    )
}

export default PageNavigation
