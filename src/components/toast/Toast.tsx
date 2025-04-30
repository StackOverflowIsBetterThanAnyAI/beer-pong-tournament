import { useEffect, useState } from 'react'

type SuccessProps = {
    label: string
    success: boolean
}

const Toast = ({ label, success }: SuccessProps) => {
    const [isTriggered, setIsTriggered] = useState<boolean>(true)

    const opacity = isTriggered ? 'opacity-90' : 'opacity-0'
    const theme = success
        ? 'bg-green-500 text-stone-900/95'
        : 'bg-red-400 text-stone-950'

    useEffect(() => {
        setTimeout(() => setIsTriggered(false), 3000)
    }, [])

    return (
        <div
            className={`text-normal absolute bottom-6 left-6 rounded-sm
                outline-1 outline-zinc-50 p-2 transition-[opacity] duration-700 ${opacity} ${theme}`}
            role="status"
            aria-live="polite"
        >
            {label}
        </div>
    )
}

export default Toast
