import { HTMLInputAutoCompleteAttribute, useContext } from 'react'
import { ContextPasswordVisibility } from './../../context/ContextPasswordVisibility'

type FormInputPasswordProps = {
    autoComplete: HTMLInputAutoCompleteAttribute
    error: string | boolean
    id: string
    isDisabled?: boolean
    isHidden?: boolean
    label: string
    maxLength: number
    minLength: number
    onInput: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    testID?: string
    title: string
    value: string
}

const FormInputPassword = ({
    autoComplete,
    error,
    id,
    isDisabled = false,
    isHidden,
    label,
    maxLength,
    minLength,
    onInput,
    onKeyDown = undefined,
    testID,
    title,
    value,
}: FormInputPasswordProps) => {
    const contextPasswordVisibility = useContext(ContextPasswordVisibility)
    if (!contextPasswordVisibility) {
        throw new Error(
            'FormInputPassword must be used within a ContextPasswordVisibility.Provider'
        )
    }
    const [isPasswordHidden, setIsPasswordHidden] = contextPasswordVisibility

    const marginBottom = error ? 'mb-1' : 'mb-5 sm:mb-6'

    const handleTogglePasswordVisibility = () => {
        setIsPasswordHidden((prev) => !prev)
    }

    return (
        <>
            <label htmlFor={id} className="text-large py-1">
                {label} <span className="text-red-800">*</span>
            </label>
            <div
                className={`flex gap-2 items-center bg-stone-100 has-[input:disabled]:bg-stone-200
                            outline outline-stone-500 has-[input:disabled]:outline-0 rounded-md p-1 pr-2 ${marginBottom}`}
            >
                <input
                    id={id}
                    data-testid={testID}
                    className={`bg-stone-100 disabled:bg-stone-200 text-normal w-full px-1 rounded
                    enabled:hover:bg-stone-200`}
                    aria-disabled={isDisabled}
                    aria-required="true"
                    aria-label={title}
                    autoComplete={autoComplete}
                    disabled={isDisabled}
                    maxLength={maxLength}
                    minLength={minLength}
                    name={label.replace(/\s/g, '').toLowerCase()}
                    onInput={onInput}
                    onKeyDown={onKeyDown}
                    placeholder="password"
                    required
                    title={title}
                    type={isPasswordHidden ? 'password' : 'text'}
                    value={value}
                />
                <input
                    id={`show-${id}`}
                    className="outline outline-stone-500 disabled:outline-0"
                    aria-checked={!isPasswordHidden}
                    aria-disabled={isDisabled}
                    aria-label={`${isDisabled ? 'Currently disabled. ' : ''}${
                        isHidden ? 'Show' : 'Hide'
                    } password.`}
                    checked={!isHidden}
                    disabled={isDisabled}
                    onChange={handleTogglePasswordVisibility}
                    title={`${isDisabled ? 'Currently disabled. ' : ''}${
                        isHidden ? 'Show' : 'Hide'
                    } password.`}
                    type="checkbox"
                />
            </div>
        </>
    )
}

export default FormInputPassword
