/// <reference types="cypress" />
import {
    buildGames,
    buildGroups,
    buildStandings,
    mockApi,
    TEAMS,
    visitLoggedIn,
} from '../../support/mockApi'

const watchSpinner = (win) => {
    win.__spinnerSeen = false
    new win.MutationObserver(() => {
        if (win.document.querySelector('main .fetch-loading__dot')) {
            win.__spinnerSeen = true
        }
    }).observe(win.document, { childList: true, subtree: true })
}

const spinnerSeen = () => cy.window().its('__spinnerSeen')

describe('loading state', () => {
    const groups = buildGroups()
    const games = buildGames(groups)
    const standings = buildStandings(groups)

    beforeEach(() => {
        cy.viewport(1280, 800)
        mockApi({ groups, games, standings, delay: 1000 })
    })

    it('should show stored teams instead of a spinner while reloading', () => {
        visitLoggedIn('/teams', {
            stored: { registeredteams: TEAMS },
            onBeforeLoad: watchSpinner,
        })

        cy.get('main').should('contain', 'CupCrushers')
        cy.wait('@getTeams')
        cy.get('main').should('contain', 'CupCrushers')
        spinnerSeen().should('equal', false)
    })

    it('should show stored standings instead of a spinner while reloading', () => {
        visitLoggedIn('/standings', {
            stored: { standings },
            onBeforeLoad: watchSpinner,
        })

        cy.get('main').should('contain', 'Group 1')
        cy.wait('@getStandings')
        cy.get('main').should('contain', 'Group 1')
        spinnerSeen().should('equal', false)
    })

    it('should show stored games instead of a spinner while reloading', () => {
        visitLoggedIn('/schedule', {
            stored: { schedule: games },
            onBeforeLoad: watchSpinner,
        })

        cy.get('main').should('contain', 'CupCrushers')
        cy.wait('@getGames')
        cy.get('main').should('contain', 'CupCrushers')
        spinnerSeen().should('equal', false)
    })

    it('should show a spinner when nothing is stored yet', () => {
        visitLoggedIn('/teams', { onBeforeLoad: watchSpinner })

        cy.wait('@getTeams')
        cy.get('main').should('contain', 'CupCrushers')
        spinnerSeen().should('equal', true)
    })
})
