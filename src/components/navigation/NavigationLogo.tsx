import { useNavigate, Link } from 'react-router-dom'
import logo from './../../assets/logo.webp'
import logo_mobile from './../../assets/logo_mobile.webp'

const NavigationLogo = () => {
    const navigate = useNavigate()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (e.key === ' ') {
            e.preventDefault()
            navigate('/')
        }
    }

    return (
        <Link
            to="/"
            onKeyDown={(e) => handleKeyDown(e)}
            className="logohomepage flex items-center gap-2 no-underline rounded-lg p-1 pr-2
            hover:bg-stone-300 dark:hover:bg-stone-700 active:bg-stone-400/65 dark:active:bg-stone-600"
            title="Back to the Homepage"
        >
            <img
                src={logo}
                srcSet={`${logo_mobile} 2x`}
                width="48px"
                height="48px"
                alt="Back to the Homepage"
                className="rounded-lg"
                loading="lazy"
            />
            <span className="max-[280px]:hidden text-large">
                Beer Pong Tournament
            </span>
        </Link>
    )
}

export default NavigationLogo
