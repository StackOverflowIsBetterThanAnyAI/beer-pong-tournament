import { useContext, useEffect, useState } from 'react'
import { ContextIsToastVisible } from '../../context/ContextIsToastVisible'

type SuccessProps = {
    isSuccess: boolean
    label: string
}

const Toast = ({ isSuccess, label }: SuccessProps) => {
    const contextIsToastVisible = useContext(ContextIsToastVisible)
    if (!contextIsToastVisible) {
        throw new Error(
            'FormInputPassword must be used within a ContextIsToastVisible.Provider'
        )
    }
    const [_isVisible, setIsVisible] = contextIsToastVisible

    const [isTriggered, setIsTriggered] = useState<boolean>(true)

    const opacity = isTriggered ? 'opacity-90' : 'opacity-0'
    const theme = isSuccess
        ? 'bg-green-500 text-stone-900/95'
        : 'bg-red-400 text-stone-950'

    useEffect(() => {
        setTimeout(() => setIsTriggered(false), 3000)
    }, [])

    const handleCloseToast = () => {
        setIsTriggered(false)
        setIsVisible(false)
    }

    return (
        <div
            className={`text-normal fixed flex gap-2 bottom-6 left-2 min-[280px]:left-6 rounded-sm
            outline-1 outline-zinc-50 p-2 transition-[opacity] duration-700 ${opacity} ${theme}`}
            role="status"
            aria-live="polite"
        >
            {label}
            <button
                className="flex items-center justify-center rounded-full outline-1 outline-stone-900 text-sm h-4 w-4 bg-zinc-50/80"
                onClick={handleCloseToast}
                aria-label="Close Notification"
                title="Close Notification"
            >
                ×
            </button>
        </div>
    )
}

export default Toast
