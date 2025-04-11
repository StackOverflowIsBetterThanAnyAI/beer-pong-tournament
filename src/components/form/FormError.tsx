import { FC } from 'react'

type FormErrorProps = {
    error: string
}

const FormError: FC<FormErrorProps> = ({ error }) => {
    return (
        <>
            {error ? (
                <div className="text-red-800 text-small text-pretty">
                    {error}
                </div>
            ) : undefined}
        </>
    )
}

export default FormError
