import { useEffect } from 'react'
import { Location, NavigateFunction } from 'react-router-dom'
import { ToastProps } from '../types/types'

type useSessionExpiredProps = {
    location: Location<unknown>
    navigate: NavigateFunction
    showToast: (toast: ToastProps) => void
}

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
    }, [])
}
