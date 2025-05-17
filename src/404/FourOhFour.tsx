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
        <main className="flex justify-center w-full max-w-7xl relative isolate text-center bg-stone-300 text-stone-950 sm:rounded-lg px-8 py-6 sm:p-10">
            <div className="flex flex-col justify-center gap-1 w-96">
                <h1 className="text-extra-large font-bold">Oops!</h1>
                <h2 className="text-large">
                    It looks like this site does not exist ...
                </h2>
                <a
                    href="/"
                    onKeyDown={(e) => handleKeyDown(e)}
                    className="relative mt-2 px-4 py-2 lg:py-2.5 rounded-lg bg-stone-100/90 outline outline-stone-500 active:bg-stone-300 animate-stone-50-stone-300"
                    aria-label="Back to the Homepage."
                    title="Back to the Homepage."
                    ref={anchorRef}
                >
                    Homepage
                </a>
            </div>
        </main>
    )
}

export default FourOhFour
