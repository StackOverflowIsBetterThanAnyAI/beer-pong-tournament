import KnockoutMatchScore from './KnockoutMatchScore'
import { KOStageProps } from '../../types/types'

type KnockoutMatchProps = {
    koStage: KOStageProps
    setKOStage: React.Dispatch<React.SetStateAction<KOStageProps>>
}

const KnockoutMatch = ({ koStage, setKOStage }: KnockoutMatchProps) => {
    return (
        <ul
            className="flex flex-col gap-2 w-full max-w-80 bg-stone-400 drop-shadow-stone-600/60 drop-shadow-md my-4 p-2 m-auto rounded-sm"
            role="menu"
        >
            {koStage.map((i, x) => {
                const isFirstOfStage =
                    koStage.findIndex((item) => item.round === i.round) === x
                return (
                    <li
                        key={i.id}
                        className={`p-2 rounded-sm ${
                            i.round === 'QF' || i.round === 'F'
                                ? 'bg-red-100'
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
    )
}

export default KnockoutMatch
