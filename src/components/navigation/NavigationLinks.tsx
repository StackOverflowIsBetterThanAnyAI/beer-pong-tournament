import { useState } from 'react'
import { ROUTES } from '../../constants/constants'
import { getValidHref } from '../../utils/getValidHref'

const NavigationLinks = () => {
    const [isNavigationExpanded, setIsNavigationExpanded] =
        useState<boolean>(true)

    const handleClick = () => {
        setIsNavigationExpanded((prev) => !prev)
    }

    return (
        <nav className="flex flex-col gap-1 bg-red-200 text-stone-950 w-full p-4">
            {isNavigationExpanded
                ? ROUTES.filter((item: string) => item !== 'home').map((i) => {
                      return (
                          <a
                              key={i}
                              href={getValidHref(i)}
                              className="underline rounded-md px-2 py-0.5 focus-visible:bg-stone-100/50 hover:bg-red-300/50 active:bg-red-300"
                          >
                              {i
                                  .split(' ')
                                  .map(
                                      (x) =>
                                          x.substring(0, 1).toUpperCase() +
                                          x.substring(1)
                                  )
                                  .join(' ')}
                          </a>
                      )
                  })
                : null}
            <button
                onClick={handleClick}
                className="bg-stone-100/90 outline outline-red-400 rounded-md mt-2 focus-visible:bg-stone-50 hover:bg-red-100 active:bg-red-200"
            >
                {isNavigationExpanded ? 'Close' : 'Open'} Navigation
            </button>
        </nav>
    )
}

export default NavigationLinks
