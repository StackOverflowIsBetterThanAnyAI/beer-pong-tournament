import { useEffect } from 'react'

type useNavigationOpacityProps = {
    setNavOpacity: React.Dispatch<React.SetStateAction<string>>
    timerRef: React.RefObject<ReturnType<typeof setTimeout> | null>
}

export const useNavigationOpacity = ({
    setNavOpacity,
    timerRef,
}: useNavigationOpacityProps) => {
    useEffect(() => {
        let lastScrollY = window.scrollY

        const handleScroll = () => {
            if (window.scrollY === 0 || window.scrollY > lastScrollY) {
                setNavOpacity('opacity-100')
            } else if (window.scrollY < lastScrollY) {
                setNavOpacity('opacity-80')
            }

            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }

            if (window.scrollY < lastScrollY) {
                timerRef.current = setTimeout(() => {
                    setNavOpacity('opacity-100')
                }, 500)
            }

            lastScrollY = window.scrollY
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [setNavOpacity, timerRef])
}
