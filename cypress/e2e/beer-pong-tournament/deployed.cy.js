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

        cy.get('[data-testid="footer"]').should(
            'have.text',
            'Copyright © 2025 Michael Münzenhofer. All Rights Reserved.GitHub Repository'
        )
    })
})
