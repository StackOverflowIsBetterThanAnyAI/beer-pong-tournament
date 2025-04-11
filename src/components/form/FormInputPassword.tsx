import { HTMLInputAutoCompleteAttribute, useContext } from 'react'
import { ContextPasswordVisibility } from './../../context/ContextPasswordVisibility'

type FormInputPasswordProps = {
    autoComplete: HTMLInputAutoCompleteAttribute
    disabled?: boolean
    error: string | boolean
    hidden?: boolean
    id: string
    label: string
    maxLength: number
    minLength: number
    onInput: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    title: string
    value: string
}

const FormInputPassword = ({
    autoComplete,
    disabled = false,
    error,
    hidden,
    id,
    label,
    maxLength,
    minLength,
    onInput,
    onKeyDown = undefined,
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

    const marginBottom = error ? 'mb-1' : 'mb-5 md:mb-6'

    const handleTogglePasswordVisibility = () => {
        setIsPasswordHidden((prev) => !prev)
    }

    return (
        <>
            <label htmlFor={id} className="text-large py-1 md:py-0">
                {label} <span className="text-red-800">*</span>
            </label>
            <div
                className={`flex gap-2 items-center bg-stone-100 has-[input:disabled]:bg-stone-200
                            outline outline-stone-500 has-[input:disabled]:outline-0 rounded-md p-1 pr-2 ${marginBottom}`}
            >
                <input
                    id={id}
                    className={`bg-stone-100 disabled:bg-stone-200 text-normal w-full px-1 rounded
                    enabled:hover:bg-stone-200`}
                    aria-disabled={disabled}
                    aria-required="true"
                    aria-label={title}
                    autoComplete={autoComplete}
                    disabled={disabled}
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
                    aria-disabled={disabled}
                    aria-label={`${disabled ? 'Currently disabled. ' : ''}${
                        hidden ? 'Show' : 'Hide'
                    } password.`}
                    checked={!hidden}
                    disabled={disabled}
                    onChange={handleTogglePasswordVisibility}
                    title={`${disabled ? 'Currently disabled. ' : ''}${
                        hidden ? 'Show' : 'Hide'
                    } password.`}
                    type="checkbox"
                />
            </div>
        </>
    )
}

export default FormInputPassword
