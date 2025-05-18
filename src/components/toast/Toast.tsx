import { useEffect, useState } from 'react'

type SuccessProps = {
    isSuccess: boolean
    label: string
}

const Toast = ({ isSuccess, label }: SuccessProps) => {
    const [isTriggered, setIsTriggered] = useState<boolean>(true)

    const opacity = isTriggered ? 'opacity-90' : 'opacity-0'
    const theme = isSuccess
        ? 'bg-green-500 text-stone-900/95'
        : 'bg-red-400 text-stone-950'

    useEffect(() => {
        setTimeout(() => setIsTriggered(false), 3000)
    }, [])

    return (
        <div
            className={`text-normal fixed bottom-6 left-6 rounded-sm
            outline-1 outline-zinc-50 p-2 transition-[opacity] duration-700 ${opacity} ${theme}`}
            role="status"
            aria-live="polite"
        >
            {label}
        </div>
    )
}

export default Toast
