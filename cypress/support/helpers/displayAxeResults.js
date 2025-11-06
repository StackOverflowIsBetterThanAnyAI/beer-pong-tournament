import { formatWCAGTag } from '../utils/formatWCAGTag'

export const displayAxeResults = (page, results) => {
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
        cy.task('log', `\n===== ${label} (${items.length}) =====`)

        items.forEach((rule) => {
            const wcagRefs =
                (rule.tags || [])
                    .filter((tag) => /^wcag/i.test(tag))
                    .map((tag) => formatWCAGTag(tag))
                    .join(', ') || 'no WCAG reference'

            cy.task('log', `→ Rule: ${rule.id}`)
            cy.task('log', `  Description: ${rule.help}`)
            if (/failed/.test(label)) {
                cy.task('log', `  Impact: ${rule.impact || 'n/a'}`)
            }
            cy.task('log', `  WCAG: ${wcagRefs}`)
            if (/failed/.test(label)) {
                cy.task('log', `  Help: ${rule.helpUrl}`)
            }
        })
    })

    const safeName = page.path.replace(/^\//, '').toLowerCase()
    const reportPath = `cypress/reports/a11y-report-wcag-${
        safeName === '' ? 'homepage' : safeName
    }.json`

    cy.writeFile(reportPath, results)
}
