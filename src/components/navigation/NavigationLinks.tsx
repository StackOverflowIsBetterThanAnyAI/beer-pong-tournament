import { useContext, useEffect, useState } from 'react'
import { ROUTES } from '../../constants/constants'
import { ContextIsLoggedIn } from '../../context/ContextLogin'
import { getStoredData } from '../../utils/getStoredData'
import { getValidHref } from '../../utils/getValidHref'
import { setItemInStorage } from '../../utils/setItemInStorage'
import { useNavigate } from 'react-router-dom'

const NavigationLinks = () => {
    const parsedStorageData = getStoredData()

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
    >(parsedStorageData?.isnavigationexpanded ?? undefined)

    useEffect(() => {
        if (isLoggedIn === true && isNavigationExpanded === undefined) {
            setIsNavigationExpanded(true)
            setItemInStorage('isnavigationexpanded', true)
        }
    }, [isLoggedIn])

    const handleClick = () => {
        const navigationExpanded = !isNavigationExpanded
        setIsNavigationExpanded(navigationExpanded)
        setItemInStorage('isnavigationexpanded', navigationExpanded)
    }

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLAnchorElement>,
        i: string
    ) => {
        if (e.key === ' ' || e.key === 'Enter') {
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
            <a
                key={i}
                onKeyDown={(e) => handleKeyDown(e, i)}
                href={`/${getValidHref(i)}`}
                className="underline rounded-md text-normal px-2 py-0.5 focus-visible:bg-stone-100/50 hover:bg-red-300/50 active:bg-red-300"
                aria-label={formattedRoute}
                title={formattedRoute}
            >
                {formattedRoute}
            </a>
        )
    })

    return (
        <nav
            className={`flex flex-col gap-1 bg-red-200 text-stone-950 w-full p-4 transition-[padding] duration-300 ${
                isNavigationExpanded ? 'pt-6' : 'py-2'
            }`}
        >
            {isNavigationExpanded ? routes : null}
            <button
                onClick={handleClick}
                className={`bg-stone-100 outline outline-red-400/90 text-normal rounded-md p-0.5 focus-visible:bg-stone-50 hover:bg-red-100 active:bg-red-200
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
