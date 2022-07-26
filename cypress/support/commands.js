import {sign_in_page} from "../selectors/sign_in_page";
import {sign_up_page} from "../selectors/sign_up_page";
import {account_page} from "../selectors/account_page";

Cypress.Commands.add('ui_signup', (userName, password) => {
    cy.intercept('POST', '/users').as('signup_submit');
    cy.get(sign_in_page.signup_btn).should('have.text', 'Don\'t have an account? Sign Up').and('be.visible').click();
    cy.url().should('include', '/signup');
    cy.get(sign_up_page.firstName_field).type('FirstName').should('have.attr', 'aria-invalid', 'false')
     .and('be.visible').get(sign_up_page.fn_validation).should('not.exist');
    cy.get(sign_up_page.lastname_field).click().type('LastName').should('have.attr', 'aria-invalid', 'false')
     .and('be.visible').get(sign_up_page.ln_validation).should('not.exist');
    cy.get(sign_in_page.username_field).click().type(userName).should('have.attr', 'aria-invalid', 'false')
     .and('be.visible').get(sign_in_page.username_validation).should('not.exist');
    cy.get(sign_in_page.password_field).click().type(password).should('have.attr', 'aria-invalid', 'false')
     .and('be.visible').get(sign_in_page.password_validation).should('not.exist');
    cy.get(sign_up_page.confirm_pwd_field).click().type(password).should('have.attr', 'aria-invalid', 'false')
     .and('be.visible').get(sign_up_page.cp_validation).should('not.exist');
    cy.get(sign_up_page.signup_acc_btn).should('be.enabled').and('be.visible').click();
    cy.wait('@signup_submit').its('response.statusCode').should('eq', 201);
    cy.url().should('include', '/signin');
});

Cypress.Commands.add('ui_signin', (userName, password) => {
    cy.intercept('POST', '/login').as('login');
    cy.get(sign_in_page.username_field).type(userName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
    cy.get(sign_in_page.password_field).type(password).should('have.attr', 'aria-invalid', 'false').and('be.visible');
    cy.get(sign_in_page.signIn_button).should('be.enabled').and('be.visible').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/');
});

Cypress.Commands.add('ui_onboarding', () => {
    cy.intercept('POST', '/graphql').as('graphql');
    cy.url().should('include', '/');
    cy.get(account_page.next_btn).should('be.visible').and('have.text', 'Next').click();
    cy.get(account_page.cba_title).should('be.visible').and('have.text', 'Create Bank Account');
    cy.get(account_page.bank_name_field).should('have.attr', 'placeholder', 'Bank Name').and('be.visible')
     .click().type('12345').get(account_page.bn_field_validation).should('not.exist');
    cy.get(account_page.routing_name_field).should('have.attr', 'placeholder', 'Routing Number').and('be.visible')
     .click().type('123456789').get(account_page.rn_field_validation).should('not.exist');
    cy.get(account_page.account_number_field).should('have.attr', 'placeholder', 'Account Number').and('be.visible')
     .click().type('123456789').get(account_page.an_field_validation).should('not.exist');
    cy.get(account_page.cba_save_btn).should('be.visible').and('be.enabled').click();
    cy.wait('@graphql').its('response.statusCode').should('eq', 200);
    cy.get(account_page.next_btn).should('have.text', 'Done').click();
    cy.url().should('include', '/');
});

Cypress.Commands.add('ui_logout', () => {
    cy.intercept('POST', '/logout').as('logout');
    cy.get(account_page.logout_btn).should('be.visible').and('have.text', 'Logout').click();
    cy.wait('@logout').its('response.statusCode').should('eq', 302);
    cy.url().should('include', '/signin');
});