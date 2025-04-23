export type LoggedInUserProps = {
    user: string
    token: string
}

export type RegisteredTeamProps = {
    id: number
    name: string
    member_one: string
    member_two: string
}

export type RegisteredTeamsProps = RegisteredTeamProps[]

export type ScheduleProps = {
    id: number
    group: string
    team1: string
    team2: string
    score_team1: number | null
    score_team2: number | null
    played: boolean
}[]

export type TournamentGroupsProps = {
    id: number
    name: string
    teams: RegisteredTeamsProps
}[]
