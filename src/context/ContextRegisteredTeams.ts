import { createContext } from 'react'
import { RegisteredTeamsProps } from '../types/types'

export const ContextRegisteredTeams = createContext<
    | [
          RegisteredTeamsProps,
          React.Dispatch<React.SetStateAction<RegisteredTeamsProps>>
      ]
    | undefined
>(undefined)
