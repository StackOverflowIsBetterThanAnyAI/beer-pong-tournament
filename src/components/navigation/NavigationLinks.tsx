import { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '../../constants/constants'
import { ContextIsLoggedIn } from '../../context/ContextLogin'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { getValidHref } from '../../utils/getValidHref'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'

const NavigationLinks = () => {
    const parsedSessionData = getStoredSessionData()

    const navigate = useNavigate()

    const contextIsLoggedIn = useContext(ContextIsLoggedIn)
    if (!contextIsLoggedIn) {
        throw new Error(
            'NavigationLinks must be used within a ContextIsLoggedIn.Provider'
        )
    }
    const [isLoggedIn, _setIsLoggedIn] = contextIsLoggedIn

    const [isNavigationExpanded, setIsNavigationExpanded] = useState<
        boolean | undefined
    >(parsedSessionData?.isnavigationexpanded ?? undefined)

    const [isNavigationLinksHidden, setIsNavigationLinksHidden] = useState<
        boolean | undefined
    >(false)

    useEffect(() => {
        if (isLoggedIn === true && isNavigationExpanded === undefined) {
            setIsNavigationExpanded(true)
            setItemInSessionStorage('isnavigationexpanded', true)
        }
    }, [isLoggedIn])

    useEffect(() => {
        if (isNavigationExpanded) {
            setIsNavigationLinksHidden(false)
        } else {
            const timeout = setTimeout(() => {
                setIsNavigationLinksHidden(true)
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [isNavigationExpanded])

    const handleClick = () => {
        const navigationExpanded = !isNavigationExpanded
        setIsNavigationExpanded(navigationExpanded)
        setItemInSessionStorage('isnavigationexpanded', navigationExpanded)
    }

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLAnchorElement>,
        i: string
    ) => {
        if (e.key === ' ') {
            e.preventDefault()
            navigate(i)
        }
    }

    const routes = ROUTES.filter((item: string) => item !== 'home').map((i) => {
        const formattedRoute = i
            .split('-')
            .map(
                (x) =>
                    x.substring(0, 1).toUpperCase() +
                    x.substring(1).toLowerCase()
            )
            .join(' ')

        return (
            <li
                key={i}
                className={`
                transition-all duration-300 ${
                    isNavigationExpanded ? 'max-h-8' : 'max-h-0'
                }`}
            >
                <Link
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    to={`/${getValidHref(i)}`}
                    className={`underline text-normal block w-full transition-[padding] duration-300 px-2 rounded-md hover:bg-red-300/50 active:bg-red-300
                    focus-visible:bg-stone-100/50 focus-visible:outline-2 focus-visible:outline-red-400 ${
                        isNavigationExpanded ? 'py-0.5' : 'py-0'
                    }`}
                    data-testid={`navigation-link-${i}`}
                    aria-label={`Go to ${formattedRoute}`}
                    title={formattedRoute}
                >
                    {formattedRoute}
                </Link>
            </li>
        )
    })

    return (
        <nav
            className={`flex flex-col w-full max-w-7xl bg-red-200 text-stone-950 p-4 transition-[all] duration-300 ${
                isNavigationExpanded ? 'pt-6 gap-1' : 'py-2 gap-0'
            } lg:rounded-b-md`}
            data-testid="navigation-links"
        >
            {!isNavigationLinksHidden ? (
                <ul
                    className={`flex flex-col gap-1 transition-all duration-300 ${
                        isNavigationExpanded
                            ? 'opacity-100 max-h-80'
                            : 'opacity-0 max-h-0'
                    }`}
                    aria-label="Main Navigation"
                >
                    {routes}
                </ul>
            ) : null}
            <button
                onClick={handleClick}
                className={`animate-stone-50-red-200 max-w-96 w-full relative isolate bg-stone-50 outline outline-red-400/90 text-normal rounded-md m-auto px-2 py-0.5 lg:py-1 active:bg-red-200
                transition-[margin] duration-300 ${
                    isNavigationExpanded ? 'mt-2' : 'mt-0'
                }`}
                aria-label={`${
                    isNavigationExpanded ? 'Close' : 'Open'
                } Navigation Menu`}
                title={`${
                    isNavigationExpanded ? 'Close' : 'Open'
                } Navigation Menu`}
            >
                {isNavigationExpanded ? 'Close' : 'Open'} Navigation
            </button>
        </nav>
    )
}

export default NavigationLinks
