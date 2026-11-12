/// <reference types="cypress" />
import {
    buildGames,
    buildGroups,
    mockApi,
    visitLoggedIn,
} from '../../support/mockApi'

describe('score input', () => {
    const groups = buildGroups()
    const games = buildGames(groups, 2)

    beforeEach(() => {
        cy.viewport(1280, 800)
        mockApi({ groups, games })
        cy.intercept('PATCH', '**/api/v1/games/*/', {
            body: { success: true },
        }).as('updateScore')
        visitLoggedIn('/schedule')
        cy.wait('@getGames')
    })

    it('should offer a numeric input with a placeholder', () => {
        cy.get('main input[inputmode="numeric"]')
            .first()
            .should('have.attr', 'placeholder', '0-10')
            .should('have.attr', 'pattern', '[0-9]*')
            .should('have.attr', 'enterkeyhint', 'done')
            .should('have.attr', 'autocomplete', 'off')
    })

    it('should render saved results in a box of the same size as the input', () => {
        cy.get('main input[inputmode="numeric"]')
            .first()
            .parent()
            .then(($input) => {
                const input = $input[0].getBoundingClientRect()

                cy.contains('main span', /^10$/).then(($result) => {
                    const result = $result[0].getBoundingClientRect()
                    expect(result.width).to.equal(input.width)
                    expect(result.height).to.equal(input.height)
                })
            })
    })

    it('should clear a stale pair error when the other score fixes it', () => {
        cy.get('#inputCupCrushersvsBallBusters').as('score1')
        cy.get('#inputBallBustersvsCupCrushers').as('score2')

        cy.get('@score1').type('3')
        cy.get('@score2').type('3')
        cy.get('main').should(
            'contain',
            'At least on team has to score 10 cups.'
        )
        cy.get('@score1')
            .parents('li')
            .first()
            .find('button')
            .should('be.disabled')

        cy.get('@score2').clear().type('10')

        cy.get('main').should(
            'not.contain',
            'At least on team has to score 10 cups.'
        )
        cy.get('@score1')
            .parents('li')
            .first()
            .find('button')
            .should('be.enabled')
            .click()

        cy.wait('@updateScore').its('request.body').should('deep.include', {
            score_team1: '3',
            score_team2: '10',
        })
    })
})
