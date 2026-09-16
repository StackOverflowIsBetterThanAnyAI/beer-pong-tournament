import { PageNavigationButtonProps } from '../../types/types'

const PageNavigationButton = ({
    changePage,
    isNext = false,
    MAX_ITEMS_PER_PAGE,
    page,
    registeredTeams,
}: PageNavigationButtonProps) => {
    const pageDisabled = isNext
        ? page >= registeredTeams.length / MAX_ITEMS_PER_PAGE
        : page <= 1
    const pageText = isNext ? 'Next' : 'Previous'
    const pageTitle = isNext
        ? page >= registeredTeams.length / MAX_ITEMS_PER_PAGE
            ? 'You are already at the last page.'
            : 'Go to next page'
        : page <= 1
          ? 'You are already at the first page.'
          : 'Go to previous page'

    return (
        <button
            className={`${isNext ? 'nextpage' : 'previouspage'} text-normal bg-stone-300 outline outline-stone-500
            disabled:outline-stone-400 disabled:bg-stone-400/20 disabled:text-stone-600 px-2 py-0.5 rounded-md
            hover:bg-stone-400/30 active:bg-stone-400/60`}
            aria-label={pageTitle}
            onClick={changePage}
            disabled={pageDisabled}
            title={pageTitle}
        >
            {pageText}
        </button>
    )
}

export default PageNavigationButton
