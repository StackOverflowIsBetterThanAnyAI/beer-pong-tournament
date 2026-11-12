import { FetchLoading } from 'fetch-loading'
import { FormSubmitProps } from '../../types/types'

const FormSubmit = ({
    handleClick,
    isDisabled,
    isLoading,
    testID,
    value,
}: FormSubmitProps) => {
    return isLoading ? (
        <FetchLoading
            theme="#44403c"
            center
            className="cursor-not-allowed w-40! sm:w-48! h-8! sm:h-9! bg-stone-200 outline outline-stone-500 px-8 py-0.5 mb-1 mx-auto sm:mb-4 mt-4 rounded-md"
        />
    ) : (
        <input
            type="button"
            data-testid={testID}
            className="w-40 sm:w-48 h-8 sm:h-9 mx-auto text-large bg-stone-100 disabled:bg-stone-200 outline disabled:outline-0 outline-stone-500 disabled:text-stone-600 px-8 py-0.5 mb-1 sm:mb-4 mt-4 rounded-md
            enabled:hover:bg-zinc-300 enabled:active:bg-zinc-400"
            aria-label={`${value}${isDisabled ? ' disabled.' : ''}`}
            onClick={handleClick}
            disabled={isDisabled}
            title={`${value}${isDisabled ? ' disabled.' : ''}`}
            value={value}
        />
    )
}

export default FormSubmit
