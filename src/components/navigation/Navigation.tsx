import { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Breadcrumbs from '../breadcrumbs/Breadcrumbs'
import NavigationLinks from './NavigationLinks'
import NavigationLogo from './NavigationLogo'
import NavigationMenuButton from './NavigationMenuButton'
import ThemeSwitch from '../themeSwitch/ThemeSwitch'
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

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [navOpacity, setNavOpacity] = useState<string>('opacity-100')
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const navRef = useRef<HTMLElement | null>(null)
    const menuButtonRef = useRef<HTMLButtonElement | null>(null)
    const { pathname } = useLocation()

    const handleLogout = () => {
        setIsMenuOpen(false)
        setIsLoggedIn(setLogout({ isSessionExpired: false }))
    }

    useNavigationOpacity({ setNavOpacity, timerRef })

    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    useEffect(() => {
        if (!isMenuOpen) {
            return
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMenuOpen(false)
                menuButtonRef.current?.focus()
            }
        }
        const handlePointerDown = (e: PointerEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false)
            }
        }
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsMenuOpen(false)
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('resize', handleResize)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('resize', handleResize)
        }
    }, [isMenuOpen])

    return (
        <>
            <nav
                ref={navRef}
                className={`sticky top-0 z-50 w-full
                bg-stone-200 dark:bg-stone-800 text-zinc-900 dark:text-zinc-100 shadow-md shadow-stone-400/80 dark:shadow-stone-600/80
                transition-opacity duration-1000 ease-in-out ${
                    isMenuOpen ? 'opacity-100' : navOpacity
                }`}
                data-testid="navigation"
            >
                <div className="max-w-7xl flex items-center justify-between gap-2 m-auto h-16 px-2 sm:px-4 py-1 md:py-2">
                    <NavigationLogo />
                    {isLoggedIn ? <NavigationLinks variant="desktop" /> : null}
                    <div className="flex justify-center items-center gap-2 md:gap-4">
                        <ThemeSwitch />
                        {isLoggedIn ? (
                            <>
                                <button
                                    className="hidden sm:block text-large px-4 py-2 rounded-xl border-2 border-stone-400 dark:border-stone-500 focus-visible:border-transparent
                                    hover:bg-stone-300 dark:hover:bg-stone-700 active:bg-stone-400/65 dark:active:bg-stone-600"
                                    data-testid="logout"
                                    title="Logout"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                                <NavigationMenuButton
                                    ref={menuButtonRef}
                                    isMenuOpen={isMenuOpen}
                                    onClick={() =>
                                        setIsMenuOpen((prev) => !prev)
                                    }
                                />
                            </>
                        ) : null}
                    </div>
                </div>
                {isLoggedIn ? (
                    <div
                        className={`lg:hidden absolute left-0 right-0 top-full grid transition-[grid-template-rows,opacity] duration-300 ease-in-out
                        bg-stone-200 dark:bg-stone-800 shadow-md shadow-stone-400/80 dark:shadow-stone-600/80 ${
                            isMenuOpen
                                ? 'grid-rows-[1fr] opacity-100'
                                : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                        }`}
                        inert={!isMenuOpen}
                        data-testid="navigation-menu"
                    >
                        <div className="overflow-hidden">
                            <div className="max-w-7xl m-auto px-2 sm:px-4 py-3 border-t border-stone-300 dark:border-stone-700">
                                <NavigationLinks
                                    variant="mobile"
                                    onNavigate={() => setIsMenuOpen(false)}
                                />
                                <button
                                    className="sm:hidden w-full mt-3 text-large px-4 py-2 rounded-xl border-2 border-stone-400 dark:border-stone-500 focus-visible:border-transparent
                                    hover:bg-stone-300 dark:hover:bg-stone-700 active:bg-stone-400/65 dark:active:bg-stone-600"
                                    data-testid="logout-mobile"
                                    title="Logout"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </nav>
            <Breadcrumbs />
        </>
    )
}

export default Navigation
