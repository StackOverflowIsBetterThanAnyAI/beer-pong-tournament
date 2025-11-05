export const applyStorageData = (page) => {
    if (page?.storage?.data) {
        cy.window().then((win) => {
            const storage =
                page.storage?.type === 'sessionStorage'
                    ? win.sessionStorage
                    : win.localStorage

            Object.entries(page.storage.data).forEach(([key, value]) => {
                storage.setItem(key, JSON.stringify(value))
            })
        })

        cy.task(
            'log',
            `\n💾  Applied custom ${
                page.storage?.type || 'localStorage'
            } data for ${page.path}`
        )
    }
}
