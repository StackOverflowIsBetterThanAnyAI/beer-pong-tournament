import { createContext } from 'react'
import { TournamentGroupsProps } from '../types/tpyes'

export const ContextGroups = createContext<
    | [
          TournamentGroupsProps,
          React.Dispatch<React.SetStateAction<TournamentGroupsProps>>
      ]
    | undefined
>(undefined)
