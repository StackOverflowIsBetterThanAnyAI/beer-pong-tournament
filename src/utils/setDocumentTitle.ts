import { ROUTES } from './../constants/constants'
import { getValidPathname } from './getValidPathname'

export const setDocumentTitle = () => {
    const pathname = getValidPathname().length ? getValidPathname() : ['home']

    return `Beer Pong Tournament | ${
        ROUTES.includes(pathname.join('/'))
            ? pathname.map((item) => {
                  return item
                      .split('-')
                      .map((i) => {
                          return (
                              i.substring(0, 1).toUpperCase() +
                              i.substring(1).toLowerCase()
                          )
                      })
                      .join(' ')
              })
            : '404 Not Found'
    }`
}
