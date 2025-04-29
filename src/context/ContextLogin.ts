import { createContext } from 'react'

export const ContextIsLoggedIn = createContext<
    | [
          boolean | undefined,
          React.Dispatch<React.SetStateAction<boolean | undefined>>
      ]
    | undefined
>(undefined)
