import { useContext } from 'react'
import logo from './../../assets/logo.png'
import Breadcrumbs from '../breadcrumbs/Breadcrumbs'
import { ContextIsLoggedIn } from '../../context/ContextLogin'
import { setLogout } from '../../utils/setLogout'

const Navigation = () => {
    const contextIsLoggedIn = useContext(ContextIsLoggedIn)
    if (!contextIsLoggedIn) {
        throw new Error('Form must be used within a ContextIsLoggedIn.Provider')
    }
    const [isLoggedIn, setIsLoggedIn] = contextIsLoggedIn

    const handleLogout = () => {
        setIsLoggedIn(setLogout())
    }

    return (
        <>
            <nav className="sticky top-0 z-50 h-16 flex items-center justify-between bg-stone-800 text-zinc-100 w-full shadow-md shadow-stone-600/80 px-2 sm:px-4 py-1 md:py-2">
                <a
                    href="/"
                    className="flex items-center gap-2 no-underline rounded-lg p-1 pr-2 hover:bg-stone-700 active:bg-stone-600"
                    title="Back to the Homepage"
                >
                    <img
                        src={logo}
                        width="48px"
                        height="48px"
                        alt="Back to the Homepage"
                        className="rounded-lg"
                    />
                    <span className="max-[280px]:hidden">
                        Beer Pong Tournament
                    </span>
                </a>
                {isLoggedIn ? (
                    <button
                        className="px-4 py-2 rounded-lg hover:bg-stone-700 active:bg-stone-600"
                        title="Logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : null}
            </nav>
            <Breadcrumbs />
        </>
    )
}

export default Navigation
