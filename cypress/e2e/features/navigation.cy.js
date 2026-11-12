/// <reference types="cypress" />
import { mockApi, visitLoggedIn } from '../../support/mockApi'

describe('navigation', () => {
    beforeEach(() => {
        mockApi()
    })

    describe('desktop', () => {
        beforeEach(() => {
            cy.viewport(1280, 800)
            visitLoggedIn('/teams')
        })

        it('should show the links in the header and mark the current page', () => {
            cy.get('[data-testid="navigation-links"]')
                .should('be.visible')
                .should(
                    'have.text',
                    'Register TeamTeamsGroupsScheduleStandingsKnockout Stage'
                )
            cy.get('[data-testid="navigation-menu-button"]').should(
                'not.be.visible'
            )

            cy.get('[data-testid="navigation-link-teams"]').should(
                'have.attr',
                'aria-current',
                'page'
            )
            cy.get('[data-testid="navigation-link-groups"]').should(
                'not.have.attr',
                'aria-current'
            )
            cy.get('[data-testid="navigation-link-groups"]').click()

            cy.location('pathname').should('eq', '/groups')
            cy.get('[data-testid="navigation-link-groups"]').should(
                'have.attr',
                'aria-current',
                'page'
            )
        })

        it('should not animate the focus outline color', () => {
            cy.get('[data-testid="navigation-link-teams"]')
                .should('have.css', 'transition-property')
                .and('not.contain', 'outline')
        })
    })

    describe('mobile', () => {
        beforeEach(() => {
            cy.viewport('iphone-x')
            visitLoggedIn('/teams')
        })

        it('should keep the menu closed initially', () => {
            cy.get('[data-testid="navigation-links"]').should('not.be.visible')
            cy.get('[data-testid="logout"]').should('not.be.visible')
            cy.get('[data-testid="navigation-menu-button"]').should(
                'have.attr',
                'aria-expanded',
                'false'
            )
            cy.get('[data-testid="navigation-menu-links"]').should(
                'not.be.visible'
            )
        })

        it('should close the menu after choosing a link', () => {
            cy.get('[data-testid="navigation-menu-button"]').click()

            cy.get('[data-testid="navigation-menu-links"]').should('be.visible')
            cy.get('[data-testid="logout-mobile"]').should('be.visible')

            cy.get('[data-testid="navigation-menu-link-standings"]').click()

            cy.location('pathname').should('eq', '/standings')
            cy.get('[data-testid="navigation-menu-button"]').should(
                'have.attr',
                'aria-expanded',
                'false'
            )
        })

        it('should close the menu with Escape and return focus to the button', () => {
            cy.get('[data-testid="navigation-menu-button"]').click()
            cy.get('[data-testid="navigation-menu-links"]').should('be.visible')

            cy.get('body').type('{esc}')

            cy.get('[data-testid="navigation-menu-button"]')
                .should('have.attr', 'aria-expanded', 'false')
                .should('have.focus')
        })

        it('should close the menu when clicking outside', () => {
            cy.get('[data-testid="navigation-menu-button"]').click()
            cy.get('[data-testid="navigation-menu-links"]').should('be.visible')

            cy.get('[data-testid="footer"]').click()

            cy.get('[data-testid="navigation-menu-button"]').should(
                'have.attr',
                'aria-expanded',
                'false'
            )
        })
    })
})
