import { getValidPathname } from './getValidPathname'
import { getValidRoute } from './getValidRoute'

export const setDocumentTitle = () => {
    const pathname = getValidPathname().length ? getValidPathname() : ['home']

    const validRoute = getValidRoute(pathname)

    return `Beer Pong Tournament | ${validRoute || '404 Not Found'}`
}
