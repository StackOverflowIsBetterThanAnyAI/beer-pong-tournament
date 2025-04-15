export type LoggedInUserProps = {
    user: string
    token: string
}

export type RegisteredTeamProps = {
    id?: string
    name: string
    member_one: string
    member_two: string
}

export type RegisteredTeamsProps = RegisteredTeamProps[]
