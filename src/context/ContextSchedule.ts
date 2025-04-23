import { createContext } from 'react'
import { ScheduleProps } from '../types/types'

export const ContextSchedule = createContext<
    | [ScheduleProps, React.Dispatch<React.SetStateAction<ScheduleProps>>]
    | undefined
>(undefined)
