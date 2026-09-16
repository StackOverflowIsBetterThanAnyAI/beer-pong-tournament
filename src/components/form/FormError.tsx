import { FormErrorProps } from '../../types/types'

const FormError = ({ error }: FormErrorProps) => {
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
