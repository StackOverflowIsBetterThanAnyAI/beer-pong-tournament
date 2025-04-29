import { useNavigate } from 'react-router-dom'

const FourOhFour = () => {
    const navigate = useNavigate()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            navigate('/')
        }
    }

    return (
        <div className="w-full flex flex-col gap-1 text-center bg-stone-300 text-stone-950 sm:w-80 md:w-112 sm:rounded-lg px-8 py-6 sm:p-10">
            <h1 className="text-extra-large font-bold">Oops!</h1>
            <h2 className="text-large">
                It looks like this site does not exist ...
            </h2>
            <a
                href="/"
                onKeyDown={(e) => handleKeyDown(e)}
                className="mt-2 px-4 py-2 rounded-lg bg-stone-400 hover:bg-stone-500/60 active:bg-stone-500"
                aria-label="Back to the Homepage."
            >
                Homepage
            </a>
        </div>
    )
}

export default FourOhFour
