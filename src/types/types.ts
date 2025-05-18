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

export type ScheduleProps = GameProps[]

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

export type TournamentGroupsProps = {
    id: number
    name: string
    teams: RegisteredTeamsProps
}[]

export type ToastProps = {
    label: string
    isSuccess: boolean
}
