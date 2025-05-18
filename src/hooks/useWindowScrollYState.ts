import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useWindowScrollYState = () => {
    const location = useLocation()
    const path = location.pathname

    useLayoutEffect(() => {
        const stored = sessionStorage.getItem('scrolly')
        if (stored) {
            const parsed = JSON.parse(stored)
            const y = parsed[path]
            if (y) {
                requestAnimationFrame(() => {
                    setTimeout(
                        () =>
                            window.scrollTo({
                                top: y,
                                left: 0,
                                behavior: 'smooth',
                            }),
                        100
                    )
                })
            }
        }
    }, [path])

    useEffect(() => {
        const onScroll = () => {
            const stored = sessionStorage.getItem('scrolly')
            const parsed = stored ? JSON.parse(stored) : {}
            parsed[path] = window.scrollY
            sessionStorage.setItem('scrolly', JSON.stringify(parsed))
        }

        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [path])
}
