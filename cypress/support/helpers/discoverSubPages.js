import { authenticateUser } from './authenticateUser'

export const discoverSubPages = (homepage) => {
    it('discovers all sub pages', () => {
        const allSubPages = [homepage.path]
        const pagesToVisit = [homepage.path]
        const visitedPages = new Set()

        if (homepage.protected) {
            authenticateUser(homepage)
        }

        const visitNextPage = () => {
            if (!pagesToVisit.length) {
                cy.task(
                    'log',
                    `✅ Discovery complete. Total pages found: ${allSubPages.length}`
                )
                return cy.wrap([...allSubPages])
            }
            cy.task('log', `Pages to visit: ${pagesToVisit.join(', ')}`)

            const page = pagesToVisit.shift()
            visitedPages.add(page)

            cy.visit(page)
            cy.wait(500)

            cy.get('a', { log: false })
                .should(Cypress._.noop)
                .then((links) => {
                    const allLinks = [
                        ...new Set(
                            links
                                .toArray()
                                .map((link) => link.getAttribute('href'))
                                .filter(
                                    (link) =>
                                        link &&
                                        !/^(http|mailto:|tel:|javascript:|#)/i.test(
                                            link
                                        )
                                )
                                .filter((link) => link)
                                .filter((link) => !visitedPages.has(link))
                                .filter((link) => !pagesToVisit.includes(link))
                        ),
                    ]

                    cy.task(
                        'log',
                        `Sub pages found: ${allLinks.join(', ') || 'none'}`
                    )

                    if (allLinks.length) {
                        pagesToVisit.push(...allLinks)
                        allSubPages.push(...allLinks)

                        cy.task(
                            'log',
                            `All pages found: ${allSubPages.join(', ')}`
                        )
                    }
                })
                .then(visitNextPage)
        }
        return visitNextPage()
    })
}
