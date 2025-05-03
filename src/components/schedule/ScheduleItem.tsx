import { useContext } from 'react'
import PageNavigation from '../page/PageNavigation'
import ScheduleItemScore from './ScheduleItemScore'
import { MATCHES_PER_GROUP } from '../../constants/constants'
import { ContextSchedule } from '../../context/ContextSchedule'

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
    const contextSchedule = useContext(ContextSchedule)
    if (!contextSchedule) {
        throw new Error(
            'ScheduleItem must be used within a ContextSchedule.Provider'
        )
    }
    const [schedule, _setSchedule] = contextSchedule

    return (
        <>
            <ul
                className="flex flex-col gap-1.5 w-full max-w-96 bg-stone-400/70 drop-shadow-stone-600/60 drop-shadow-sm my-4 p-1.5 m-auto rounded-sm"
                role="menu"
            >
                {schedule
                    .filter((item, index) => {
                        if (
                            index >=
                                (page - 1) *
                                    MAX_ITEMS_PER_PAGE *
                                    MATCHES_PER_GROUP &&
                            index <
                                page * MAX_ITEMS_PER_PAGE * MATCHES_PER_GROUP
                        )
                            return item
                    })
                    .map((i, x) => {
                        return (
                            <li
                                key={i.id}
                                className={`p-2 rounded-sm ${
                                    x % 2 ? 'bg-red-100' : 'bg-stone-200'
                                }`}
                                role="menuitem"
                            >
                                {x % MATCHES_PER_GROUP ? null : (
                                    <h2 className="text-large font-bold underline">
                                        {i.group}
                                    </h2>
                                )}
                                <ul
                                    className="flex flex-col gap-2 pt-1"
                                    role="menu"
                                >
                                    <li
                                        className="text-normal font-normal"
                                        role="menuitem"
                                    >
                                        <div className="flex flex-col">
                                            <ScheduleItemScore i={i} x={x} />
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        )
                    })}
            </ul>
            {schedule.length > MAX_ITEMS_PER_PAGE * MATCHES_PER_GROUP ? (
                <PageNavigation
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
