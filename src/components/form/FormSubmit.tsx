import { FetchLoading } from 'fetch-loading'

type FormSubmitProps = {
    disabled: boolean
    handleClick: (e: React.MouseEvent<HTMLInputElement>) => void
    sendingRequest: boolean
    value: string
}

const FormSubmit = ({
    disabled,
    handleClick,
    sendingRequest,
    value,
}: FormSubmitProps) => {
    return !sendingRequest ? (
        <input
            type="button"
            className="w-32 sm:w-32 self-center text-large bg-stone-100 disabled:bg-stone-200 outline disabled:outline-0 outline-stone-500 disabled:text-stone-600 px-2 py-1 mb-1 mt-4 rounded-full
            enabled:hover:bg-zinc-300 enabled:active:bg-zinc-400"
            aria-disabled={disabled}
            aria-label={`${value}${disabled ? ' disabled.' : ''}`}
            onClick={handleClick}
            disabled={disabled}
            title={`${value}${disabled ? ' disabled.' : ''}`}
            value={value}
        />
    ) : (
        <button
            className="flex items-center justify-center w-32 sm:w-32 self-center text-large bg-stone-200 outline outline-stone-500 text-stone-600 px-2 py-1 mb-1 mt-4 rounded-full"
            aria-disabled={true}
            aria-label={`${value} disabled.`}
            disabled={true}
            title={`${value} disabled.`}
        >
            <FetchLoading theme="#44403c" />
        </button>
    )
}

export default FormSubmit
