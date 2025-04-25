type TeamsErrorProps = {
    error: string
}

const TeamsError = ({ error }: TeamsErrorProps) => {
    return (
        <>
            {error ? (
                <div className="text-red-800 text-center text-small text-pretty py-2 transition-opacity duration-1000">
                    {error}
                </div>
            ) : undefined}
        </>
    )
}

export default TeamsError
