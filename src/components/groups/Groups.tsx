import GroupsLegend from './GroupsLegend'
import PageNavigation from '../page/PageNavigation'
import { TournamentGroupsProps } from '../../types/types'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import { useScreenWidth } from '../../hooks/useScreenWidth'
import { useTeamsPerPage } from '../../hooks/useTeamsPerPage'
import { useUpdatePage } from '../../hooks/useUpdatePage'

type GroupsProps = {
    groups: TournamentGroupsProps
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
}

const Groups = ({ groups, page, setPage }: GroupsProps) => {
    const MAX_ITEMS_PER_PAGE = useTeamsPerPage()
    const SCREEN_WIDTH = useScreenWidth()

    useUpdatePage({
        items: groups,
        key: 'grouppage',
        MAX_ITEMS_PER_PAGE,
        page,
        setPage,
    })

    const previousPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1)
            setItemInSessionStorage('grouppage', page - 1)
        }
    }

    const nextPage = () => {
        setPage((prev) => prev + 1)
        setItemInSessionStorage('grouppage', page + 1)
    }

    const redBackground = 'bg-red-200'
    const redBorder = 'border-red-500'
    const stoneBackground = 'bg-stone-200'
    const stoneBorder = 'border-stone-600'

    return (
        <>
            <ul
                className="flex flex-col sm:grid lg:[grid-template-columns:repeat(2,minmax(384px,1fr))]
                gap-4 lg:gap-5 max-w-96 w-full sm:w-2/3 lg:w-full sm:max-w-lg lg:max-w-4xl
                my-4 m-auto"
                role="menu"
            >
                {groups
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
                                key={i.id}
                                className="p-2 rounded-md bg-stone-400/70"
                                role="menuitem"
                            >
                                <div
                                    className={`p-2 lg:p-4 h-full drop-shadow-stone-300/80 drop-shadow-md rounded-sm ${
                                        SCREEN_WIDTH === 'DESKTOP'
                                            ? [1, 2, 5, 6].includes(x)
                                                ? redBackground
                                                : stoneBackground
                                            : x % 2
                                            ? redBackground
                                            : stoneBackground
                                    }`}
                                >
                                    <h2 className="text-large font-bold underline">
                                        {i.name}
                                    </h2>
                                    <ul
                                        className="flex flex-col gap-2 pt-2"
                                        role="menu"
                                    >
                                        {i.teams.map((t, tx) => {
                                            return (
                                                <li
                                                    key={t.id}
                                                    className={`text-normal font-normal ${
                                                        (tx + 1) % 4
                                                            ? 'pb-2 border-b-2'
                                                            : ''
                                                    } ${
                                                        SCREEN_WIDTH ===
                                                        'DESKTOP'
                                                            ? [
                                                                  1, 2, 5, 6,
                                                              ].includes(x)
                                                                ? redBorder
                                                                : stoneBorder
                                                            : x % 2
                                                            ? redBorder
                                                            : stoneBorder
                                                    }`}
                                                    role="menuitem"
                                                >
                                                    <div className="flex flex-col">
                                                        <div className="font-bold text-ellipsis overflow-hidden">
                                                            {t.name}
                                                        </div>
                                                        <div className="flex flex-wrap gap-x-2 justify-between">
                                                            <div className="text-ellipsis overflow-hidden">
                                                                {t.member_one}
                                                            </div>
                                                            <div className="text-ellipsis overflow-hidden">
                                                                {t.member_two}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </li>
                        )
                    })}
            </ul>
            <GroupsLegend />
            {groups.length > MAX_ITEMS_PER_PAGE ? (
                <PageNavigation
                    MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE}
                    nextPage={nextPage}
                    page={page}
                    previousPage={previousPage}
                    registeredTeams={groups}
                />
            ) : null}
        </>
    )
}

export default Groups
