import { defineConfig } from 'cypress'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
    env: {
        ADMIN_USERNAME: process.env.CYPRESS_ADMIN_USERNAME,
        ADMIN_USERNAME_LOCAL: process.env.CYPRESS_ADMIN_USERNAME_LOCAL,
        ADMIN_PASSWORD: process.env.CYPRESS_ADMIN_PASSWORD,
        ADMIN_PASSWORD_LOCAL: process.env.CYPRESS_ADMIN_PASSWORD_LOCAL,
    },
    e2e: {
        setupNodeEvents(on, config) {
            on('task', {
                log(message) {
                    console.log(message)
                    return null
                },
            })
            config.env = process.env
            return config
        },
        baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5173',
        defaultCommandTimeout: 90000,
    },
})
