import { FC, HTMLInputAutoCompleteAttribute } from 'react'

type FormInputProps = {
    autoComplete: HTMLInputAutoCompleteAttribute
    error: string | boolean
    id: string
    label: string
    maxLength: number
    minLength: number
    onInput: (e: React.ChangeEvent<HTMLInputElement>) => void
    onPaste?: React.ClipboardEventHandler<HTMLInputElement>
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    placeholder: string
    ref?: React.RefObject<HTMLInputElement | null>
    title: string
    type: string
    value: string
}

const FormInput: FC<FormInputProps> = ({
    autoComplete,
    error,
    id,
    label,
    maxLength,
    minLength,
    onInput,
    onPaste,
    onKeyDown,
    placeholder,
    ref,
    title,
    type,
    value,
}) => {
    const marginBottom = error ? 'mb-1' : 'mb-5 md:mb-6'

    return (
        <>
            <label htmlFor={id} className="text-large py-2 md:py-1">
                {label} {<span className="text-red-800">*</span>}
            </label>
            <input
                id={id}
                className={`bg-stone-100 outline outline-stone-500 text-normal w-full ${marginBottom} rounded px-2 py-1
                enabled:hover:bg-stone-200`}
                aria-label={title}
                aria-required={true}
                autoComplete={autoComplete}
                max={type === 'number' ? maxLength : undefined}
                maxLength={type !== 'number' ? maxLength : undefined}
                min={type === 'number' ? minLength : undefined}
                minLength={type !== 'number' ? minLength : undefined}
                name={label.replace(/\s/g, '').toLowerCase()}
                onInput={onInput}
                onPaste={onPaste}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                ref={ref}
                required={true}
                title={title}
                type={type}
                value={value}
            />
        </>
    )
}

export default FormInput
