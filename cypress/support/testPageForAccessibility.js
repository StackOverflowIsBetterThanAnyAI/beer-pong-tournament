import { applyStorageData } from './applyStorageData'
import { authenticateUser } from './authenticateUser'
import { displayAxeResults } from './displayAxeResults'

export const testPageForAccessibility = (page) => {
    cy.request({
        url: page.path,
        failOnStatusCode: false,
    }).then((response) => {
        try {
            const statusCode = response.status
            if (statusCode >= 400) {
                throw new Error(
                    `⚠️  Skipping Accessibility Check: ${page.path} failed to load (Status: ${statusCode}).`
                )
            }

            cy.task(
                'log',
                `\n\n===== WCAG 2.2 accessibility evaluation of ${
                    page.path === '/' ? 'Homepage' : page.path
                } =====`
            )

            if (page.protected) {
                authenticateUser(page)
            }

            cy.visit(page.path)
            applyStorageData(page)
            cy.injectAxe()

            cy.window()
                .its('axe')
                .then((axe) => {
                    const options = {
                        runOnly: {
                            type: 'tag',
                            values: [
                                'wcag2a',
                                'wcag2aa',
                                'wcag21a',
                                'wcag21aa',
                                'wcag22a',
                                'wcag22aa',
                            ],
                        },
                    }

                    return axe
                        .run(options)
                        .then((results) => {
                            displayAxeResults(page, results)

                            const pageViolations =
                                results?.violations?.length || 0
                            return pageViolations
                        })
                        .catch((error) => {
                            throw new Error(
                                `⚠️  Axe analysis failed for ${page.path}: ${error.message}`
                            )
                        })
                })
                .then((pageViolations) => {
                    if (pageViolations) {
                        throw new Error(
                            `\n❌  ${pageViolations} WCAG violations found on page ${page.path}`
                        )
                    } else {
                        cy.task(
                            'log',
                            `\n✅  No accessibility violations found on ${page.path}`
                        )
                    }
                })
        } catch (error) {
            cy.task(
                'log',
                `\n❌  Error testing page ${page.path}: ${err.message}`
            )
        }
    })
}
