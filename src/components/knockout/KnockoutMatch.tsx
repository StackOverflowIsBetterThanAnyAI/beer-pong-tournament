import React from 'react'
import KnockoutChampion from './KnockoutChampion'
import KnockoutLegend from './KnockoutLegend'
import KnockoutMatchScore from './KnockoutMatchScore'
import PageNavigation from '../page/PageNavigation'
import { KOStageProps } from '../../types/types'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import { useUpdatePage } from '../../hooks/useUpdatePage'
import { useKOMatchesPerPage } from '../../hooks/useKOMatchesPerPage'

type KnockoutMatchProps = {
    koStage: KOStageProps
    page: number
    setKOStage: React.Dispatch<React.SetStateAction<KOStageProps>>
    setPage: React.Dispatch<React.SetStateAction<number>>
    tournamentWinner: string
}

const KnockoutMatch = ({
    koStage,
    page,
    setKOStage,
    setPage,
    tournamentWinner,
}: KnockoutMatchProps) => {
    const MAX_ITEMS_PER_PAGE = useKOMatchesPerPage()

    useUpdatePage({
        items: koStage,
        key: 'kostagepage',
        MAX_ITEMS_PER_PAGE,
        page,
        setPage,
    })

    const previousPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1)
            setItemInSessionStorage('kostagepage', page - 1)
        }
    }

    const nextPage = () => {
        setPage((prev) => prev + 1)
        setItemInSessionStorage('kostagepage', page + 1)
    }

    const filteredKOStage = koStage.filter((item, index) => {
        if (
            index >= (page - 1) * MAX_ITEMS_PER_PAGE &&
            index < page * MAX_ITEMS_PER_PAGE
        )
            return item
    })

    return (
        <>
            {tournamentWinner && page === 1 ? <KnockoutChampion /> : null}
            <ul
                className="flex flex-col lg:grid lg:[grid-template-columns:repeat(2,minmax(384px,1fr))]
                gap-4 lg:gap-5 max-w-96 w-full sm:w-2/3 lg:w-full sm:max-w-lg lg:max-w-4xl
                mx-auto my-4 lg:my-5 rounded-sm"
                role="menu"
            >
                {filteredKOStage.map((i, x) => {
                    const isFirstOfStage =
                        filteredKOStage.findIndex(
                            (item) => item.round === i.round
                        ) === x
                    return (
                        <React.Fragment key={i.id}>
                            {isFirstOfStage ? (
                                <h2 className="text-large font-bold underline col-span-2">
                                    {i.round_display}
                                </h2>
                            ) : null}
                            <li
                                className="p-2 rounded-md bg-stone-400/70"
                                role="menuitem"
                            >
                                <ul
                                    className="flex flex-col gap-2 h-full"
                                    role="menu"
                                >
                                    <li
                                        className={`p-2 text-normal font-normal rounded-sm h-full ${
                                            i.round === 'QF' || i.round === 'F'
                                                ? 'bg-red-200'
                                                : 'bg-stone-200'
                                        }`}
                                        role="menuitem"
                                    >
                                        <div className="flex flex-col">
                                            <KnockoutMatchScore
                                                i={i}
                                                setKOStage={setKOStage}
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </React.Fragment>
                    )
                })}
            </ul>
            {tournamentWinner && page !== 1 ? <KnockoutChampion /> : null}
            <KnockoutLegend />
            {koStage.length > MAX_ITEMS_PER_PAGE ? (
                <PageNavigation
                    isMatch
                    MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE}
                    nextPage={nextPage}
                    page={page}
                    previousPage={previousPage}
                    registeredTeams={koStage}
                />
            ) : null}
        </>
    )
}

export default KnockoutMatch
