import { createContext } from 'react'

export const ContextIsToastVisible = createContext<
    [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)
