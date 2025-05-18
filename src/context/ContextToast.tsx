import { createContext, useContext, useState, useEffect } from 'react'
import Toast from '../components/toast/Toast'
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
    const [toast, setToast] = useState<ToastProps | null>(null)
    const [visible, setVisible] = useState<boolean>(false)

    const showToast = ({ label, isSuccess }: ToastProps) => {
        setToast({ label, isSuccess })
        setVisible(true)
    }

    useEffect(() => {
        if (visible) {
            const timeout = setTimeout(() => setVisible(false), 3750)
            return () => clearTimeout(timeout)
        }
    }, [visible])

    return (
        <ContextToast.Provider value={{ showToast }}>
            {children}
            {visible && toast && (
                <Toast label={toast.label} isSuccess={toast.isSuccess} />
            )}
        </ContextToast.Provider>
    )
}

export const useContextToast = () => {
    const context = useContext(ContextToast)
    if (!context) {
        throw new Error('useContextToast must be used within a ToastProvider')
    }
    return context
}
