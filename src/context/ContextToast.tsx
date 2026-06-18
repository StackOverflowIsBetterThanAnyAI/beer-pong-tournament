import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react'
import Toast from '../components/toast/Toast'
import { ContextIsToastVisible } from './ContextIsToastVisible'
import { ToastProps } from '../types/types'

type ContextToastType = {
    showToast: (toast: ToastProps) => void
}

const ContextToast = createContext<ContextToastType | undefined>(undefined)

export const ContextToastProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const contextIsToastVisible = useContext(ContextIsToastVisible)
    if (!contextIsToastVisible) {
        throw new Error(
            'ContextToastProvider must be used within a ContextIsToastVisible.Provider'
        )
    }
    const [isVisible, setIsVisible] = contextIsToastVisible

    const [toast, setToast] = useState<ToastProps | null>(null)

    const showToast = useCallback(
        ({ label, isSuccess }: ToastProps) => {
            setToast({ label, isSuccess })
            setIsVisible(true)
        },
        [setIsVisible]
    )

    useEffect(() => {
        if (isVisible) {
            const timeout = setTimeout(() => setIsVisible(false), 3750)
            return () => clearTimeout(timeout)
        }
    }, [isVisible, setIsVisible])

    return (
        <ContextToast.Provider value={{ showToast }}>
            {children}
            {isVisible && toast && (
                <Toast label={toast.label} isSuccess={toast.isSuccess} />
            )}
        </ContextToast.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useContextToast = () => {
    const context = useContext(ContextToast)
    if (!context) {
        throw new Error('useContextToast must be used within a ToastProvider')
    }
    return context
}
