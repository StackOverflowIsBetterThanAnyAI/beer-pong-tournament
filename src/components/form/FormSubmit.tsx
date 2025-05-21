import { FetchLoading } from 'fetch-loading'

type FormSubmitProps = {
    handleClick: (e: React.MouseEvent<HTMLInputElement>) => void
    isDisabled: boolean
    isLoading: boolean
    testID?: string
    value: string
}

const FormSubmit = ({
    handleClick,
    isDisabled,
    isLoading,
    testID,
    value,
}: FormSubmitProps) => {
    return !isLoading ? (
        <input
            type="button"
            data-testid={testID}
            className="w-32 sm:w-40 self-center text-large bg-stone-100 disabled:bg-stone-200 outline disabled:outline-0 outline-stone-500 disabled:text-stone-600 px-2 py-1 mb-1 sm:mb-4 mt-4 rounded-xl
            enabled:hover:bg-zinc-300 enabled:active:bg-zinc-400"
            aria-disabled={isDisabled}
            aria-label={`${value}${isDisabled ? ' disabled.' : ''}`}
            onClick={handleClick}
            disabled={isDisabled}
            title={`${value}${isDisabled ? ' disabled.' : ''}`}
            value={value}
        />
    ) : (
        <button
            className="flex items-center justify-center w-32 sm:w-40 sm:h-9 self-center text-large bg-stone-200 outline outline-stone-500 text-stone-600 px-2 py-1 mb-1 sm:mb-4 mt-4 rounded-xl"
            aria-disabled="true"
            aria-label={`${value} disabled.`}
            disabled={true}
            title={`${value} disabled.`}
        >
            <FetchLoading theme="#44403c" />
        </button>
    )
}

export default FormSubmit
