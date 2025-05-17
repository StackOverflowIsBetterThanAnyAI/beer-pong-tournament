type FormHeaderProps = {
    header?: string
    subHeader?: string
}

const FormHeader = ({ header, subHeader }: FormHeaderProps) => {
    const subHeaderElement = (() => {
        switch (subHeader) {
            case 'knockout':
                return 'Pairings and Scores for the Knockout Stage:'
            case 'knockout error':
                return 'Not all Group Stage Matches have been played yet.'
            case 'tournament over':
                return 'This tournament is already over.'
            case 'no content':
                return 'The Tournament has not started yet.'
            case 'no content main':
                return 'The next tournament is just around the corner!'
            case 'no content teams':
                return 'Currently, no Teams have registered yet.'
            case 'no content ko':
                return 'The Knockout Stage has not started yet.'
            case 'schedule':
                return 'Pairings and Scores:'
            case 'standings':
                return 'Who will advance in each group?'
            case 'teams':
                return 'Currently registered Teams:'
            case 'required':
                return (
                    <span>
                        All fields marked with{' '}
                        <span className="text-red-800">*</span> are required.
                    </span>
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
            {subHeader ? (
                <h2 className="text-center text-pretty text-large px-1 lg:py-1">
                    {subHeaderElement}
                </h2>
            ) : null}
        </>
    )
}

export default FormHeader
