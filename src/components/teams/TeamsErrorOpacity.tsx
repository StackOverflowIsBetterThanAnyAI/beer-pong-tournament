import { useEffect, useState } from 'react'

type TeamsErrorProps = {
    error: string
}

const TeamsErrorOpacity = ({ error }: TeamsErrorProps) => {
    const [opacity, setOpacity] = useState<string>('opacity-100')

    useEffect(() => {
        setTimeout(() => setOpacity('opacity-0'), 3000)
    }, [])

    return (
        <>
            {error ? (
                <div
                    className={`text-red-800 text-center text-small text-pretty py-2 transition-opacity duration-1000 ${opacity}`}
                >
                    {error}
                </div>
            ) : undefined}
        </>
    )
}

export default TeamsErrorOpacity
