import KnockoutMatchScore from './KnockoutMatchScore'
import PageNavigation from '../page/PageNavigation'
import { MAX_MATCHES_KO_STAGE } from '../../constants/constants'
import { KOStageProps } from '../../types/types'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import KnockoutLegend from './KnockoutLegend'
import KnockoutChampion from './KnockoutChampion'

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
            index >= (page - 1) * MAX_MATCHES_KO_STAGE &&
            index < page * MAX_MATCHES_KO_STAGE
        )
            return item
    })

    return (
        <>
            {tournamentWinner && page === 1 ? <KnockoutChampion /> : null}
            <ul
                className="flex flex-col gap-1.5 w-full max-w-96 bg-stone-400/70 drop-shadow-stone-600/60 drop-shadow-sm my-4 p-1.5 m-auto rounded-sm"
                role="menu"
            >
                {filteredKOStage.map((i, x) => {
                    const isFirstOfStage =
                        filteredKOStage.findIndex(
                            (item) => item.round === i.round
                        ) === x
                    return (
                        <li
                            key={i.id}
                            className={`p-2 rounded-sm ${
                                i.round === 'QF' || i.round === 'F'
                                    ? 'bg-red-200'
                                    : 'bg-stone-200'
                            }`}
                            role="menuitem"
                        >
                            {isFirstOfStage ? (
                                <h2 className="text-large font-bold underline pb-2">
                                    {i.round_display}
                                </h2>
                            ) : null}
                            <ul className="flex flex-col gap-2" role="menu">
                                <li
                                    className="text-normal font-normal"
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
                    )
                })}
            </ul>
            {tournamentWinner && page !== 1 ? <KnockoutChampion /> : null}
            <KnockoutLegend />
            {koStage.length > MAX_MATCHES_KO_STAGE ? (
                <PageNavigation
                    isMatch
                    MAX_ITEMS_PER_PAGE={MAX_MATCHES_KO_STAGE}
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
