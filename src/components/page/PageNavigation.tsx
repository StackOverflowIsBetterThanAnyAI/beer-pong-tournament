import {
    RegisteredTeamsProps,
    ScheduleProps,
    StandingsProps,
    TournamentGroupsProps,
} from './../../types/types'

type PageNavigationProps = {
    nextPage: () => void
    MAX_ITEMS_PER_PAGE: number
    page: number
    previousPage: () => void
    registeredTeams:
        | RegisteredTeamsProps
        | ScheduleProps
        | StandingsProps
        | TournamentGroupsProps
}

const PageNavigation = ({
    nextPage,
    MAX_ITEMS_PER_PAGE,
    page,
    previousPage,
    registeredTeams,
}: PageNavigationProps) => {
    return (
        <div className="bg-stone-300 grid min-[216px]:grid-cols-3 text-center w-full max-w-96 m-auto mt-4 p-1 rounded-lg">
            <button
                className="text-normal bg-stone-300 outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 px-2 py-0.5 rounded-md
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
                className="text-normal bg-stone-300 outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 px-2 py-0.5 rounded-md
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
                disabled={page >= registeredTeams.length / MAX_ITEMS_PER_PAGE}
                title={`${
                    page >= registeredTeams.length / MAX_ITEMS_PER_PAGE
                        ? 'You are already at the last page.'
                        : 'Go to next page'
                }`}
            >
                Next
            </button>
        </div>
    )
}

export default PageNavigation
