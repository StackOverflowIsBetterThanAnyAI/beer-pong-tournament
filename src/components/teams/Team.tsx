import { useContext } from 'react'
import { RegisteredTeamProps } from '../../types/types'
import { ContextAdmin } from '../../context/ContextAdmin'

type TeamProps = {
    index: number
    item: RegisteredTeamProps
    handleDelete: (item: RegisteredTeamProps) => Promise<void>
}

const Team = ({ index, item, handleDelete }: TeamProps) => {
    const contextAdmin = useContext(ContextAdmin)
    if (!contextAdmin) {
        throw new Error('Teams must be used within a ContextAdmin.Provider')
    }
    const [isAdmin, _setIsAdmin] = contextAdmin

    return (
        <li
            key={item.name}
            className={`flex flex-col w-full max-w-80 px-4 py-2 m-auto rounded-sm ${
                index % 2 ? 'bg-red-100' : 'bg-stone-200'
            }`}
            role="menuitem"
        >
            <div className="text-large font-bold underline text-ellipsis overflow-hidden">
                {item.name}
            </div>
            <div className="flex gap-x-2 flex-wrap justify-between">
                <div className="text-normal">{item.member_one}</div>
                <div className="text-normal">{item.member_two}</div>
            </div>
            {isAdmin ? (
                <button
                    className="text-normal bg-stone-300 outline outline-red-500 mt-2 py-0.5 rounded-md
                hover:bg-stone-300/60 active:bg-stone-300/30 focus-visible:bg-stone-100"
                    onClick={() => handleDelete(item)}
                    aria-label="Delete Team"
                    title="Delete Team"
                >
                    Delete
                </button>
            ) : null}
        </li>
    )
}

export default Team
