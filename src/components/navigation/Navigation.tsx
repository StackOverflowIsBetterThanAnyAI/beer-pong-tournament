import { useContext, useRef, useState } from 'react'
import Breadcrumbs from '../breadcrumbs/Breadcrumbs'
import NavigationLinks from './NavigationLinks'
import NavigationLogo from './NavigationLogo'
import { ContextIsLoggedIn } from '../../context/ContextLogin'
import { setLogout } from '../../utils/setLogout'
import { useNavigationOpacity } from '../../hooks/useNavigationOpacity'

const Navigation = () => {
    const contextIsLoggedIn = useContext(ContextIsLoggedIn)
    if (!contextIsLoggedIn) {
        throw new Error(
            'Navigation must be used within a ContextIsLoggedIn.Provider'
        )
    }
    const [isLoggedIn, setIsLoggedIn] = contextIsLoggedIn

    const [navOpacity, setNavOpacity] = useState<string>('opacity-100')
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleLogout = () => {
        setIsLoggedIn(setLogout({ isSessionExpired: false }))
    }

    useNavigationOpacity({ setNavOpacity, timerRef })

    return (
        <>
            <nav
                className={`sticky top-0 z-50 bg-stone-800 text-zinc-100 w-full shadow-md shadow-stone-600/80
                transition-opacity duration-1000 ease-in-out ${navOpacity}`}
                data-testid="navigation"
            >
                <div className="max-w-7xl flex items-center justify-between m-auto h-16 px-2 sm:px-4 py-1 md:py-2">
                    <NavigationLogo />
                    {isLoggedIn ? (
                        <button
                            className="text-large px-4 py-2 rounded-lg hover:bg-stone-700 active:bg-stone-600"
                            data-testid="logout"
                            title="Logout"
                            aria-label="Logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    ) : null}
                </div>
            </nav>
            {isLoggedIn ? <NavigationLinks /> : null}
            <Breadcrumbs />
        </>
    )
}

export default Navigation
