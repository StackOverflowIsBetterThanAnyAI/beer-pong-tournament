import { createContext } from 'react'
import { LoggedInUserProps } from '../types/tpyes'

export const ContextIsLoggedIn = createContext<
    | [
          boolean | undefined,
          React.Dispatch<React.SetStateAction<boolean | undefined>>
      ]
    | undefined
>(undefined)

export const ContextLoggedInUser = createContext<
    | [
          LoggedInUserProps | undefined,
          React.Dispatch<React.SetStateAction<LoggedInUserProps | undefined>>
      ]
    | undefined
>(undefined)
