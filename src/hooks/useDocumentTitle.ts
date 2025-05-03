import { useEffect } from 'react'
import { setDocumentTitle } from '../utils/setDocumentTitle'

export const useDocumentTitle = () => {
    useEffect(() => {
        document.title = setDocumentTitle()
    }, [location.pathname])
}
