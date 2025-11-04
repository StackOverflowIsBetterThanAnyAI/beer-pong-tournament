import { formatWCAGTag } from '../../support/formatWCAGTag'
import { isGoodStatusCode } from '../../support/isGoodStatusCode'

describe('Accessibility Tests', () => {
    const pages = [
        { path: '/', protected: false },
        { path: '/register-team', protected: true },
        { path: '/teams', protected: true },
        { path: '/groups', protected: true },
        { path: '/schedule', protected: true },
        { path: '/standings', protected: true },
        { path: '/knockout-stage', protected: true },
    ]

    pages.forEach((page) => {
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
                    cy.visit(page.path)

                    cy.task(
                        'log',
                        `\n🔑  Authentication required: Attempting to log in for ${page.path}`
                    )

                    cy.request({
                        url: Cypress.env('CYPRESS_A11Y_AUTH_URL'),
                        failOnStatusCode: false,
                        timeout: 60000,
                        method: 'POST',
                        body: {
                            username: Cypress.env('CYPRESS_A11Y_USERNAME'),
                            password: Cypress.env('CYPRESS_A11Y_PASSWORD'),
                        },
                    }).then((authResponse) => {
                        if (authResponse.status !== 200) {
                            cy.task(
                                'log',
                                `\n❌  Authentication failed (status ${authResponse.status}).`
                            )
                        } else {
                            const tokenObject = {
                                access: authResponse.body.access,
                                isloggedin: true,
                            }

                            cy.window().then((win) => {
                                if (
                                    Cypress.env('CYPRESS_A11Y_STORAGE') ===
                                    'sessionStorage'
                                ) {
                                    win.sessionStorage.setItem(
                                        'beer-pong-tournament',
                                        JSON.stringify(tokenObject)
                                    )
                                } else {
                                    win.localStorage.setItem(
                                        'beer-pong-tournament',
                                        JSON.stringify(tokenObject)
                                    )
                                }
                            })

                            cy.task('log', `\n✅  Authentication successful.`)
                        }
                    })
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
                                    cy.task(
                                        'log',
                                        `  Impact: ${rule.impact || 'n/a'}`
                                    )
                                    cy.task('log', `  WCAG: ${wcagRefs}`)
                                    cy.task('log', `  Help: ${rule.helpUrl}`)
                                })
                            })

                            cy.writeFile(reportPath, results)
                        })
                    })
            })
        })
    })
})
