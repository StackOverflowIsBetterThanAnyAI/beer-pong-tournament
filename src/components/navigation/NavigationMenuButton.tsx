type NavigationMenuButtonProps = {
    isMenuOpen: boolean
    onClick: () => void
    ref: React.Ref<HTMLButtonElement>
}

const NavigationMenuButton = ({
    isMenuOpen,
    onClick,
    ref,
}: NavigationMenuButtonProps) => {
    const label = `${isMenuOpen ? 'Close' : 'Open'} Navigation Menu`

    return (
        <button
            ref={ref}
            onClick={onClick}
            className="lg:hidden flex flex-col justify-center items-center gap-1.5 w-12 h-12 rounded-xl border-2 border-stone-400 dark:border-stone-500 focus-visible:border-transparent
            hover:bg-stone-300 dark:hover:bg-stone-700 active:bg-stone-400/65 dark:active:bg-stone-600"
            aria-label={label}
            title={label}
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation-list"
            data-testid="navigation-menu-button"
        >
            <span
                className={`block h-0.5 w-6 rounded-full bg-current transition-transform duration-300 ${
                    isMenuOpen ? 'translate-y-2 rotate-45' : ''
                }`}
            />
            <span
                className={`block h-0.5 w-6 rounded-full bg-current transition-opacity duration-300 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
            />
            <span
                className={`block h-0.5 w-6 rounded-full bg-current transition-transform duration-300 ${
                    isMenuOpen ? '-translate-y-2 -rotate-45' : ''
                }`}
            />
        </button>
    )
}

export default NavigationMenuButton
