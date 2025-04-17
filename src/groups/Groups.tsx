import { TournamentGroupsProps } from '../types/tpyes'

type GroupsProps = {
    groups: TournamentGroupsProps
}

const Groups = ({ groups }: GroupsProps) => {
    return (
        <ul className="flex flex-col gap-2 w-full max-w-80 bg-stone-400 drop-shadow-stone-600/60 drop-shadow-md my-4 p-2 m-auto rounded-sm">
            {groups.map((item, index) => {
                return (
                    <li
                        key={item.id}
                        className={`p-2 rounded-sm ${
                            index % 2 ? 'bg-red-100' : 'bg-stone-200'
                        }`}
                    >
                        <h2 className="text-large font-bold underline">
                            {item.name}
                        </h2>
                        <ul className="flex flex-col gap-2 pt-1">
                            {item.teams.map((i) => {
                                return (
                                    <li
                                        key={i.id}
                                        className={`text-normal font-normal border-b-2 ${
                                            index % 2
                                                ? 'border-red-500'
                                                : 'border-stone-600'
                                        } `}
                                    >
                                        <div className="flex flex-col">
                                            <div className="font-bold text-ellipsis overflow-hidden">
                                                {i.name}
                                            </div>
                                            <div className="flex justify-between">
                                                <div className="text-ellipsis overflow-hidden">
                                                    {i.member_one}
                                                </div>
                                                <div className="text-ellipsis overflow-hidden">
                                                    {i.member_two}
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
    )
}

export default Groups
