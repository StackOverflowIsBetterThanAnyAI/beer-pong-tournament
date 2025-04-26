import { RegisteredTeamProps } from '../../types/types'

type TeamProps = {
    item: RegisteredTeamProps
    handleDelete: (item: RegisteredTeamProps) => Promise<void>
}

const Team = ({ item, handleDelete }: TeamProps) => {
    return (
        <li
            key={item.name}
            className="flex flex-col max-w-80 bg-stone-400 drop-shadow-stone-600/60 drop-shadow-md my-4 px-4 py-2 m-auto rounded-sm"
            role="menuitem"
        >
            <div className="text-large font-bold text-ellipsis overflow-hidden">
                {item.name}
            </div>
            <div className="flex gap-x-2 flex-wrap justify-between">
                <div className="text-normal">{item.member_one}</div>
                <div className="text-normal">{item.member_two}</div>
            </div>
            <button
                className="text-normal bg-stone-300 outline outline-red-500 mt-2 py-0.5 rounded-md
                hover:bg-stone-300/60 active:bg-stone-300/30 focus-visible:bg-stone-100"
                onClick={() => handleDelete(item)}
                aria-label="Delete Team"
                title="Delete Team"
            >
                Delete
            </button>
        </li>
    )
}

export default Team
