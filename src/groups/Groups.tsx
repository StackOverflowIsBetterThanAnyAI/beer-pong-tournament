import PageNavigation from '../page/PageNavigation'
import { TournamentGroupsProps } from '../types/tpyes'
import { useTeamsPerPage } from '../hooks/useTeamsPerPage'
import { setItemInStorage } from '../utils/setItemInStorage'

type GroupsProps = {
    groups: TournamentGroupsProps
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
}

const Groups = ({ groups, page, setPage }: GroupsProps) => {
    const MAX_ITEMS_PER_PAGE = useTeamsPerPage()

    const previousPage = () => {
        setPage((prev) => prev - 1)
        setItemInStorage('grouppage', page - 1)
    }

    const nextPage = () => {
        setPage((prev) => prev + 1)
        setItemInStorage('grouppage', page + 1)
    }

    return (
        <>
            <ul className="flex flex-col gap-2 w-full max-w-80 bg-stone-400 drop-shadow-stone-600/60 drop-shadow-md my-4 p-2 m-auto rounded-sm">
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
                            >
                                <h2 className="text-large font-bold underline">
                                    {i.name}
                                </h2>
                                <ul className="flex flex-col gap-2 pt-1">
                                    {i.teams.map((t) => {
                                        return (
                                            <li
                                                key={t.id}
                                                className={`text-normal font-normal border-b-2 ${
                                                    x % 2
                                                        ? 'border-red-500'
                                                        : 'border-stone-600'
                                                } `}
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
