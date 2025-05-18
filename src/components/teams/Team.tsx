import { useContext } from 'react'
import { RegisteredTeamProps } from '../../types/types'
import { ContextAdmin } from '../../context/ContextAdmin'

type TeamProps = {
    index: number
    isLoading: boolean
    item: RegisteredTeamProps
    handleDelete: (item: RegisteredTeamProps) => Promise<void>
}

const Team = ({ index, isLoading, item, handleDelete }: TeamProps) => {
    const contextAdmin = useContext(ContextAdmin)
    if (!contextAdmin) {
        throw new Error('Teams must be used within a ContextAdmin.Provider')
    }
    const [isAdmin, _setIsAdmin] = contextAdmin

    return (
        <li
            key={item.name}
            className="flex flex-col w-full max-w-96 justify-between bg-stone-400/70 m-auto p-1.5 lg:p-2 rounded-md h-full"
            role="menuitem"
        >
            <div
                className={`flex flex-col w-full max-w-96 justify-between drop-shadow-stone-300/80 drop-shadow-md m-auto p-2 lg:p-2.5 rounded-sm h-full ${
                    index % 2 ? 'bg-red-200' : 'bg-stone-200'
                }`}
            >
                <div>
                    <div className="text-large font-bold underline text-ellipsis overflow-hidden lg:pb-1">
                        {item.name}
                    </div>
                    <div className="flex gap-x-2 flex-wrap justify-between">
                        <div className="text-normal text-ellipsis overflow-hidden">
                            {item.member_one}
                        </div>
                        <div className="text-normal text-ellipsis overflow-hidden">
                            {item.member_two}
                        </div>
                    </div>
                </div>
                {isAdmin ? (
                    <button
                        className={`page relative text-normal outline mt-2 lg:mt-2.5 py-0.5 rounded-md focus-visible:bg-stone-50 z-10 
                    ${
                        index % 2
                            ? 'bg-red-50 outline-red-400 active:bg-red-200 disabled:bg-red-100/80 animate-red-50-red-100'
                            : 'bg-stone-100/90 outline-stone-500 active:bg-stone-300 disabled:bg-stone-50/20 animate-stone-50-stone-300'
                    }`}
                        onClick={() => handleDelete(item)}
                        aria-label={`Delete ${item.name}`}
                        title={`Delete ${item.name}`}
                        aria-disabled={isLoading}
                        disabled={isLoading}
                    >
                        Delete
                    </button>
                ) : null}
            </div>
        </li>
    )
}

export default Team
