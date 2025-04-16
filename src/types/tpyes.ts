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

export type TournamentGroupsProps = {
    id: number
    name: string
    teams: RegisteredTeamsProps
}[]
