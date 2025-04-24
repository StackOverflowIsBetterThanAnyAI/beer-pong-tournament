import PageNavigation from '../page/PageNavigation'
import { MATCHES_PER_GROUP } from '../../constants/constants'
import { ScheduleProps } from '../../types/types'

type ScheduleItemProps = {
    MAX_ITEMS_PER_PAGE: number
    nextPage: () => void
    page: number
    previousPage: () => void
    schedule: ScheduleProps
}

const ScheduleItem = ({
    MAX_ITEMS_PER_PAGE,
    nextPage,
    page,
    previousPage,
    schedule,
}: ScheduleItemProps) => {
    return (
        <>
            <ul className="flex flex-col gap-2 w-full max-w-80 bg-stone-400 drop-shadow-stone-600/60 drop-shadow-md my-4 p-2 m-auto rounded-sm">
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
                            >
                                {x % MATCHES_PER_GROUP ? null : (
                                    <h2 className="text-large font-bold underline">
                                        {i.group}
                                    </h2>
                                )}
                                <ul className="flex flex-col gap-2 pt-1">
                                    <li className="text-normal font-normal">
                                        <div className="flex flex-col">
                                            <div className="flex flex-wrap max-[260px]:flex-col justify-between gap-x-2 font-bold text-ellipsis overflow-hidden">
                                                <label
                                                    htmlFor={`input${i.team1}vs${i.team2}`}
                                                >
                                                    {i.team1}
                                                </label>
                                                <span className="m-1">
                                                    {i.score_team1 ?? (
                                                        <input
                                                            id={`input${i.team1}vs${i.team2}`}
                                                            type="number"
                                                            min={0}
                                                            max={10}
                                                            className={`${
                                                                x % 2
                                                                    ? 'bg-red-400 !outline-red-600'
                                                                    : 'bg-stone-400/70 !outline-stone-500'
                                                            } w-full pl-1 rounded-sm`}
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap max-[260px]:flex-col justify-between gap-x-2 font-bold text-ellipsis overflow-hidden">
                                                <label
                                                    htmlFor={`input${i.team2}vs${i.team1}`}
                                                >
                                                    {i.team2}
                                                </label>
                                                <span className="m-1">
                                                    {i.score_team2 ?? (
                                                        <input
                                                            id={`input${i.team2}vs${i.team1}`}
                                                            type="number"
                                                            min={0}
                                                            max={10}
                                                            className={`${
                                                                x % 2
                                                                    ? 'bg-red-400 !outline-red-600'
                                                                    : 'bg-stone-400/70 !outline-stone-500'
                                                            } w-full pl-1 rounded-sm`}
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                            <button
                                                className={`bg-stone-100/90 outline text-normal rounded-md mt-2 p-0.5 focus-visible:bg-stone-50 
                                                    ${
                                                        x % 2
                                                            ? 'outline-red-400 hover:bg-red-100 active:bg-red-200'
                                                            : 'outline-stone-500 hover:bg-stone-200/80 active:bg-stone-300'
                                                    }`}
                                                aria-label="Save Score"
                                                title="Save Score"
                                            >
                                                Save Score
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        )
                    })}
            </ul>
            <PageNavigation
                MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE * MATCHES_PER_GROUP}
                nextPage={nextPage}
                page={page}
                previousPage={previousPage}
                registeredTeams={schedule}
            />
        </>
    )
}

export default ScheduleItem
