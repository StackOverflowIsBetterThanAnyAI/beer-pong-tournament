import { NavLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/constants'
import { getValidHref } from '../../utils/getValidHref'

type NavigationLinksProps = {
    variant: 'desktop' | 'mobile'
    onNavigate?: () => void
}

const formatRoute = (route: string) =>
    route
        .split('-')
        .map(
            (x) => x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase()
        )
        .join(' ')

const NavigationLinks = ({ variant, onNavigate }: NavigationLinksProps) => {
    const navigate = useNavigate()

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLAnchorElement>,
        route: string
    ) => {
        if (e.key === ' ') {
            e.preventDefault()
            navigate(`/${getValidHref(route)}`)
            onNavigate?.()
        }
    }

    const isDesktop = variant === 'desktop'

    return (
        <ul
            className={
                isDesktop
                    ? 'hidden lg:flex items-center gap-1'
                    : 'flex flex-col gap-1'
            }
            aria-label="Main Navigation"
            id={isDesktop ? undefined : 'main-navigation-list'}
            data-testid={`navigation-links-${variant}`}
        >
            {ROUTES.filter((route) => route !== 'home').map((route) => {
                const formattedRoute = formatRoute(route)

                return (
                    <li key={route}>
                        <NavLink
                            to={`/${getValidHref(route)}`}
                            onClick={onNavigate}
                            onKeyDown={(e) => handleKeyDown(e, route)}
                            className={({ isActive }) =>
                                `block whitespace-nowrap rounded-lg text-normal no-underline transition-[background-color,color] duration-200
                                focus-visible:outline-2 focus-visible:outline-red-400 ${
                                    isDesktop ? 'px-3 py-2' : 'px-4 py-3'
                                } ${
                                    isActive
                                        ? 'bg-red-200 text-stone-950 font-semibold dark:bg-red-300'
                                        : 'hover:bg-stone-300 dark:hover:bg-stone-700 active:bg-stone-400/65 dark:active:bg-stone-600'
                                }`
                            }
                            data-testid={`navigation-link-${route}`}
                            aria-label={`Go to ${formattedRoute}`}
                            title={formattedRoute}
                        >
                            {formattedRoute}
                        </NavLink>
                    </li>
                )
            })}
        </ul>
    )
}

export default NavigationLinks
