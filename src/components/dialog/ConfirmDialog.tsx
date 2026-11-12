import { useEffect, useId, useRef } from 'react'
import { ConfirmDialogProps } from '../../types/types'

const ConfirmDialog = ({
    confirmLabel,
    isOpen,
    message,
    onCancel,
    onConfirm,
    title,
}: ConfirmDialogProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const cancelRef = useRef<HTMLButtonElement>(null)
    const titleId = useId()
    const messageId = useId()

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        if (isOpen && !dialog.open) {
            dialog.showModal()
            cancelRef.current?.focus()
        } else if (!isOpen && dialog.open) {
            dialog.close()
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return

        const root = document.documentElement
        root.classList.add('scroll-locked')

        return () => {
            root.classList.remove('scroll-locked')
        }
    }, [isOpen])

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) onCancel()
    }

    return (
        <dialog
            ref={dialogRef}
            onCancel={(e) => {
                e.preventDefault()
                onCancel()
            }}
            onClick={handleBackdropClick}
            aria-labelledby={titleId}
            aria-describedby={messageId}
            className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg bg-stone-200 text-stone-800 p-0
            drop-shadow-stone-900 drop-shadow-sm backdrop:bg-stone-950/50"
            data-testid="confirm-dialog"
        >
            <div className="p-4 sm:p-6">
                <h2
                    id={titleId}
                    className="text-center font-bold text-extra-large pb-2"
                >
                    {title}
                </h2>
                <p
                    id={messageId}
                    className="text-center text-normal text-pretty"
                >
                    {message}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4 sm:mt-6">
                    <button
                        ref={cancelRef}
                        onClick={onCancel}
                        className="relative text-normal rounded-md outline py-1 lg:py-1.5 z-10
                    bg-stone-100/90 outline-stone-500 active:bg-stone-300 animate-stone-50-stone-300"
                        data-testid="confirm-dialog-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="relative text-normal rounded-md outline py-1 lg:py-1.5 z-10
                    bg-red-50 outline-red-400 active:bg-red-200 animate-red-50-red-100"
                        data-testid="confirm-dialog-confirm"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </dialog>
    )
}

export default ConfirmDialog
