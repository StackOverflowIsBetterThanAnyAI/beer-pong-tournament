/// <reference types="cypress" />
import {
    buildGames,
    buildGroups,
    buildStandings,
    mockApi,
    visitLoggedIn,
} from '../../support/mockApi'

describe('my team', () => {
    const groups = buildGroups()
    const standings = buildStandings(groups)

    beforeEach(() => {
        cy.viewport(1280, 800)
    })

    it('should mark my team on teams, groups, schedule and standings', () => {
        const games = buildGames(groups)
        mockApi({ groups, games, standings })
        visitLoggedIn('/teams')

        cy.get('[data-testid="my-team-badge"]')
            .should('have.length', 1)
            .parent()
            .should('contain', 'CupCrushers')

        cy.get('[data-testid="navigation-link-groups"]').click()
        cy.get('[data-testid="my-team-badge"]')
            .should('have.length', 1)
            .parent()
            .should('contain', 'CupCrushers')

        cy.get('[data-testid="navigation-link-schedule"]').click()
        cy.get('[data-testid="my-team-badge"]').should('have.length', 3)

        cy.get('[data-testid="navigation-link-standings"]').click()
        cy.get('[data-testid="my-team-badge"]')
            .should('have.length', 1)
            .parent()
            .should('contain', 'CupCrushers')
    })

    it('should not show a badge when I do not play in any team', () => {
        mockApi({ groups, games: buildGames(groups), standings })
        visitLoggedIn('/teams', { username: 'spectator' })

        cy.get('main').should('contain', 'CupCrushers')
        cy.get('[data-testid="my-team-badge"]').should('not.exist')
    })

    it('should show my next match on the start page', () => {
        const games = buildGames(groups, 1)
        const reordered = [
            ...games.filter((g) => g.played),
            ...games.filter((g) => !g.played && g.group !== 'Group 1'),
            ...games.filter((g) => !g.played && g.group === 'Group 1'),
        ]
        mockApi({ groups, games: reordered, standings })
        visitLoggedIn('/')

        cy.contains('h2', 'Upcoming Match:').should('exist')
        cy.contains('h2', 'Your Next Match:')
            .parent()
            .should('contain', 'CupCrushers')
            .find('[data-testid="my-team-badge"]')
            .should('exist')
    })

    it('should not repeat my next match when it is the upcoming match anyway', () => {
        mockApi({ groups, games: buildGames(groups), standings })
        visitLoggedIn('/')

        cy.contains('h2', 'Upcoming Match:')
            .parent()
            .should('contain', 'CupCrushers')
        cy.contains('h2', 'Your Next Match:').should('not.exist')
    })
})
