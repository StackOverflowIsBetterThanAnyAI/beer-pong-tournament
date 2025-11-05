import { testPageForAccessibility } from '../../support/testPageForAccessibility'

describe('Accessibility Tests', () => {
    const pages = JSON.parse(Cypress.env('CYPRESS_A11Y_PAGES') || '[]')

    pages?.forEach((page) => {
        it(`WCAG 2.2 accessibility evaluation of ${
            page.path === '/' ? 'Homepage' : page.path
        }`, () => {
            testPageForAccessibility(page)
        })
    })
})
