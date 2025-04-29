import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate()

    const date = new Date()
    const year = date.getFullYear()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            navigate('/')
        }
    }

    return (
        <footer className="flex flex-col gap-y-2 w-full max-w-5xl text-pretty text-center text-small text-zinc-100 pb-2 pt-4 px-4 mb-1 mt-auto">
            <span>
                Copyright &#169; {year} Michael Münzenhofer. All Rights
                Reserved.
            </span>
            <a
                href="/"
                onKeyDown={(e) => handleKeyDown(e)}
                className="w-fit px-4 py-1 rounded-sm m-auto underline hover:bg-stone-700 active:bg-stone-600"
            >
                GitHub Repository
            </a>
        </footer>
    )
}

export default Footer
