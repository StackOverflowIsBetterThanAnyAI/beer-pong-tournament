/// <reference types="cypress" />
import {
    buildGames,
    buildGroups,
    buildKOStageFinished,
    mockApi,
    TEAMS,
    visitLoggedIn,
} from '../../support/mockApi'

const dialog = () => cy.get('dialog[open][data-testid="confirm-dialog"]')

describe('confirm dialog', () => {
    beforeEach(() => {
        cy.viewport(1280, 800)
    })

    describe('delete team', () => {
        beforeEach(() => {
            mockApi()
            cy.intercept('DELETE', '**/api/v1/teams/delete/*/', {
                body: { success: true },
            }).as('deleteTeam')
            cy.intercept('DELETE', '**/api/v1/groups/delete/', {
                body: { success: true },
            }).as('deleteGroups')
            visitLoggedIn('/teams')
            cy.wait('@getTeams')
        })

        it('should ask before deleting and focus Cancel', () => {
            cy.get('button[aria-label="Delete CupCrushers"]').click()

            dialog()
                .should('contain', 'Delete Team?')
                .should('contain', 'Do you really want to delete CupCrushers?')
            cy.get('[data-testid="confirm-dialog-cancel"]:visible').should(
                'have.focus'
            )
        })

        it('should not delete when cancelling, pressing Escape or clicking the backdrop', () => {
            cy.get('button[aria-label="Delete CupCrushers"]').click()
            cy.get('[data-testid="confirm-dialog-cancel"]:visible').click()
            dialog().should('not.exist')
            cy.get('button[aria-label="Delete CupCrushers"]').should(
                'have.focus'
            )

            cy.get('button[aria-label="Delete CupCrushers"]').click()
            dialog().should('exist')
            dialog().trigger('cancel')
            dialog().should('not.exist')

            cy.get('button[aria-label="Delete CupCrushers"]').click()
            dialog().should('exist')
            dialog().then(($dialog) => {
                const element = $dialog[0]
                const win = element.ownerDocument.defaultView
                element.dispatchEvent(
                    new win.MouseEvent('click', { bubbles: true })
                )
            })
            dialog().should('not.exist')

            cy.get('@deleteTeam.all').should('have.length', 0)
            cy.get('main').should('contain', 'CupCrushers')
        })

        it('should delete the team after confirming', () => {
            cy.get('button[aria-label="Delete PongPirates"]').click()
            cy.get('[data-testid="confirm-dialog-confirm"]:visible').click()

            cy.wait('@deleteTeam')
                .its('request.url')
                .should('match', /\/teams\/delete\/2\/$/)
            dialog().should('not.exist')
            cy.get('main').should('not.contain', 'PongPirates')
        })

        it('should lock page scrolling while the dialog is open', () => {
            cy.get('html').should('not.have.class', 'scroll-locked')

            cy.get('button[aria-label="Delete CupCrushers"]').click()
            cy.get('html')
                .should('have.class', 'scroll-locked')
                .should('have.css', 'overflow-y', 'hidden')

            dialog().trigger('cancel')
            cy.get('html')
                .should('not.have.class', 'scroll-locked')
                .should('have.css', 'overflow-y', 'scroll')
        })
    })

    describe('restart tournament', () => {
        it('should only ask once groups exist and not restart when cancelling', () => {
            const groups = buildGroups()
            mockApi({ groups, games: buildGames(groups) })
            cy.intercept('POST', '**/api/v1/groups/bulk/', {
                statusCode: 201,
                body: [],
            }).as('generateGroups')
            visitLoggedIn('/groups')

            cy.contains('button', 'Restart Tournament').click()
            dialog()
                .should('contain', 'Restart Tournament?')
                .should('contain', 'All matches, results and the knockout')

            cy.get('[data-testid="confirm-dialog-cancel"]:visible').click()
            dialog().should('not.exist')
            cy.get('@generateGroups.all').should('have.length', 0)
        })

        it('should start the first tournament without asking', () => {
            mockApi({ teams: TEAMS })
            cy.intercept('POST', '**/api/v1/groups/bulk/', {
                statusCode: 201,
                body: [],
            }).as('generateGroups')
            visitLoggedIn('/groups')

            cy.contains('button', 'Start Tournament').click()
            dialog().should('not.exist')
            cy.wait('@generateGroups')
        })
    })

    describe('new tournament', () => {
        it('should ask before resetting everything', () => {
            const groups = buildGroups()
            mockApi({
                groups,
                games: buildGames(groups, 6),
                koStage: buildKOStageFinished(),
            })
            cy.intercept('POST', '**/api/v1/reset-tournament/', {
                body: { success: true },
            }).as('reset')
            visitLoggedIn('/knockout-stage', {
                stored: { isgroupstageover: true },
            })

            cy.contains('button', 'New Tournament').click()
            dialog()
                .should('contain', 'Start New Tournament?')
                .should('contain', 'This cannot be undone.')

            cy.get('[data-testid="confirm-dialog-cancel"]:visible').click()
            cy.get('@reset.all').should('have.length', 0)

            cy.contains('button', 'New Tournament').click()
            cy.get('[data-testid="confirm-dialog-confirm"]:visible').click()
            cy.wait('@reset')
        })
    })
})
