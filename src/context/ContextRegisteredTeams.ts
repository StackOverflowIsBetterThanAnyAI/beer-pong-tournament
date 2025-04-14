import { createContext } from 'react'
import { RegisteredTeamsProps } from '../types/tpyes'

export const ContextRegisteredTeams = createContext<
    | [
          RegisteredTeamsProps,
          React.Dispatch<React.SetStateAction<RegisteredTeamsProps>>
      ]
    | undefined
>(undefined)
