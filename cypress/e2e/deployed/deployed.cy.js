/// <reference types="cypress" />

describe('deployed', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should be available at beer-pong-tournament.vercel.app', () => {
        cy.get('[data-testid="navigation"]').should(
            'have.text',
            'Beer Pong Tournament'
        )

        cy.get('[data-testid="login-main"]').should(
            'have.text',
            'SignupAll fields marked with * are required.LoginSignupUser Name *Password *Confirm Password *'
        )

        cy.get('[data-testid="footer"]').should('contain', 'Copyright ©')
    })

    it('should login as admin', () => {
        cy.get('[data-testid="login-switch"]').should('exist').click()

        cy.get('[data-testid="login-user-input"]')
            .should('exist')
            .type(Cypress.env('ADMIN_USERNAME'))

        cy.get('[data-testid="login-password-input"]')
            .should('exist')
            .type(Cypress.env('ADMIN_PASSWORD'))

        cy.get('[data-testid="login-submit"]').should('exist').click()

        cy.get('[data-testid="navigation-links"]', { timeout: 50000 })
            .should('exist')
            .should(
                'have.text',
                'Register TeamTeamsGroupsScheduleStandingsKnockout StageClose Navigation'
            )

        cy.window().should((win) => {
            const storage = win.localStorage.getItem('beer-pong-tournament')
            expect(storage).to.exist

            const parsed = JSON.parse(storage)
            expect(parsed.isadmin).to.equal(true)
        })
    })

    it('should stay logged in as admin', () => {
        cy.get('[data-testid="login-switch"]').click()

        cy.get('[data-testid="login-user-input"]').type(
            Cypress.env('ADMIN_USERNAME')
        )

        cy.get('[data-testid="login-password-input"]').type(
            Cypress.env('ADMIN_PASSWORD')
        )

        cy.get('[data-testid="login-submit"]').click()

        cy.get('[data-testid="navigation-links"]', { timeout: 50000 }).should(
            'exist'
        )

        cy.reload()

        cy.window().should((win) => {
            const storage = win.localStorage.getItem('beer-pong-tournament')
            expect(storage).to.exist

            const parsed = JSON.parse(storage)
            expect(parsed.isadmin).to.equal(true)
        })
    })

    it('should clear local and session storage after logout', () => {
        cy.get('[data-testid="login-switch"]').click()

        cy.get('[data-testid="login-user-input"]').type(
            Cypress.env('ADMIN_USERNAME')
        )

        cy.get('[data-testid="login-password-input"]').type(
            Cypress.env('ADMIN_PASSWORD')
        )

        cy.get('[data-testid="login-submit"]').click()

        cy.get('[data-testid="logout"]', { timeout: 50000 })
            .should('exist')
            .click()

        cy.window().should((win) => {
            const storage = win.localStorage.getItem('beer-pong-tournament')
            expect(storage).to.exist

            const parsed = JSON.parse(storage)
            // expect(Object.keys(parsed)).to.have.length(2)
            expect(parsed.issigningup).to.equal(false)
            expect(parsed.username).to.equal(Cypress.env('ADMIN_USERNAME'))
        })

        cy.window().should((win) => {
            const storage = win.sessionStorage.getItem('beer-pong-tournament')
            expect(storage).not.to.exist
        })
    })

    it('should redirect to all intended routes when using navigation links', () => {
        cy.get('[data-testid="login-switch"]').click()

        cy.get('[data-testid="login-user-input"]').type(
            Cypress.env('ADMIN_USERNAME')
        )

        cy.get('[data-testid="login-password-input"]').type(
            Cypress.env('ADMIN_PASSWORD')
        )

        cy.get('[data-testid="login-submit"]').click()

        cy.get('[data-testid="navigation-link-register-team"]', {
            timeout: 50000,
        })
            .should('exist')
            .click()

        cy.get('main').should(
            'have.text',
            'Register TeamAll fields marked with * are required.Team Name *First Team Member *Second Team Member *'
        )

        cy.get('[data-testid="navigation-link-teams"]').should('exist').click()

        cy.get('main').should('contain', 'Registered Teams')

        cy.get('[data-testid="navigation-link-groups"]').should('exist').click()

        cy.get('main').should('contain', 'Groups')

        cy.get('[data-testid="navigation-link-schedule"]')
            .should('exist')
            .click()

        cy.get('main').should('contain', 'Schedule')

        cy.get('[data-testid="navigation-link-standings"]')
            .should('exist')
            .click()

        cy.get('main').should('contain', 'Standings')

        cy.get('[data-testid="navigation-link-knockout-stage"]')
            .should('exist')
            .click()

        cy.get('main').should('contain', 'Knockout Stage')
    })

    it('should show 404 for unintended routes', () => {
        cy.get('[data-testid="login-switch"]').click()

        cy.get('[data-testid="login-user-input"]').type(
            Cypress.env('ADMIN_USERNAME')
        )

        cy.get('[data-testid="login-password-input"]').type(
            Cypress.env('ADMIN_PASSWORD')
        )

        cy.get('[data-testid="login-submit"]').click()

        cy.visit('admin')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.visit('home')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.visit('index')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )
    })

    it('should show 404 for intended routes if the user is not logged in', () => {
        cy.visit('register-team')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.visit('teams')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.visit('groups')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.visit('schedule')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.visit('standings')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )

        cy.visit('knockout-stage')

        cy.get('main').should(
            'have.text',
            'Oops!It looks like this site does not exist ...Homepage'
        )
    })
})
