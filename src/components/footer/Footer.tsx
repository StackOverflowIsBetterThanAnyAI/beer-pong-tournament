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
        <footer
            className="flex flex-col gap-y-2 w-full max-w-5xl text-pretty text-center text-small text-zinc-900 dark:text-zinc-100 pb-2 pt-6 px-4 mb-1 mt-auto"
            data-testid="footer"
        >
            <span>
                Copyright &#169; {year} Michael Münzenhofer. All Rights
                Reserved.
            </span>
            <a
                href="https://github.com/StackOverflowIsBetterThanAnyAI/beer-pong-tournament"
                onKeyDown={(e) => handleKeyDown(e)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository (opens in new tab)"
                title="GitHub Repository (opens in new tab)"
                className="w-fit flex items-center gap-1 px-4 py-1 rounded-sm m-auto underline
                hover:bg-stone-400/25 dark:hover:bg-stone-700 active:bg-stone-400/75 dark:active:bg-stone-600"
                data-testid="footer-github-link"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    height={12}
                    fill="currentColor"
                    className="text-zinc-900 dark:text-zinc-100"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                </svg>
                <span>GitHub Repository</span>
            </a>
        </footer>
    )
}

export default Footer
