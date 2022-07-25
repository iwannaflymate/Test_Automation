import {sign_in_page} from "../selectors/sign_in_page";

/// <reference types="cypress" />

describe('Sign In page UI tests', () => {

    before('Visiting RWA Sign In page', () => {
        cy.visit('/')
        cy.get(sign_in_page.empty_space).click()
    })

    it('Should be possible to see Real World App logo', () => {
        cy.get(sign_in_page.app_logo).should('have.attr', 'xmlns', 'http://www.w3.org/2000/svg').and('be.visible')
    })

    it('Should be possible to see Sign In title', () =>{
        cy.get(sign_in_page.signIn_title).should('be.visible').and('have.text', 'Sign in')
    })

    it('Should be possible to see disabled Sign In button by default', () => {
        cy.get(sign_in_page.signIn_button).should('be.visible').and('have.attr', 'tabindex', '-1').and('have.text', 'Sign In')
    })

    it('Should be possible to see Username label inside the field', () => {
        cy.get(sign_in_page.username_label).should('be.visible').and('have.attr', 'data-shrink','false').and('have.text', 'Username')
    })

    it('Should be possible to enter valid data into Username field', () => {
        cy.get(sign_in_page.username_field).should('be.visible').and('have.attr', 'type', 'text')
        cy.get(sign_in_page.username_field).click().type('Login').should('have.attr', 'aria-invalid', 'false')
        cy.get(sign_in_page.username_label).should('be.visible').and('have.attr', 'data-shrink','true').and('have.text', 'Username')
    })

    it('Should be possible to see validation message when Username field is empty', () => {
        cy.get(sign_in_page.username_field).clear().should('have.attr', 'aria-invalid', 'true')
        cy.get(sign_in_page.username_validation).should('be.visible').and('have.text', 'Username is required')
        cy.get(sign_in_page.username_label).should('be.visible').and('have.attr', 'data-shrink','true').and('have.text', 'Username')
    })

    it('Should be possible to see Password label inside the field', () => {
        cy.get(sign_in_page.password_label).should('be.visible').and('have.attr', 'data-shrink','false').and('have.text', 'Password')
    })

    it('Should be possible to enter valid data into Password field', () => {
        cy.get(sign_in_page.password_field).should('be.visible').and('have.attr', 'type', 'password')
        cy.get(sign_in_page.password_field).click().type('1234').should('have.attr', 'aria-invalid', 'false')
        cy.get(sign_in_page.password_label).should('be.visible').and('have.attr', 'data-shrink','true').and('have.text', 'Password')
    })

    it('Should be possible to see validation message if less than 4 characters is entered into Pwd field', () => {
        cy.get(sign_in_page.password_field).clear().type('123').should('have.attr', 'aria-invalid', 'true')
        cy.get(sign_in_page.password_validation).should('be.visible').and('have.text', 'Password must contain at least 4 characters')
        cy.get(sign_in_page.password_label).should('be.visible').and('have.attr', 'data-shrink','true').and('have.text', 'Password')
    })

    it('Should be possible to see unchecked Remember me checkbox by default', () => {
        cy.get(sign_in_page.rememberMe_checkbox).should('not.be.checked')
    })

    it('Should be possible to see checked Remember me checkbox after clicking on it', () => {
        cy.get(sign_in_page.rememberMe_checkbox).check().should('be.checked')
    })

    it('Should be possible to see "Don\'t have an account? Sign Up" link button', () => {
        cy.get(sign_in_page.signup_btn).should('be.visible').and('have.text', 'Don\'t have an account? Sign Up').and('have.attr', 'href', '/signup')
    })

    it('Should be possible to see Cypress copyright link button and redirect to Cypress homepage', () => {
        cy.get(sign_in_page.cypress_lnk).should('be.visible').and('have.attr', 'href', 'https://cypress.io').click()
    })
})