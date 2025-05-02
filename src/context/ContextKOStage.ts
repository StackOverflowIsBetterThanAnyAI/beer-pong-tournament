import { createContext } from 'react'
import { KOStageProps } from '../types/types'

export const ContextKOStage = createContext<
    | [KOStageProps, React.Dispatch<React.SetStateAction<KOStageProps>>]
    | undefined
>(undefined)
