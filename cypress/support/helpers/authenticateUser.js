export const authenticateUser = (page) => {
    cy.visit(page.path)

    cy.task(
        'log',
        `\n🔑  Authentication required: Attempting to log in for ${page.path}`
    )

    const authUrl = page?.authUrl || Cypress.env('CYPRESS_A11Y_AUTH_URL') || ''
    let authBody = {}
    try {
        authBody =
            page?.authBody ||
            JSON.parse(Cypress.env('CYPRESS_A11Y_AUTH_BODY') || '{}')
    } catch (e) {
        cy.task(
            'log',
            `\n🚨  Invalid format for CYPRESS_A11Y_AUTH_BODY: ${e.message}`
        )
    }

    cy.request({
        url: authUrl,
        failOnStatusCode: false,
        timeout: 60000,
        method: 'POST',
        body: authBody,
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
                const storage =
                    Cypress.env('CYPRESS_A11Y_STORAGE') === 'sessionStorage'
                        ? win.sessionStorage
                        : win.localStorage
                storage.setItem(
                    Cypress.env('CYPRESS_A11Y_STORAGE_KEY'),
                    JSON.stringify(tokenObject)
                )
            })

            cy.task('log', `\n✅  Authentication successful.`)
        }
    })
}
