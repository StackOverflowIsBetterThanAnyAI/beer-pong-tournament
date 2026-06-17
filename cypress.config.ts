import { defineConfig } from 'cypress'

export default defineConfig({
    e2e: {
        setupNodeEvents(_on, config) {
            return config
        },
        baseUrl: 'http://localhost:5173',
        defaultCommandTimeout: 90000,
    },
})
