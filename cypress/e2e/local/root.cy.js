/// <reference types="cypress" />

describe('root', () => {
    before(() => {
        cy.visit('/')

        cy.request({
            method: 'DELETE',
            url: 'http://127.0.0.1:8000/api/v1/test_utils/__delete-cypress-test-user/',
            failOnStatusCode: false,
        }).then((response) => {
            if (![200, 204].includes(response.status)) {
                throw new Error(`Unexpected error: ${response.status}`)
            }
        })

        cy.get('[data-testid="login-user-input"]')
            .should('exist')
            .type('CypressTestUser')

        cy.get('[data-testid="login-password-input"]')
            .should('exist')
            .type('password')

        cy.get('[data-testid="login-confirm-password-input"]')
            .should('exist')
            .type('password')

        cy.get('[data-testid="login-submit"]').should('exist').click()
    })

    it('should display the correct default content for a tournament that has not yet started', () => {
        cy.get('main').should('contain', 'Welcome to the Beer Pong Tournament!')

        cy.get('main').should(
            'contain',
            'The next tournament is just around the corner!'
        )

        cy.get('main').should('contain', 'Currently registered Teams: ')

        cy.get('main').should('contain', 'Register Team')

        cy.get('main').should('contain', 'Register now before it starts.')

        cy.get('[data-testid="breadcrumbs-home"]').should('have.text', 'Home')

        cy.get('[data-testid="navigation-link-register-team"]').should(
            'have.text',
            'Register Team'
        )

        cy.get('[data-testid="navigation-link-teams"]').should(
            'have.text',
            'Teams'
        )

        cy.get('[data-testid="navigation-link-groups"]').should(
            'have.text',
            'Groups'
        )

        cy.get('[data-testid="navigation-link-schedule"]').should(
            'have.text',
            'Schedule'
        )

        cy.get('[data-testid="navigation-link-standings"]').should(
            'have.text',
            'Standings'
        )

        cy.get('[data-testid="navigation-link-knockout-stage"]').should(
            'have.text',
            'Knockout Stage'
        )
    })

    after(() => {
        cy.request({
            method: 'DELETE',
            url: 'http://127.0.0.1:8000/api/v1/test_utils/__delete-cypress-test-user/',
            failOnStatusCode: false,
        }).then((response) => {
            if (![200, 204].includes(response.status)) {
                throw new Error(`Unexpected error: ${response.status}`)
            }
        })
    })
})
