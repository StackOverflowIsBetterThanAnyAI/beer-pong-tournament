import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAutoFocus } from '../hooks/useAutoFocus'

const FourOhFour = () => {
    const navigate = useNavigate()

    const anchorRef = useRef<HTMLAnchorElement>(null)

    useAutoFocus(anchorRef)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            navigate('/')
        }
    }

    return (
        <main className="flex justify-center w-full relative isolate text-center bg-stone-300 text-stone-950 sm:rounded-lg px-8 py-6 sm:p-10">
            <div className="flex flex-col justify-center gap-1 w-96">
                <h1 className="text-extra-large font-bold">Oops!</h1>
                <h2 className="text-large">
                    It looks like this site does not exist ...
                </h2>
                <a
                    href="/"
                    onKeyDown={(e) => handleKeyDown(e)}
                    className="mt-2 px-4 py-2 rounded-lg bg-stone-400 hover:bg-stone-500/60 active:bg-stone-500"
                    aria-label="Back to the Homepage."
                    ref={anchorRef}
                >
                    Homepage
                </a>
            </div>
        </main>
    )
}

export default FourOhFour
