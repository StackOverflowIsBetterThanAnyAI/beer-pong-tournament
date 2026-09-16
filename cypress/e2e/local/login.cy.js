/// <reference types="cypress" />

describe('login', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should register a new account', () => {
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

        cy.get('[data-testid="logout"]').should('exist').click()

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

        cy.get('[data-testid="logout"]').should('exist').click()

        cy.window().should((win) => {
            const storage = win.localStorage.getItem('beer-pong-tournament')
            expect(storage).to.exist

            const parsed = JSON.parse(storage)
            expect(parsed.username).to.equal('CypressTestUser')
        })
    })

    it('should initially display signup form', () => {
        cy.get('main').should('contain', 'Signup')
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
