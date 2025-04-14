import { FC } from 'react'

type TeamsErrorProps = {
    error: string
}

const TeamsError: FC<TeamsErrorProps> = ({ error }) => {
    return (
        <>
            {error ? (
                <div className="text-red-800 text-center text-normal text-pretty py-2">
                    {error}
                </div>
            ) : undefined}
        </>
    )
}

export default TeamsError
