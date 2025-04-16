import { createContext } from 'react'

export const ContextPasswordVisibility = createContext<
    [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)
