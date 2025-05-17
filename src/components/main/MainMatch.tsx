import { GameProps, KOMatchProps } from '../../types/types'

type MainMatchProps = {
    item: GameProps | KOMatchProps
}

const MainMatch = ({ item }: MainMatchProps) => {
    return (
        <li className="max-w-md w-full m-auto" role="menuitem">
            <h2 className="text-large font-bold underline pb-2 lg:pb-2.5">
                {item.played ? 'Last ' : 'Upcoming '}Match:
            </h2>
            <ul
                className="flex flex-col gap-2 lg:gap-2.5 bg-stone-400/70 p-2 rounded-md"
                role="menu"
            >
                <li
                    className={`p-2 text-normal font-normal rounded-sm ${
                        item.played ? 'bg-red-200' : 'bg-stone-200'
                    } drop-shadow-stone-300/80 drop-shadow-md`}
                    role="menuitem"
                >
                    <div className="flex flex-col">
                        <div className="flex flex-wrap items-center max-[280px]:flex-col justify-between gap-x-2 text-ellipsis overflow-hidden pb-1">
                            <span
                                className={`${
                                    item.score_team1 === 10 ? 'font-bold' : ''
                                } text-ellipsis overflow-hidden max-w-full`}
                            >
                                {(item as KOMatchProps).team1_name ||
                                    item.team1}
                            </span>
                            <span
                                className={`!m-1 ${
                                    item.score_team1 === 10 ? 'font-bold' : ''
                                }`}
                            >
                                {item.score_team1 || '-'}
                            </span>
                        </div>
                        <hr
                            className={`border-t-2 pt-1 ${
                                item.played
                                    ? 'border-red-500/50'
                                    : 'border-stone-500/50'
                            }`}
                        />
                        <div className="flex flex-wrap items-center max-[280px]:flex-col justify-between gap-x-2 text-ellipsis overflow-hidden">
                            <span
                                className={`${
                                    item.score_team2 === 10 ? 'font-bold' : ''
                                } text-ellipsis overflow-hidden max-w-full`}
                            >
                                {(item as KOMatchProps).team2_name ||
                                    item.team2}
                            </span>
                            <span
                                className={`!m-1 ${
                                    item.score_team2 === 10 ? 'font-bold' : ''
                                }`}
                            >
                                {item.score_team2 || '-'}
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
        </li>
    )
}

export default MainMatch
