import { testPageForAccessibility } from './../../support/core/testPageForAccessibility'

describe('Accessibility Tests', () => {
    let pages = []
    try {
        pages = JSON.parse(Cypress.env('CYPRESS_A11Y_PAGES') || '[]')
    } catch (error) {
        cy.task(
            'log',
            `\n🚨  Invalid format for CYPRESS_A11Y_PAGES: ${error.message}`
        )
    }

    pages?.forEach((page) => {
        it(`WCAG 2.2 accessibility evaluation of ${
            page.path === '/' ? 'Homepage' : page.path
        }`, () => {
            testPageForAccessibility(page)
        })
    })
})
