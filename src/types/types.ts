import { HTMLInputAutoCompleteAttribute } from 'react'
import { Location, NavigateFunction } from 'react-router-dom'

export type ContextToastType = {
    showToast: (toast: ToastProps) => void
}

export type FormErrorProps = {
    error: string
}

export type FormHeaderProps = {
    header?: string
    subHeader?: string
}

export type FormInputProps = {
    autoComplete: HTMLInputAutoCompleteAttribute
    error: string | boolean
    id: string
    label: string
    maxLength: number
    minLength: number
    onInput: (e: React.ChangeEvent<HTMLInputElement>) => void
    onPaste?: React.ClipboardEventHandler<HTMLInputElement>
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    placeholder: string
    ref?: React.RefObject<HTMLInputElement | null>
    testID?: string
    title: string
    type: string
    value: string
}

export type FormInputPasswordProps = {
    autoComplete: HTMLInputAutoCompleteAttribute
    error: string | boolean
    id: string
    isDisabled?: boolean
    isHidden?: boolean
    label: string
    maxLength: number
    minLength: number
    onInput: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    testID?: string
    title: string
    value: string
}

export type FormSubmitProps = {
    handleClick: (e: React.MouseEvent<HTMLInputElement>) => void
    isDisabled: boolean
    isLoading: boolean
    testID?: string
    value: string
}

export type FormSwitchProps = {
    isSigningUp: boolean
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export type GroupsProps = {
    groups: TournamentGroupsProps
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
}

export type RegisteredTeamProps = {
    id: number
    name: string
    member_one: string
    member_two: string
}

export type RegisteredTeamsProps = RegisteredTeamProps[]

export type GameProps = {
    id: number
    group: string
    team1: string
    team2: string
    score_team1: number | null
    score_team2: number | null
    played: boolean
}

export type KOMatchProps = {
    id: number
    played: boolean
    round: 'R16' | 'QF' | 'SF' | 'F'
    round_display: string
    score_team1: number | null
    score_team2: number | null
    team1: number
    team1_name: string
    team2: number
    team2_name: string
}

export type KOStageProps = KOMatchProps[]

export type KnockoutMatchProps = {
    koStage: KOStageProps
    page: number
    setKOStage: React.Dispatch<React.SetStateAction<KOStageProps>>
    setPage: React.Dispatch<React.SetStateAction<number>>
    tournamentWinner: string
}

export type KnockoutMatchButtonProps = {
    handleClick: (id: number, score_team1: string, score_team2: string) => void
    i: KOMatchProps
    isDisabled: boolean
    isLoading: boolean
    scoreTeam1: string | null
    scoreTeam2: string | null
}

export type KnockoutMatchScoreProps = {
    i: KOMatchProps
    setKOStage: React.Dispatch<React.SetStateAction<KOStageProps>>
}

export type MainMatchProps = {
    item: GameProps | KOMatchProps
}

export type PageNavigationProps = {
    isMatch?: boolean
    MAX_ITEMS_PER_PAGE: number
    nextPage: () => void
    page: number
    previousPage: () => void
    registeredTeams:
        | KOStageProps
        | RegisteredTeamsProps
        | ScheduleProps
        | StandingsProps
        | TournamentGroupsProps
}

export type PageNavigationButtonProps = {
    changePage: () => void
    isNext?: boolean
    MAX_ITEMS_PER_PAGE: number
    page: number
    registeredTeams:
        | TournamentGroupsProps
        | KOStageProps
        | RegisteredTeamsProps
        | ScheduleProps
        | StandingsProps
}

export type ScheduleProps = GameProps[]

export type ScheduleItemProps = {
    MAX_ITEMS_PER_PAGE: number
    nextPage: () => void
    page: number
    previousPage: () => void
}

export type ScheduleItemButtonProps = {
    handleClick: (id: number, score_team1: string, score_team2: string) => void
    i: GameProps
    index: number
    isDisabled: boolean
    isLoading: boolean
    scoreTeam1: string | null
    scoreTeam2: string | null
    x: number
}

export type ScheduleItemScoreProps = {
    i: GameProps
    index: number
    x: number
}

export type StandingsProps = {
    group: string
    standings: {
        team: string
        cup_difference: string
        cups_conceded: number
        cups_scored: number
        played: number
        points: number
    }[]
}[]

export type SuccessProps = {
    isSuccess: boolean
    label: string
}

export type StandingsItemProps = {
    MAX_ITEMS_PER_PAGE: number
    page: number
    standings: StandingsProps
}

export type StandingsLegendProps = {
    standings: StandingsProps
}

export type TeamProps = {
    handleDelete: (item: RegisteredTeamProps) => Promise<void>
    index: number
    isLoading: boolean
    item: RegisteredTeamProps
}

export type TeamsErrorProps = {
    error: string
}

export type TournamentGroupsProps = {
    id: number
    name: string
    teams: RegisteredTeamsProps
}[]

export type ToastProps = {
    isSuccess: boolean
    label: string
}

export type setLogoutProps = {
    isSessionExpired: boolean
}

export type useUpdatePageProps = {
    items: KOStageProps | ScheduleProps | StandingsProps | TournamentGroupsProps
    key: string
    MAX_ITEMS_PER_PAGE: number
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
}

export type useSubmitDisabledLoginProps = {
    confirmPassword: string
    isSigningUp: boolean
    password: string
    passwordPattern: RegExp
    setIsSubmitDisabled: React.Dispatch<React.SetStateAction<boolean>>
    userName: string
    userNamePattern: RegExp
}

export type useSubmitDisabledRegisterProps = {
    memberOne: string
    memberTwo: string
    setIsSubmitDisabled: React.Dispatch<React.SetStateAction<boolean>>
    teamName: string
    teamPattern: RegExp
}

export type useSessionExpiredProps = {
    location: Location<unknown>
    navigate: NavigateFunction
    showToast: (toast: ToastProps) => void
}

export type useNavigationOpacityProps = {
    setNavOpacity: React.Dispatch<React.SetStateAction<string>>
    timerRef: React.RefObject<ReturnType<typeof setTimeout> | null>
}

export type useFocusTrapPageProps = {
    focusableItems: (HTMLInputElement | HTMLButtonElement)[]
}

export type useFocusableItemsProps = {
    page: number
    registeredTeams:
        | KOStageProps
        | RegisteredTeamsProps
        | ScheduleProps
        | StandingsProps
        | TournamentGroupsProps
    setFocusableItems: (
        value: React.SetStateAction<(HTMLInputElement | HTMLButtonElement)[]>
    ) => void
}

export type useErrorConfirmPasswordProps = {
    confirmPassword: string
    password: string
    setErrorConfirmPassword: React.Dispatch<React.SetStateAction<string>>
}

export type useErrorPasswordProps = {
    password: string
    passwordPattern: RegExp
    setConfirmPasswordDisabled: React.Dispatch<React.SetStateAction<boolean>>
    setErrorPassword: React.Dispatch<React.SetStateAction<string>>
}

export type useErrorNameProps = {
    setErrorName: React.Dispatch<React.SetStateAction<string>>
    name: string
    namePattern: RegExp
    type: string
}

export type useErrorSameMemberProps = {
    memberOne: string
    memberTwo: string
    setErrorSameMember: React.Dispatch<React.SetStateAction<string>>
}
