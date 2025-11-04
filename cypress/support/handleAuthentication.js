export const handleAuthentication = (page) => {
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
