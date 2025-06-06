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

    useEffect(() => {
        if (isLoggedIn === true && isNavigationExpanded === undefined) {
            setIsNavigationExpanded(true)
            setItemInSessionStorage('isnavigationexpanded', true)
        }
    }, [isLoggedIn])

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
            <Link
                key={i}
                onKeyDown={(e) => handleKeyDown(e, i)}
                to={`/${getValidHref(i)}`}
                className="underline rounded-md text-normal px-2 py-0.5 focus-visible:bg-stone-100/50 hover:bg-red-300/50 active:bg-red-300"
                data-testid={`navigation-link-${i}`}
                aria-label={formattedRoute}
                title={formattedRoute}
            >
                {formattedRoute}
            </Link>
        )
    })

    return (
        <nav
            className={`flex flex-col gap-1 max-w-7xl bg-red-200 text-stone-950 w-full p-4 transition-[padding] duration-300 ${
                isNavigationExpanded ? 'pt-6' : 'py-2'
            } lg:rounded-b-md`}
            data-testid="navigation-links"
        >
            {isNavigationExpanded ? routes : null}
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
