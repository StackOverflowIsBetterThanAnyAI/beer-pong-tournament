type FormHeaderProps = {
    header?: string
    subHeader?: string
}

const FormHeader = ({ header, subHeader }: FormHeaderProps) => {
    const subHeaderElement = (() => {
        switch (subHeader) {
            case 'knockout':
                return (
                    <h2 className="text-center text-pretty text-large px-1">
                        Pairings and Scores for the Knockout Stage:
                    </h2>
                )
            case 'knockout error':
                return (
                    <h2 className="text-center text-pretty text-large px-1">
                        Not all Group Stage Matches have been played yet.
                    </h2>
                )
            case 'no content':
                return (
                    <h2 className="text-center text-pretty text-large px-1">
                        The Tournament has not started yet.
                    </h2>
                )
            case 'no content ko':
                return (
                    <h2 className="text-center text-pretty text-large px-1">
                        The Knockout Stage has not started yet.
                    </h2>
                )
            case 'schedule':
                return (
                    <h2 className="text-center text-pretty text-large px-1">
                        Pairings and Scores:
                    </h2>
                )
            case 'standings':
                return (
                    <h2 className="text-center text-pretty text-large px-1">
                        Who will advance in each group?
                    </h2>
                )
            case 'required':
                return (
                    <h2 className="text-center text-pretty text-large px-1">
                        All fields marked with{' '}
                        <span className="text-red-800">*</span> are required.
                    </h2>
                )
            default:
                return null
        }
    })()

    return (
        <>
            {header ? (
                <h1 className="text-center font-semibold text-extra-large pt-2">
                    {header}
                </h1>
            ) : null}
            {subHeaderElement}
        </>
    )
}

export default FormHeader
