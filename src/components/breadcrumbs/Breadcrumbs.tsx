import React from 'react'
import { useNavigate } from 'react-router-dom'
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
        <>
            {pathname.length ? (
                <nav
                    aria-label="Breadcrumbs"
                    className="breadcrumbs flex max-w-7xl w-full overflow-x-auto text-nowrap mx-auto items-center p-2"
                >
                    <a
                        aria-label="Back to the Homepage."
                        className="text-small underline decoration-zinc-300/50 text-zinc-300 rounded-sm px-1 py-0.5"
                        href="/"
                        onKeyDown={handleKeyDownHome}
                        title="Home"
                    >
                        Home
                    </a>
                    {pathname.map((item, index) => {
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
                                        className="text-small text-zinc-300 px-1 py-0.5"
                                    >
                                        &gt;
                                    </div>
                                    <a
                                        aria-label={formattedItem}
                                        className="text-small underline decoration-zinc-300/50 text-zinc-300 last:decoration-zinc-100/50 last:text-zinc-100 rounded-sm px-1 py-0.5"
                                        href={route}
                                        onKeyDown={handleKeyDown}
                                        title={formattedItem}
                                    >
                                        {formattedItem}
                                    </a>
                                </React.Fragment>
                            )
                        }
                        return null
                    })}
                </nav>
            ) : null}
        </>
    )
}

export default Breadcrumbs
