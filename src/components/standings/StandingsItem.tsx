import { StandingsProps } from '../../types/types'

type StandingsItemProps = {
    MAX_ITEMS_PER_PAGE: number
    page: number
    standings: StandingsProps
}

const StandingsItem = ({
    MAX_ITEMS_PER_PAGE,
    page,
    standings,
}: StandingsItemProps) => {
    return (
        <ul
            className="flex flex-col gap-1.5 w-full max-w-96 bg-stone-400/70 drop-shadow-stone-600/60 drop-shadow-sm my-4 p-1.5 m-auto rounded-sm"
            role="menu"
        >
            {standings
                .filter((item, index) => {
                    if (
                        index >= (page - 1) * MAX_ITEMS_PER_PAGE &&
                        index < page * MAX_ITEMS_PER_PAGE
                    )
                        return item
                })
                .map((i, x) => {
                    return (
                        <li
                            key={i.group}
                            className={`p-2 rounded-sm ${
                                x % 2 ? 'bg-red-100' : 'bg-stone-200'
                            }`}
                            role="menuitem"
                        >
                            <h2 className="text-large font-bold underline">
                                {i.group}
                            </h2>
                            <table className="flex flex-col gap-2 pt-2">
                                <thead>
                                    <tr className="max-[320px]:hidden flex justify-between px-2 text-normal w-full overflow-hidden text-ellipsis">
                                        <th>
                                            <div className="flex gap-2">
                                                <span
                                                    aria-label="Position"
                                                    title="Position"
                                                >
                                                    #
                                                </span>
                                                <span
                                                    aria-label="Team"
                                                    title="Team"
                                                >
                                                    Team
                                                </span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="grid grid-cols-3 w-32 text-center">
                                                <span
                                                    aria-label="Matches Played"
                                                    title="Matches Played"
                                                >
                                                    Played
                                                </span>
                                                <span
                                                    aria-label="Cup Difference"
                                                    title="Cup Difference"
                                                >
                                                    +/-
                                                </span>
                                                <span
                                                    aria-label="Points"
                                                    title="Points"
                                                >
                                                    Points
                                                </span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                {i.standings.map((s, sx) => {
                                    return (
                                        <tbody
                                            key={sx}
                                            className={`text-normal font-normal ${
                                                sx ===
                                                    i.standings.length / 2 -
                                                        1 ||
                                                (![2, 4, 8].includes(
                                                    standings.length
                                                ) &&
                                                    sx === 2)
                                                    ? 'pb-2 border-b-2'
                                                    : ''
                                            } ${
                                                sx === 0
                                                    ? 'min-[320px]:pt-2 min-[320px]:border-t-2'
                                                    : ''
                                            } ${
                                                x % 2
                                                    ? 'border-red-500'
                                                    : 'border-stone-600'
                                            } `}
                                        >
                                            <tr
                                                className={`flex flex-wrap max-[320px]:flex-col justify-between gap-y-1 w-full text-normal px-2 py-1 ${
                                                    s.played
                                                        ? sx < 2
                                                            ? 'bg-green-700/30'
                                                            : ![
                                                                  2, 4, 8,
                                                              ].includes(
                                                                  standings.length
                                                              ) && sx === 2
                                                            ? 'bg-amber-200'
                                                            : 'bg-red-600/30'
                                                        : ''
                                                }`}
                                            >
                                                <td className="font-bold text-ellipsis overflow-hidden">
                                                    <div className="flex gap-2">
                                                        <span
                                                            aria-label={`Current Position: ${
                                                                sx + 1
                                                            }`}
                                                            title={`Current Position: ${
                                                                sx + 1
                                                            }`}
                                                            className="max-[320px]:hidden"
                                                        >
                                                            {s.played
                                                                ? sx + 1
                                                                : '-'}
                                                        </span>
                                                        <span
                                                            className={`${
                                                                s.played
                                                                    ? sx < 2
                                                                        ? 'underline decoration-2 decoration-green-700'
                                                                        : ![
                                                                              2,
                                                                              4,
                                                                              8,
                                                                          ].includes(
                                                                              standings.length
                                                                          ) &&
                                                                          sx ===
                                                                              2
                                                                        ? 'underline decoration-2 decoration-yellow-600/60'
                                                                        : 'underline decoration-2 decoration-red-600'
                                                                    : ''
                                                            }`}
                                                            aria-label={s.team}
                                                            title={s.team}
                                                        >
                                                            {s.team}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="text-ellipsis overflow-hidden">
                                                    <div className="grid grid-cols-3 min-[320px]:min-w-32 text-center">
                                                        <span
                                                            title={`${s.played} Matches played`}
                                                            aria-label={`${s.played} Matches played`}
                                                        >
                                                            {s.played}
                                                        </span>
                                                        <span
                                                            title={`Cup difference: ${s.cup_difference}`}
                                                            aria-label={`Cup difference: ${s.cup_difference}`}
                                                        >
                                                            {s.cup_difference}
                                                        </span>
                                                        <span
                                                            className="font-bold"
                                                            title={`${s.points} Points`}
                                                            aria-label={`${s.points} Points`}
                                                        >
                                                            {s.points}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        </li>
                    )
                })}
        </ul>
    )
}

export default StandingsItem
