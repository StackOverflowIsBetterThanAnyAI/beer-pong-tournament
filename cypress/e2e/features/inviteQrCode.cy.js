/// <reference types="cypress" />
import { mockApi, TEAMS, visitLoggedIn } from '../../support/mockApi'

describe('invite QR code', () => {
    beforeEach(() => {
        cy.viewport(1280, 800)
    })

    it('should link to the signup page during the registration phase', () => {
        mockApi({ teams: TEAMS.slice(0, 8) })
        visitLoggedIn('/')

        cy.get('[data-testid="invite-qr-code"]').within(() => {
            cy.contains('Invite your friends')
            cy.get('canvas')
                .should('have.attr', 'role', 'img')
                .should(
                    'have.attr',
                    'aria-label',
                    `QR code linking to the signup page: ${Cypress.config('baseUrl')}/`
                )
                .then(($canvas) => {
                    expect($canvas[0].width).to.equal(512)
                    expect($canvas[0].clientWidth).to.be.lessThan(200)
                })
            cy.get('a').should(
                'have.attr',
                'href',
                `${Cypress.config('baseUrl')}/`
            )
        })
    })

    it('should download the QR code as a PNG', () => {
        mockApi({ teams: TEAMS.slice(0, 8) })
        visitLoggedIn('/')

        cy.window().then((win) => {
            cy.stub(win.HTMLAnchorElement.prototype, 'click')
                .callsFake(function () {
                    win.__download = {
                        filename: this.download,
                        href: this.href,
                    }
                })
                .as('anchorClick')
        })

        cy.get('[data-testid="invite-qr-code-download"]').click()

        cy.get('@anchorClick').should('have.been.calledOnce')
        cy.window()
            .its('__download')
            .should((download) => {
                expect(download.filename).to.equal(
                    'beer-pong-tournament-signup.png'
                )
                expect(download.href).to.match(/^data:image\/png;base64,/)
            })
    })

    it('should not be shown once all places are taken', () => {
        const fullTeams = Array.from({ length: 32 }, (_, i) => ({
            id: i + 1,
            name: `TeamNumber${i + 1}`,
            member_one: `PlayerA${i + 1}`,
            member_two: `PlayerB${i + 1}`,
        }))
        mockApi({ teams: fullTeams })
        visitLoggedIn('/')

        cy.contains('Unfortunately, all places are already taken.')
        cy.get('[data-testid="invite-qr-code"]').should('not.exist')
    })

    it('should not be shown once the tournament has started', () => {
        mockApi({
            groups: [{ id: 1, name: 'Group 1', teams: TEAMS.slice(0, 4) }],
        })
        visitLoggedIn('/')

        cy.contains('Currently, the group stage is underway.')
        cy.get('[data-testid="invite-qr-code"]').should('not.exist')
    })
})
