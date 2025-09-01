import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '../../constants/constants'
import { getValidHref } from '../../utils/getValidHref'
import { getValidPathname } from '../../utils/getValidPathname'

const Breadcrumbs = () => {
    const pathname = getValidPathname()

    const navigate = useNavigate()

    const handleKeyDownHome = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (e.key === ' ') {
            navigate('/')
        }
    }

    return (
        <nav
            aria-label="Breadcrumbs"
            className="breadcrumbs flex max-w-7xl w-full overflow-x-auto text-nowrap mx-auto items-center p-2 lg:p-2.5"
            data-testid="breadcrumbs"
        >
            <Link
                aria-label="Back to the Homepage."
                className="text-small underline rounded-sm px-1 py-0.5
                decoration-zinc-600/50 dark:decoration-zinc-300/50 text-zinc-600 dark:text-zinc-300 last:decoration-zinc-900/50 dark:last:decoration-zinc-100/50 last:text-zinc-900 dark:last:text-zinc-100"
                to="/"
                onKeyDown={handleKeyDownHome}
                title="Home"
                data-testid="breadcrumbs-home"
            >
                Home
            </Link>
            {pathname?.map((item, index) => {
                let route = ''
                for (let i = 0; i <= index; i++) {
                    route += `/${pathname[i]}`
                }
                const formattedItem = item
                    .split('-')
                    .map((i) => {
                        return (
                            i.substring(0, 1).toUpperCase() +
                            i.substring(1).toLowerCase()
                        )
                    })
                    .join(' ')

                if (
                    ROUTES.map((item) => getValidHref(item)).includes(
                        route.replace(/^\//, '')
                    )
                ) {
                    const handleKeyDown = (
                        e: React.KeyboardEvent<HTMLAnchorElement>
                    ) => {
                        if (e.key === ' ') {
                            e.preventDefault()
                            window.location.href = route
                        }
                    }

                    return (
                        <React.Fragment key={item}>
                            <div
                                aria-hidden="true"
                                className="text-small text-zinc-600 dark:text-zinc-300 px-1 py-0.5"
                            >
                                &gt;
                            </div>
                            <Link
                                aria-label={formattedItem}
                                className="text-small underline decoration-zinc-900/50 dark:decoration-zinc-100/50 text-zinc-900 dark:text-zinc-100 rounded-sm px-1 py-0.5"
                                to={route}
                                onKeyDown={handleKeyDown}
                                title={formattedItem}
                            >
                                {formattedItem}
                            </Link>
                        </React.Fragment>
                    )
                }
                return null
            })}
        </nav>
    )
}

export default Breadcrumbs
