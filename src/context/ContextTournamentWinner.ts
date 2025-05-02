import { createContext } from 'react'

export const ContextTournamentWinner = createContext<
    [string, React.Dispatch<React.SetStateAction<string>>] | undefined
>(undefined)
