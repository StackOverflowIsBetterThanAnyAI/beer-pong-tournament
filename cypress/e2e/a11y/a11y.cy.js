import { formatWCAGTag } from '../../support/formatWCAGTag'
import { handleAuthentication } from '../../support/handleAuthentication'
import { isGoodStatusCode } from '../../support/isGoodStatusCode'

describe('Accessibility Tests', () => {
    const envPages = Cypress.env('CYPRESS_A11Y_PAGES')
    let pages = []
    if (envPages) {
        pages = JSON.parse(envPages)
    }

    pages?.forEach((page) => {
        it(`WCAG 2.2 accessibility evaluation of ${
            page.path === '/' ? 'Homepage' : page.path
        }`, () => {
            cy.request({
                url: page.path,

                failOnStatusCode: false,
            }).then((response) => {
                const statusCode = response.status

                if (!isGoodStatusCode(statusCode, page.path)) {
                    return
                }

                cy.task(
                    'log',
                    `\n\n===== WCAG 2.2 accessibility evaluation of ${
                        page.path === '/' ? 'Homepage' : page.path
                    } =====`
                )

                if (page.protected) {
                    handleAuthentication(page)
                }

                cy.visit(page.path)
                cy.injectAxe()

                const safeName = page.path.replace(/^\//, '').toLowerCase()
                const reportPath = `cypress/reports/a11y-report-wcag-${
                    safeName === '' ? 'homepage' : safeName
                }.json`

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

                        return axe.run(options).then((results) => {
                            const categories = [
                                { key: 'violations', label: `❌ failed` },
                                { key: 'passes', label: `✅ passed` },
                                { key: 'incomplete', label: `⚠️  incomplete` },
                                {
                                    key: 'inapplicable',
                                    label: `⏭️  inapplicable`,
                                },
                            ]

                            const pageViolations =
                                results?.violations?.length || 0

                            categories.forEach(({ key, label }) => {
                                const items = results[key] || []
                                cy.task(
                                    'log',
                                    `\n===== ${label} (${items.length}) =====`
                                )

                                items.forEach((rule) => {
                                    const wcagRefs =
                                        (rule.tags || [])
                                            .filter((tag) => /^wcag/i.test(tag))
                                            .map((tag) => formatWCAGTag(tag))
                                            .join(', ') || 'no WCAG reference'

                                    cy.task('log', `→ Rule: ${rule.id}`)
                                    cy.task(
                                        'log',
                                        `  Description: ${rule.help}`
                                    )
                                    if (/failed/.test(label)) {
                                        cy.task(
                                            'log',
                                            `  Impact: ${rule.impact || 'n/a'}`
                                        )
                                    }
                                    cy.task('log', `  WCAG: ${wcagRefs}`)
                                    if (/failed/.test(label)) {
                                        cy.task(
                                            'log',
                                            `  Help: ${rule.helpUrl}`
                                        )
                                    }
                                })
                            })

                            cy.writeFile(reportPath, results)

                            return pageViolations
                        })
                    })
                    .then((pageViolations) => {
                        if (pageViolations) {
                            throw new Error(
                                `\n❌  WCAG violations found on page ${page.path} (${pageViolations} issues)`
                            )
                        } else {
                            cy.task(
                                'log',
                                `\n✅  No accessibility violations found on ${page.path}`
                            )
                        }
                    })
            })
        })
    })
})
