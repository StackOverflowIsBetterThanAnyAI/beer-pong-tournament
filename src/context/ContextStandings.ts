import { createContext } from 'react'
import { StandingsProps } from '../types/types'

export const ContextStandings = createContext<
    | [StandingsProps, React.Dispatch<React.SetStateAction<StandingsProps>>]
    | undefined
>(undefined)
