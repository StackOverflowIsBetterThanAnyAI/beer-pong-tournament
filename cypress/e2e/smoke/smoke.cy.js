/// <reference types="cypress" />

describe('smoke', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should be available at localhost:5173', () => {
        cy.get('[data-testid="navigation"]').should(
            'have.text',
            'Beer Pong Tournament'
        )

        cy.get('[data-testid="breadcrumbs-home"]').should('have.text', 'Home')

        cy.get('[data-testid="login-main"]').should(
            'have.text',
            'SignupAll fields marked with * are required.LoginSignupUser Name *Password *Confirm Password *'
        )

        cy.get('[data-testid="login-submit"]')
            .should('have.value', 'Signup')
            .should('be.disabled')

        cy.get('[data-testid="footer"]')
            .should('contain', 'Copyright ©')
            .should('contain', 'All Rights Reserved.')

        cy.get('[data-testid="footer-github-link"]').should(
            'have.text',
            'GitHub Repository'
        )
    })

    it('should display previous state after reloading', () => {
        cy.get('[data-testid="login-user-input"]').type('CypressTestUser')

        cy.get('[data-testid="login-password-input"]').type('password')

        cy.reload()

        cy.get('[data-testid="login-user-input"]').should(
            'have.value',
            'CypressTestUser'
        )

        cy.get('[data-testid="login-password-input"]').should('have.value', '')

        cy.get('[data-testid="login-switch"]').should('exist').click()

        cy.get('[data-testid="login-user-input"]')
            .clear()
            .type('CypressTestUser')

        cy.get('[data-testid="login-password-input"]').clear().type('password')

        cy.reload()

        cy.get('[data-testid="login-user-input"]').should(
            'have.value',
            'CypressTestUser'
        )

        cy.get('[data-testid="login-password-input"]').should('have.value', '')
    })

    it('should show 404 for unintended routes', () => {
        cy.visit('admin')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.get('[data-testid="breadcrumbs"]').should('have.text', 'Home')
    })

    it('should show 404 for intended routes if the user is not logged in', () => {
        cy.visit('register-team')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.get('[data-testid="breadcrumbs"]').should(
            'have.text',
            'Home>Register Team'
        )

        cy.visit('teams')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.get('[data-testid="breadcrumbs"]').should('have.text', 'Home>Teams')

        cy.visit('groups')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.get('[data-testid="breadcrumbs"]').should('have.text', 'Home>Groups')

        cy.visit('schedule')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.get('[data-testid="breadcrumbs"]').should(
            'have.text',
            'Home>Schedule'
        )

        cy.visit('standings')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.get('[data-testid="breadcrumbs"]').should(
            'have.text',
            'Home>Standings'
        )

        cy.visit('knockout-stage')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.get('[data-testid="breadcrumbs"]').should(
            'have.text',
            'Home>Knockout Stage'
        )
    })
})
