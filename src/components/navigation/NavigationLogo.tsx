import { useNavigate } from 'react-router-dom'
import logo from './../../assets/logo.webp'

const NavigationLogo = () => {
    const navigate = useNavigate()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            navigate('/')
        }
    }

    return (
        <a
            href="/"
            onKeyDown={(e) => handleKeyDown(e)}
            className="flex items-center gap-2 no-underline rounded-lg p-1 pr-2 hover:bg-stone-700 active:bg-stone-600"
            title="Back to the Homepage"
        >
            <img
                src={logo}
                width="48px"
                height="48px"
                alt="Back to the Homepage"
                className="rounded-lg"
                loading="lazy"
            />
            <span className="max-[280px]:hidden text-large">
                Beer Pong Tournament
            </span>
        </a>
    )
}

export default NavigationLogo
