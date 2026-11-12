/// <reference types="cypress" />
import { mockApi, STORAGE_KEY, visitLoggedIn } from '../../support/mockApi'

const recordDisabledChanges = (selector) => {
    cy.get(selector).then(($button) => {
        const win = $button[0].ownerDocument.defaultView
        win.__disabledLog = [$button[0].disabled]
        new win.MutationObserver((records) => {
            records
                .filter((record) => record.target.matches(selector))
                .forEach((record) =>
                    win.__disabledLog.push(record.target.disabled)
                )
        }).observe(win.document.querySelector('main'), {
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled'],
        })
    })
}

const disabledLog = () => cy.window().its('__disabledLog')

describe('form validation', () => {
    describe('register team', () => {
        const submit = 'main input[type="button"][value="Register Team"]'

        beforeEach(() => {
            mockApi({ teams: [] })
            visitLoggedIn('/register-team')
            recordDisabledChanges(submit)
        })

        it('should never enable the submit button while the rules are broken', () => {
            cy.get('#registerTeamName').type('Cup')
            cy.get('#registerMemberTwo').type('Jona')

            disabledLog().should('deep.equal', [true])
            cy.get(submit).should('be.disabled')
        })

        it('should enable the submit button exactly when the form becomes valid', () => {
            cy.get('#registerTeamName').type('CupCrushers')
            cy.get('#registerMemberTwo').type('Jonas')

            cy.get(submit).should('be.enabled')
            disabledLog().should('deep.equal', [true, false])

            cy.get('#registerMemberTwo').type('{backspace}')

            cy.get(submit).should('be.disabled')
            disabledLog().should('deep.equal', [true, false, true])
        })

        it('should keep the button disabled for two identical players', () => {
            cy.get('#registerTeamName').type('CupCrushers')
            cy.get('#registerMemberTwo').type('michael')

            cy.get(submit).should('be.disabled')
            cy.get('main').should(
                'contain',
                'Please choose two different player names.'
            )
        })
    })

    describe('signup', () => {
        beforeEach(() => {
            mockApi()
            cy.visit('/', {
                onBeforeLoad(win) {
                    win.localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify({ issigningup: true })
                    )
                },
            })
        })

        it('should keep the confirm field disabled for a password with spaces', () => {
            cy.get('[data-testid="login-user-input"]').type('CypressTestUser')
            cy.get('[data-testid="login-password-input"]').type('pass word')

            cy.get('main').should(
                'contain',
                'The password must not contain any spaces!'
            )
            cy.get('[data-testid="login-confirm-password-input"]').should(
                'be.disabled'
            )
            cy.get('[data-testid="login-submit"]').should('be.disabled')
        })

        it('should enable the submit button only when both passwords match', () => {
            recordDisabledChanges('[data-testid="login-submit"]')

            cy.get('[data-testid="login-user-input"]').type('CypressTestUser')
            cy.get('[data-testid="login-password-input"]').type('password')
            cy.get('[data-testid="login-confirm-password-input"]')
                .should('be.enabled')
                .type('passwor')

            cy.get('[data-testid="login-submit"]').should('be.disabled')
            disabledLog().should('deep.equal', [true])

            cy.get('[data-testid="login-confirm-password-input"]').type('d')
            cy.get('[data-testid="login-submit"]').should('be.enabled')
            disabledLog().should('deep.equal', [true, false])
        })
    })
})
