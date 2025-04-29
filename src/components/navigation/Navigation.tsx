import { useContext } from 'react'
import Breadcrumbs from '../breadcrumbs/Breadcrumbs'
import NavigationLinks from './NavigationLinks'
import NavigationLogo from './NavigationLogo'
import { ContextIsLoggedIn } from '../../context/ContextLogin'
import { setLogout } from '../../utils/setLogout'

const Navigation = () => {
    const contextIsLoggedIn = useContext(ContextIsLoggedIn)
    if (!contextIsLoggedIn) {
        throw new Error(
            'Navigation must be used within a ContextIsLoggedIn.Provider'
        )
    }
    const [isLoggedIn, setIsLoggedIn] = contextIsLoggedIn

    const handleLogout = () => {
        setIsLoggedIn(setLogout({ sessionExpired: false }))
    }

    return (
        <>
            <nav className="sticky top-0 z-50 h-16 flex items-center justify-between bg-stone-800 text-zinc-100 w-full shadow-md shadow-stone-600/80 px-2 sm:px-4 py-1 md:py-2">
                <NavigationLogo />
                {isLoggedIn ? (
                    <button
                        className="text-large px-4 py-2 rounded-lg hover:bg-stone-700 active:bg-stone-600"
                        title="Logout"
                        aria-label="Logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : null}
            </nav>
            {isLoggedIn ? <NavigationLinks /> : null}
            <Breadcrumbs />
        </>
    )
}

export default Navigation
