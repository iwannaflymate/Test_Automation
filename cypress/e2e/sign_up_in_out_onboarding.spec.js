import {sign_in_page} from "../selectors/sign_in_page";
import {sign_up_page} from "../selectors/sign_up_page";
import {account_page} from "../selectors/account_page";

/// <reference types="cypress" />

const userName = sign_up_page.randomUsername();
const firstName = 'FirstName';
const lastName = 'LastName';
const password = 'Temp123!';

describe('Verify Sign Up flow', () => {

    beforeEach('Visiting RWA Sign In page', () => {
        cy.visit('/');
        cy.intercept('POST', '/users').as('signup_submit');
    });

    it('Should be possible to Sign Up with valid credentials', () => {
        cy.get(sign_in_page.signup_btn).should('have.text', 'Don\'t have an account? Sign Up').and('be.visible').click();
        cy.url().should('include', '/signup');
        cy.get(sign_up_page.firstName_field).type(firstName).should('have.attr', 'aria-invalid', 'false')
         .and('be.visible').get(sign_up_page.fn_validation).should('not.exist');
        cy.get(sign_up_page.lastname_field).click().type(lastName).should('have.attr', 'aria-invalid', 'false')
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

    it('Should not be possible to Sign Up with invalid credentials and should show validation messages', () => {
        cy.get(sign_in_page.signup_btn).should('have.text', 'Don\'t have an account? Sign Up').and('be.visible').click();
        cy.url().should('include', '/signup');
        cy.get(sign_up_page.lastname_field).click().get(sign_in_page.username_field).click().get(sign_in_page.password_field)
         .click().get(sign_up_page.confirm_pwd_field).click().get(sign_in_page.empty_space).click();
        cy.get(sign_up_page.fn_validation).should('be.visible').and('have.text', 'First Name is required');
        cy.get(sign_up_page.ln_validation).should('be.visible').and('have.text', 'Last Name is required');
        cy.get(sign_in_page.username_validation).should('be.visible').and('have.text', 'Username is required');
        cy.get(sign_in_page.password_validation).should('be.visible').and('have.text', 'Enter your password');
        cy.get(sign_up_page.cp_validation).should('be.visible').and('have.text', 'Confirm your password');
        cy.get(sign_up_page.firstName_field).should('be.visible').and('have.attr', 'aria-invalid', 'true');
        cy.get(sign_up_page.lastname_field).should('be.visible').and('have.attr', 'aria-invalid', 'true');
        cy.get(sign_in_page.username_field).should('be.visible').and('have.attr', 'aria-invalid', 'true');
        cy.get(sign_in_page.password_field).should('be.visible').and('have.attr', 'aria-invalid', 'true');
        cy.get(sign_up_page.confirm_pwd_field).should('be.visible').and('have.attr', 'aria-invalid', 'true');
        cy.get(sign_up_page.signup_acc_btn).should('be.visible').and('be.disabled').click({force: true});
        cy.url().should('include', '/signup');
        cy.get(sign_up_page.firstName_field).type(firstName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_up_page.lastname_field).click().type(lastName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.username_field).click().type(userName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.password_field).click().type('111').should('be.visible')
         .and('have.attr', 'aria-invalid', 'true').get(sign_in_page.password_validation).should('be.visible')
         .and('have.text', 'Password must contain at least 4 characters');
        cy.get(sign_up_page.confirm_pwd_field).click().type('1111').should('be.visible')
         .and('have.attr', 'aria-invalid', 'true').get(sign_up_page.cp_validation).should('be.visible')
         .and('have.text', 'Password does not match');
        cy.get(sign_up_page.signup_acc_btn).should('be.visible').and('be.disabled').click({force: true});
        cy.url().should('include', '/signup');
    })
});

    describe('Verify Sign In, Bank Account and Log Out flows', () => {
    
    beforeEach('Visiting RWA Sign In page', () => {
        cy.visit('/');
        cy.intercept('POST', '/login').as('login');
        cy.intercept('POST', '/logout').as('logout');
        cy.intercept('POST', '/graphql').as('graphql')
        });
    
    it('Should be possible to Sign In with valid credentials', () => {
        cy.get(sign_in_page.username_field).type(userName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.password_field).type(password).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.signIn_button).should('be.enabled').and('be.visible').click();
        cy.wait('@login').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/');
        cy.clearCookies();
    });

    it('Should not be possible to Sign In with invalid credentials', () => {
        cy.get(sign_in_page.username_field).type(userName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.password_field).type('1234').should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.signIn_button).should('be.enabled').and('be.visible').click();
        cy.wait('@login').its('response.statusCode').should('eq', 401);
        cy.url().should('include', '/signin');
        cy.get(sign_in_page.invalid_creds_message).should('be.visible').and('have.text', 'Username or password is invalid');
        cy.clearCookies();
    })

    it('Should not be possible to create bank account with invalid data and should show validation messages', () => {
        cy.get(sign_in_page.username_field).type(userName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.password_field).type(password).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.signIn_button).should('be.enabled').and('be.visible').click();
        cy.wait('@login').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/');
        cy.get(account_page.next_btn).should('be.visible').and('have.text', 'Next').click();
        cy.get(account_page.cba_title).should('be.visible').and('have.text', 'Create Bank Account');
        cy.get(account_page.bank_name_field).should('have.attr', 'placeholder', 'Bank Name').and('be.visible').click();
        cy.get(account_page.routing_name_field).should('have.attr', 'placeholder', 'Routing Number').and('be.visible').click();
        cy.get(account_page.account_number_field).should('have.attr', 'placeholder', 'Account Number').and('be.visible').click();
        cy.get(account_page.bank_name_field).click().get(account_page.bn_field_validation).should('be.visible')
         .and('have.text', 'Enter a bank name').get(account_page.bank_name_field).type('1234')
         .get(account_page.bn_field_validation).should('be.visible').and('have.text', 'Must contain at least 5 characters');
        cy.get(account_page.rn_field_validation).should('be.visible').and('have.text', 'Enter a valid bank routing number')
         .get(account_page.routing_name_field).click().type('12345678').get(account_page.rn_field_validation)
         .should('be.visible').and('have.text', 'Must contain a valid routing number').get(account_page.routing_name_field)
         .click().type('1234567890').get(account_page.rn_field_validation).should('be.visible')
         .and('have.text', 'Must contain a valid routing number');
        cy.get(account_page.an_field_validation).should('be.visible').and('have.text', 'Enter a valid bank account number')
         .get(account_page.account_number_field).click().type('12345678').get(account_page.an_field_validation)
         .should('be.visible').and('have.text', 'Must contain at least 9 digits');
        cy.get(account_page.cba_save_btn).should('be.visible').and('be.disabled');
        cy.clearCookies();
    });

    it('Should be possible to create bank account with valid credentials', () => {
        cy.get(sign_in_page.username_field).type(userName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.password_field).type(password).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.signIn_button).should('be.enabled').and('be.visible').click();
        cy.wait('@login').its('response.statusCode').should('eq', 200);
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
        cy.clearCookies();
    });

    it('Should be possible to delete bank account', () => {
        cy.get(sign_in_page.username_field).type(userName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.password_field).type(password).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.signIn_button).should('be.enabled').and('be.visible').click();
        cy.wait('@login').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/');
        cy.get(account_page.bank_accounts_btn).should('be.visible').and('have.text', 'Bank Accounts').click();
        cy.url().should('include', '/bankaccounts');
        cy.get(account_page.bank_acc_delete_btn).should('be.visible').and('have.text', 'Delete').click();
        cy.wait('@graphql').its('response.statusCode').should('eq', 200);
        cy.clearCookies();
    });

    it('Should be possible to Log Out from account', () => {
        cy.get(sign_in_page.username_field).type(userName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.password_field).type(password).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.signIn_button).should('be.enabled').and('be.visible').click();
        cy.wait('@login').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/');
        cy.get(account_page.logout_btn).should('be.visible').and('have.text', 'Logout').click();
        cy.wait('@logout').its('response.statusCode').should('eq', 302);
        cy.url().should('include', '/signin');
    });
});