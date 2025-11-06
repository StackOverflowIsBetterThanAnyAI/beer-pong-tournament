export const applyStorageData = (page) => {
    if (page?.storage?.data) {
        return cy.window().then((win) => {
            try {
                const storage =
                    page.storage?.type === 'sessionStorage'
                        ? win.sessionStorage
                        : win.localStorage

                Object.entries(page.storage.data).forEach(([key, value]) => {
                    const existingKey = storage.getItem(key)
                    if (existingKey) {
                        try {
                            const parsed = JSON.parse(existingKey)
                            const merged = { ...parsed, ...value }
                            storage.setItem(key, JSON.stringify(merged))
                        } catch {
                            storage.setItem(key, JSON.stringify(value))
                        }
                    } else {
                        storage.setItem(key, JSON.stringify(value))
                    }
                })

                cy.task(
                    'log',
                    `\n💾  Applied custom ${
                        page.storage?.type || 'localStorage'
                    } data for ${page.path}`
                )
            } catch (error) {
                cy.task(
                    'log',
                    `\n🚨  Failed to apply storage data: ${error.message}`
                )
            }
        })
    }
}
