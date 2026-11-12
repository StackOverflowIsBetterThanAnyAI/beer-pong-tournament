/// <reference types="cypress" />
import {
    buildGames,
    buildGroups,
    buildKOStagePartial,
    mockApi,
    TEAMS,
    visitLoggedIn,
} from '../../support/mockApi'

describe('knockout bracket', () => {
    const groups = buildGroups()

    const visitKnockout = () => {
        mockApi({
            groups,
            games: buildGames(groups, 6),
            koStage: buildKOStagePartial(),
        })
        visitLoggedIn('/knockout-stage', {
            stored: { isgroupstageover: true, registeredteams: TEAMS },
        })
        cy.wait('@getKOStage')
    }

    describe('desktop', () => {
        beforeEach(() => {
            cy.viewport(1280, 900)
            visitKnockout()
        })

        it('should show every round with placeholders for future matches', () => {
            cy.get('[data-testid="knockout-bracket"]').within(() => {
                cy.get('h3').should(
                    'have.text',
                    'Round of 16QuarterfinalsSemifinalsFinal'
                )
                cy.get('[role="list"]').should('have.length', 4)
                cy.get('[role="listitem"]').should('have.length', 15)
                cy.contains('.sr-only', 'To be determined').should('exist')
                cy.get('.sr-only')
                    .filter(':contains("To be determined")')
                    .should('have.length', 3)
            })
        })

        it('should describe every match for screen readers', () => {
            cy.get('[data-testid="knockout-bracket"] .sr-only').then(($s) => {
                const texts = [...$s].map((s) => s.textContent)
                expect(texts).to.include(
                    'CupCrushers (your team) 10, PongPirates 6, CupCrushers (your team) wins'
                )
                expect(texts).to.include(
                    'TheBouncers versus FoamFighters, not played yet'
                )
            })
        })

        it('should hide the visual cards from screen readers', () => {
            cy.get('[data-testid="knockout-bracket"]')
                .contains('TBD')
                .closest('[aria-hidden="true"]')
                .should('exist')
        })

        it('should not add a tab stop when the bracket fits', () => {
            cy.get('[data-testid="knockout-bracket-scroll"]').should(
                'not.have.attr',
                'tabindex'
            )
            cy.get('[data-testid="knockout-bracket-scroll"]').should(
                'not.have.attr',
                'role'
            )
        })
    })

    describe('mobile', () => {
        beforeEach(() => {
            cy.viewport('iphone-x')
            visitKnockout()
        })

        it('should make the scrollable bracket a focusable region', () => {
            cy.get('[data-testid="knockout-bracket-scroll"]')
                .should('have.attr', 'tabindex', '0')
                .should('have.attr', 'role', 'region')
                .then(($scroll) => {
                    expect($scroll[0].scrollWidth).to.be.greaterThan(
                        $scroll[0].clientWidth
                    )
                })
            cy.document().then((doc) => {
                expect(doc.documentElement.scrollWidth).to.be.at.most(
                    doc.documentElement.clientWidth
                )
            })
        })

        it('should show the bracket on every page of the match list', () => {
            cy.get('[data-testid="knockout-bracket"]').should('exist')

            cy.get('main .nextpage').click()

            cy.contains('main li h2', 'Quarterfinals').should('exist')
            cy.get('[data-testid="knockout-bracket"]').should('exist')
        })
    })
})
