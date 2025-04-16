import { RegisteredTeamsProps } from '../../types/tpyes'

type TeamPageNavigationProps = {
    nextPage: () => void
    MAX_ITEMS_PER_PAGE: number
    page: number
    previousPage: () => void
    registeredTeams: RegisteredTeamsProps
}

const TeamPageNavigation = ({
    nextPage,
    MAX_ITEMS_PER_PAGE,
    page,
    previousPage,
    registeredTeams,
}: TeamPageNavigationProps) => {
    return (
        <div className="grid min-[216px]:grid-cols-3 text-center max-w-80 m-auto pt-2">
            <button
                className="text-normal outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 px-2 py-0.5 rounded-md
                hover:bg-stone-400/40 active:bg-stone-400/70"
                aria-label="Go to the previous page."
                onClick={previousPage}
                disabled={page <= 1}
                title="Previous Page."
            >
                Previous
            </button>
            <span className="text-large">{page}</span>
            <button
                className="text-normal outline outline-stone-500 disabled:outline-stone-400 disabled:bg-stone-400/20 px-2 py-0.5 rounded-md
                hover:bg-stone-400/40 active:bg-stone-400/70"
                aria-label="Go to the next page."
                onClick={nextPage}
                disabled={page >= registeredTeams.length / MAX_ITEMS_PER_PAGE}
                title="Next Page."
            >
                Next
            </button>
        </div>
    )
}

export default TeamPageNavigation
