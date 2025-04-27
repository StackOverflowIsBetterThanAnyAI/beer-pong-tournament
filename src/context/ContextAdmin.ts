import { createContext } from 'react'

export const ContextAdmin = createContext<
    [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)
