/// <reference types="cypress" />

export const STORAGE_KEY = 'beer-pong-tournament'

export const TEAMS = [
    ['CupCrushers', 'michael', 'Jonii'],
    ['PongPirates', 'Lukas', 'Felix'],
    ['BallBusters', 'Laura', 'Hannah'],
    ['SplashBrothers', 'Maximilian', 'Niklas'],
    ['TheBouncers', 'Sophie', 'Marie'],
    ['RedCupRebels', 'Tobias', 'Florian'],
    ['FoamFighters', 'Julia', 'Katharina'],
    ['HopsAndHope', 'Daniel', 'Simon'],
    ['TableTitans', 'Leonie', 'Paula'],
    ['BeerBaronesses', 'Annika', 'Theresa'],
    ['WristFlickers', 'Moritz', 'Jakob'],
    ['CupCollectors', 'Elias', 'Benedikt'],
    ['NoMercyPong', 'Johanna', 'Clara'],
    ['GravityGang', 'Fabian', 'Sandro'],
    ['LastCupStanding', 'Vanessa', 'Melanie'],
    ['RimShots', 'Patrick', 'Dominik'],
].map(([name, member_one, member_two], i) => ({
    id: i + 1,
    name,
    member_one,
    member_two,
}))

const base64Url = (value) =>
    btoa(JSON.stringify(value))
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
export const FAKE_JWT = `${base64Url({ alg: 'HS256', typ: 'JWT' })}.${base64Url(
    { exp: 4102444800 }
)}.signature`

export const buildGroups = (teams = TEAMS) =>
    Array.from({ length: teams.length / 4 }, (_, g) => ({
        id: g + 1,
        name: `Group ${g + 1}`,
        teams: teams.slice(g * 4, g * 4 + 4),
    }))

export const buildGames = (groups, playedPerGroup = 0) => {
    const pairs = [
        [0, 1],
        [2, 3],
        [0, 2],
        [1, 3],
        [0, 3],
        [1, 2],
    ]
    let id = 1
    return groups.flatMap((group) =>
        pairs.map(([a, b], index) => {
            const played = index < playedPerGroup
            return {
                id: id++,
                group: group.name,
                team1: group.teams[a].name,
                team2: group.teams[b].name,
                score_team1: played ? 10 : null,
                score_team2: played ? 5 : null,
                played,
            }
        })
    )
}

export const buildStandings = (groups) =>
    groups.map((group) => ({
        group: group.name,
        standings: group.teams.map((team, index) => ({
            team: team.name,
            cup_difference: `${index < 2 ? '+' : ''}${10 - index * 5}`,
            cups_conceded: 5 + index,
            cups_scored: 10 - index,
            played: 3,
            points: 9 - index * 3,
        })),
    }))

const koMatch = (id, round, team1, team2, score1 = null, score2 = null) => ({
    id,
    round,
    round_display: {
        R16: 'Round of 16',
        QF: 'Quarterfinals',
        SF: 'Semifinals',
        F: 'Final',
    }[round],
    played: score1 !== null,
    score_team1: score1,
    score_team2: score2,
    team1: team1.id,
    team1_name: team1.name,
    team2: team2.id,
    team2_name: team2.name,
})

export const buildKOStagePartial = (teams = TEAMS) => {
    const r16 = Array.from({ length: 8 }, (_, i) =>
        koMatch(100 + i, 'R16', teams[i * 2], teams[i * 2 + 1], 10, 6)
    )
    const winners = r16.map((match) => teams.find((t) => t.id === match.team1))
    const qf = [
        koMatch(200, 'QF', winners[0], winners[1], 10, 7),
        koMatch(201, 'QF', winners[2], winners[3]),
        koMatch(202, 'QF', winners[4], winners[5]),
        koMatch(203, 'QF', winners[6], winners[7]),
    ]
    return [...r16, ...qf]
}

export const buildKOStageFinished = (teams = TEAMS) => [
    koMatch(300, 'SF', teams[0], teams[1], 10, 4),
    koMatch(301, 'SF', teams[2], teams[3], 3, 10),
    koMatch(400, 'F', teams[0], teams[3], 10, 8),
]

export const mockApi = ({
    teams = TEAMS,
    groups = [],
    games = [],
    standings = [],
    koStage = [],
    delay = 0,
} = {}) => {
    cy.intercept({ url: '**/api/v1/**' }, (req) => {
        req.reply({ statusCode: 599, body: { error: `unmocked: ${req.url}` } })
    }).as('unmocked')

    cy.intercept('GET', '**/api/v1/teams/', { body: teams, delay }).as(
        'getTeams'
    )
    cy.intercept('GET', '**/api/v1/groups/', {
        body: { data: groups },
        delay,
    }).as('getGroups')
    cy.intercept('GET', '**/api/v1/games/', { body: games, delay }).as(
        'getGames'
    )
    cy.intercept('GET', '**/api/v1/groups/standings/', {
        body: standings,
        delay,
    }).as('getStandings')
    cy.intercept('GET', '**/api/v1/ko-stage/', { body: koStage, delay }).as(
        'getKOStage'
    )
}

export const visitLoggedIn = (
    path = '/',
    {
        isAdmin = true,
        username = 'michael',
        stored = {},
        onBeforeLoad = () => {},
    } = {}
) => {
    cy.visit(path, {
        onBeforeLoad(win) {
            onBeforeLoad(win)
            win.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    access: FAKE_JWT,
                    refresh: FAKE_JWT,
                    isadmin: isAdmin,
                    isloggedin: true,
                    issigningup: false,
                    username,
                    ...stored,
                })
            )
        },
    })
}
