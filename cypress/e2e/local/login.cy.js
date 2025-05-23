/// <reference types="cypress" />

describe('login', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should register a new account', () => {
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

        cy.get('[data-testid="logout"]', { timeout: 50000 })
            .should('exist')
            .click()

        cy.window().should((win) => {
            const storage = win.localStorage.getItem('beer-pong-tournament')
            expect(storage).to.exist

            const parsed = JSON.parse(storage)
            expect(parsed.username).to.equal('CypressTestUser')
        })
    })

    it('should login with a registered account', () => {
        cy.get('[data-testid="login-switch"]').should('exist').click()

        cy.get('[data-testid="login-user-input"]')
            .should('exist')
            .type('CypressTestUser')

        cy.get('[data-testid="login-password-input"]')
            .should('exist')
            .type('password')

        cy.get('[data-testid="login-submit"]').should('exist').click()

        cy.get('[data-testid="logout"]', { timeout: 50000 })
            .should('exist')
            .click()

        cy.window().should((win) => {
            const storage = win.localStorage.getItem('beer-pong-tournament')
            expect(storage).to.exist

            const parsed = JSON.parse(storage)
            expect(parsed.username).to.equal('CypressTestUser')
        })

        cy.request({
            method: 'DELETE',
            url: 'http://127.0.0.1:8000/api/v1/test_utils/__delete-cypress-test-user/',
            failOnStatusCode: false,
        }).then((response) => {
            if (!response.status === 200) {
                throw new Error(`Unexpected error: ${response.status}`)
            }
        })
    })

    it('should toggle between login and register form and keep previous state', () => {
        cy.get('[data-testid="login-switch"]').should('exist').click()

        cy.get('main').should('contain', 'Login')

        cy.get('[data-testid="login-user-input"]')
            .should('exist')
            .type('CypressTestUser')

        cy.get('[data-testid="login-password-input"]')
            .should('exist')
            .type('password')

        cy.get('[data-testid="login-switch"]').should('exist').click()

        cy.get('[data-testid="login-user-input"]')
            .should('exist')
            .should('have.value', 'CypressTestUser')

        cy.get('[data-testid="login-password-input"]')
            .should('exist')
            .should('have.value', '')
    })

    it('should initially display signup form', () => {
        cy.get('main').should('contain', 'Signup')
    })

    it('should display previous state after reloading', () => {
        cy.get('[data-testid="login-user-input"]')
            .should('exist')
            .type('CypressTestUser')

        cy.get('[data-testid="login-password-input"]')
            .should('exist')
            .type('password')

        cy.reload()

        cy.get('[data-testid="login-user-input"]')
            .should('exist')
            .should('have.value', 'CypressTestUser')

        cy.get('[data-testid="login-password-input"]')
            .should('exist')
            .should('have.value', '')

        cy.get('[data-testid="login-switch"]').should('exist').click()

        cy.get('[data-testid="login-user-input"]')
            .should('exist')
            .clear()
            .type('CypressTestUser')

        cy.get('[data-testid="login-password-input"]')
            .should('exist')
            .clear()
            .type('password')

        cy.reload()

        cy.get('[data-testid="login-user-input"]')
            .should('exist')
            .should('have.value', 'CypressTestUser')

        cy.get('[data-testid="login-password-input"]')
            .should('exist')
            .should('have.value', '')
    })
})
