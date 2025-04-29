import { useEffect, useState } from 'react'

type SuccessProps = { label: string }

const Taost = ({ label }: SuccessProps) => {
    const [isTriggered, setIsTriggered] = useState<boolean>(true)

    const opacity = isTriggered ? 'opacity-90' : 'opacity-0'

    useEffect(() => {
        setTimeout(() => setIsTriggered(false), 3000)
    }, [])

    return (
        <div
            className={`text-normal bg-green-500 text-stone-900/95 absolute bottom-6 left-6 rounded-sm
                outline-1 outline-zinc-50 p-2 transition-[opacity] duration-700 ${opacity}`}
            role="status"
            aria-live="polite"
        >
            {label}
        </div>
    )
}

export default Taost
