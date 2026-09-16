import { useEffect } from 'react'
import { useSessionExpiredProps } from '../types/types'

export const useSessionExpired = ({
    location,
    navigate,
    showToast,
}: useSessionExpiredProps) => {
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        if (searchParams.get('session')) {
            showToast({
                isSuccess: false,
                label: 'Session has expired!',
            })
            searchParams.delete('session')
            navigate(
                {
                    pathname: location.pathname,
                    search: searchParams.toString(),
                },
                { replace: true }
            )
        }
    }, [location.pathname, location.search, navigate, showToast])
}
