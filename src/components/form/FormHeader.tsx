type FormHeaderProps = {
    header: string
    subHeader?: string
}

const FormHeader = ({ header, subHeader }: FormHeaderProps) => {
    const subHeaderElement = (() => {
        switch (subHeader) {
            case 'required':
                return (
                    <h2 className="text-center text-large px-1">
                        All fields marked with{' '}
                        <span className="text-red-800">*</span> are required.
                    </h2>
                )
            case 'schedule':
                return (
                    <h2 className="text-center text-large px-1">
                        The Tournament has not started yet.
                    </h2>
                )
            default:
                return null
        }
    })()

    return (
        <>
            <h1 className="text-center font-semibold text-extra-large">
                {header}
            </h1>
            {subHeaderElement}
        </>
    )
}

export default FormHeader
