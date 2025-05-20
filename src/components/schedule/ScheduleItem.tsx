import React, { useContext } from 'react'
import PageNavigation from '../page/PageNavigation'
import ScheduleItemScore from './ScheduleItemScore'
import ScheduleLegend from './ScheduleLegend'
import { MATCHES_PER_GROUP } from '../../constants/constants'
import { ContextSchedule } from '../../context/ContextSchedule'
import { GameProps } from '../../types/types'
import { useScreenWidth } from '../../hooks/useScreenWidth'

type ScheduleItemProps = {
    MAX_ITEMS_PER_PAGE: number
    nextPage: () => void
    page: number
    previousPage: () => void
}

const ScheduleItem = ({
    MAX_ITEMS_PER_PAGE,
    nextPage,
    page,
    previousPage,
}: ScheduleItemProps) => {
    const SCREEN_WIDTH = useScreenWidth()

    const contextSchedule = useContext(ContextSchedule)
    if (!contextSchedule) {
        throw new Error(
            'ScheduleItem must be used within a ContextSchedule.Provider'
        )
    }
    const [schedule, _setSchedule] = contextSchedule

    const groupedSchedule = schedule.reduce((total, cur) => {
        if (!total[cur.group]) {
            total[cur.group] = []
        }
        total[cur.group].push(cur)
        return total
    }, {} as Record<string, GameProps[]>)

    const groupKeys = Object.keys(groupedSchedule)
    const paginatedGroupKeys = groupKeys.slice(
        (page - 1) * MAX_ITEMS_PER_PAGE,
        page * MAX_ITEMS_PER_PAGE
    )

    const redBackground = 'bg-red-200'
    const stoneBackground = 'bg-stone-200'

    return (
        <>
            <ul
                className="flex flex-col sm:grid lg:[grid-template-columns:repeat(2,minmax(384px,1fr))]
                gap-4 lg:gap-5 max-w-96 w-full sm:w-2/3 lg:w-full sm:max-w-lg lg:max-w-4xl
                mx-auto my-4 lg:my-5 rounded-sm"
                role="menu"
            >
                {paginatedGroupKeys.map((item, index) => {
                    return (
                        <React.Fragment key={item}>
                            <li role="menuitem">
                                <h2 className="text-large font-bold underline pb-4 lg:pb-5">
                                    {item}
                                </h2>
                                <ul
                                    className="flex flex-col gap-2 lg:gap-2.5 bg-stone-400/70 p-2 rounded-md"
                                    role="menu"
                                >
                                    {groupedSchedule[item].map((i, x) => (
                                        <li
                                            key={i.id}
                                            className={`p-2 text-normal font-normal rounded-sm ${
                                                SCREEN_WIDTH === 'DESKTOP'
                                                    ? [1, 2, 5, 6].includes(
                                                          index
                                                      )
                                                        ? ![2, 3].includes(x)
                                                            ? redBackground
                                                            : stoneBackground
                                                        : [2, 3].includes(x)
                                                        ? redBackground
                                                        : stoneBackground
                                                    : index % 2
                                                    ? ![2, 3].includes(x)
                                                        ? redBackground
                                                        : stoneBackground
                                                    : [2, 3].includes(x)
                                                    ? redBackground
                                                    : stoneBackground
                                            } drop-shadow-stone-300/80 drop-shadow-md`}
                                            role="menuitem"
                                        >
                                            {x % 2 ? null : (
                                                <h3 className="text-normal font-bold underline pb-2">{`Matchday ${
                                                    x / 2 + 1
                                                }`}</h3>
                                            )}
                                            <div className="flex flex-col">
                                                <ScheduleItemScore
                                                    i={i}
                                                    index={index}
                                                    x={x}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </React.Fragment>
                    )
                })}
            </ul>
            <ScheduleLegend />
            {schedule.length > MAX_ITEMS_PER_PAGE * MATCHES_PER_GROUP ? (
                <PageNavigation
                    isMatch
                    MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE * MATCHES_PER_GROUP}
                    nextPage={nextPage}
                    page={page}
                    previousPage={previousPage}
                    registeredTeams={schedule}
                />
            ) : null}
        </>
    )
}

export default ScheduleItem
