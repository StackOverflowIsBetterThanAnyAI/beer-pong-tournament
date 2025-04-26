import PageNavigation from '../page/PageNavigation'
import { TournamentGroupsProps } from '../../types/types'
import { useTeamsPerPage } from '../../hooks/useTeamsPerPage'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'

type GroupsProps = {
    groups: TournamentGroupsProps
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
}

const Groups = ({ groups, page, setPage }: GroupsProps) => {
    const MAX_ITEMS_PER_PAGE = useTeamsPerPage()

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

    return (
        <>
            <ul
                className="flex flex-col gap-2 w-full max-w-80 bg-stone-400 drop-shadow-stone-600/60 drop-shadow-md my-4 p-2 m-auto rounded-sm"
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
                                className={`p-2 rounded-sm ${
                                    x % 2 ? 'bg-red-100' : 'bg-stone-200'
                                }`}
                                role="menuitem"
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
                                                    x % 2
                                                        ? 'border-red-500'
                                                        : 'border-stone-600'
                                                } `}
                                                role="menuitem"
                                            >
                                                <div className="flex flex-col">
                                                    <div className="font-bold text-ellipsis overflow-hidden">
                                                        {t.name}
                                                    </div>
                                                    <div className="flex justify-between">
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
                            </li>
                        )
                    })}
            </ul>
            <PageNavigation
                MAX_ITEMS_PER_PAGE={MAX_ITEMS_PER_PAGE}
                nextPage={nextPage}
                page={page}
                previousPage={previousPage}
                registeredTeams={groups}
            />
        </>
    )
}

export default Groups
