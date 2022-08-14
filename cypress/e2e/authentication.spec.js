import {funcs} from "../helpers/funcs";
import {sign_in_page} from "../selectors/sign_in_page";
import {sign_up_page} from "../selectors/sign_up_page";
import {account_page} from "../selectors/account_page";

describe('Sign In page UI tests', () => {

    before('Visiting RWA Sign In page', () => {
        cy.visit('/');
        cy.get(sign_in_page.empty_space).click();
    });

    it('Should be possible to see Real World App logo', () => {
        cy.get(sign_in_page.app_logo).should('have.attr', 'xmlns', 'http://www.w3.org/2000/svg').and('be.visible');
    });

    it('Should be possible to see Sign In title', () =>{
        cy.get(sign_in_page.signIn_title).should('be.visible').and('have.text', 'Sign in');
    });

    it('Should be possible to see disabled Sign In button by default', () => {
        cy.get(sign_in_page.signIn_button).should('be.visible').and('have.attr', 'tabindex', '-1').and('have.text', 'Sign In');
    });

    it('Should be possible to see Username label inside the field', () => {
        cy.get(sign_in_page.username_label).should('be.visible').and('have.attr', 'data-shrink','false').and('have.text', 'Username');
    });

    it('Should be possible to enter valid data into Username field', () => {
        cy.get(sign_in_page.username_field).should('be.visible').and('have.attr', 'type', 'text');
        cy.get(sign_in_page.username_field).click().type('Login').should('have.attr', 'aria-invalid', 'false');
        cy.get(sign_in_page.username_label).should('be.visible').and('have.attr', 'data-shrink','true').and('have.text', 'Username');
    });

    it('Should be possible to see validation message when Username field is empty', () => {
        cy.get(sign_in_page.username_field).clear().should('have.attr', 'aria-invalid', 'true');
        cy.get(sign_in_page.username_validation).should('be.visible').and('have.text', 'Username is required');
        cy.get(sign_in_page.username_label).should('be.visible').and('have.attr', 'data-shrink','true').and('have.text', 'Username');
    });

    it('Should be possible to see Password label inside the field', () => {
        cy.get(sign_in_page.password_label).should('be.visible').and('have.attr', 'data-shrink','false').and('have.text', 'Password');
    });

    it('Should be possible to enter valid data into Password field', () => {
        cy.get(sign_in_page.password_field).should('be.visible').and('have.attr', 'type', 'password');
        cy.get(sign_in_page.password_field).click().type('1234').should('have.attr', 'aria-invalid', 'false');
        cy.get(sign_in_page.password_label).should('be.visible').and('have.attr', 'data-shrink','true').and('have.text', 'Password');
    });

    it('Should be possible to see validation message if less than 4 characters is entered into Pwd field', () => {
        cy.get(sign_in_page.password_field).clear().type('123').should('have.attr', 'aria-invalid', 'true');
        cy.get(sign_in_page.password_validation).should('be.visible').and('have.text', 'Password must contain at least 4 characters');
        cy.get(sign_in_page.password_label).should('be.visible').and('have.attr', 'data-shrink','true').and('have.text', 'Password');
    });

    it('Should be possible to see unchecked Remember me checkbox by default', () => {
        cy.get(sign_in_page.rememberMe_checkbox).should('not.be.checked');
    });

    it('Should be possible to see checked Remember me checkbox after clicking on it', () => {
        cy.get(sign_in_page.rememberMe_checkbox).check().should('be.checked');
    });

    it('Should be possible to see "Don\'t have an account? Sign Up" link button', () => {
        cy.get(sign_in_page.signup_btn).should('be.visible').and('have.text', 'Don\'t have an account? Sign Up').and('have.attr', 'href', '/signup');
    });

    it('Should be possible to see Cypress copyright link button and redirect to Cypress homepage', () => {
        cy.get(sign_in_page.cypress_lnk).should('be.visible').and('have.attr', 'href', 'https://cypress.io').click();
    });
});

const userName = funcs.randomUsername();
const firstName = 'FirstName';
const lastName = 'LastName';
const password = 'Temp123!';

describe('Verify Sign Up flow', () => {

    beforeEach('Visiting RWA Sign In page, intercepting users request', () => {
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

describe('Verify Sign In, Onboarding and Log Out flows', () => {
    
    beforeEach('Clearing cookies, visiting RWA Sign In page, intercepting login, logout and graphql requests', () => {
        cy.clearCookies();
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
    });

    it('Should not be possible to Sign In with invalid credentials', () => {
        cy.get(sign_in_page.username_field).type(userName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.password_field).type('1234').should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.signIn_button).should('be.enabled').and('be.visible').click();
        cy.wait('@login').its('response.statusCode').should('eq', 401);
        cy.url().should('include', '/signin');
        cy.get(sign_in_page.invalid_creds_message).should('be.visible').and('have.text', 'Username or password is invalid');
    });

    it('Should not be possible to complete onboarding with invalid data and should show validation messages', () => {
        cy.get(sign_in_page.username_field).type(userName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.password_field).type(password).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.signIn_button).should('be.enabled').and('be.visible').click();
        cy.wait('@login').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/');
        cy.get(account_page.onboarding.next_btn).should('be.visible').and('have.text', 'Next').click();
        cy.get(account_page.onboarding.cba_title).should('be.visible').and('have.text', 'Create Bank Account');
        cy.get(account_page.onboarding.bank_name_field).should('have.attr', 'placeholder', 'Bank Name').and('be.visible').click();
        cy.get(account_page.onboarding.routing_name_field).should('have.attr', 'placeholder', 'Routing Number').and('be.visible').click();
        cy.get(account_page.onboarding.account_number_field).should('have.attr', 'placeholder', 'Account Number').and('be.visible').click();
        cy.get(account_page.onboarding.bank_name_field).click().get(account_page.onboarding.bn_field_validation)
         .should('be.visible').and('have.text', 'Enter a bank name').get(account_page.onboarding.bank_name_field)
         .type('1234').get(account_page.onboarding.bn_field_validation).should('be.visible')
         .and('have.text', 'Must contain at least 5 characters');
        cy.get(account_page.onboarding.rn_field_validation).should('be.visible')
         .and('have.text', 'Enter a valid bank routing number').get(account_page.onboarding.routing_name_field).click().type('12345678')
         .get(account_page.onboarding.rn_field_validation).should('be.visible').and('have.text', 'Must contain a valid routing number')
         .get(account_page.onboarding.routing_name_field).click().type('1234567890').get(account_page.onboarding.rn_field_validation)
         .should('be.visible').and('have.text', 'Must contain a valid routing number');
        cy.get(account_page.onboarding.an_field_validation).should('be.visible').and('have.text', 'Enter a valid bank account number')
         .get(account_page.onboarding.account_number_field).click().type('12345678').get(account_page.onboarding.an_field_validation)
         .should('be.visible').and('have.text', 'Must contain at least 9 digits');
        cy.get(account_page.onboarding.cba_save_btn).should('be.visible').and('be.disabled');
    });

    it('Should be possible to complete onboarding with valid data', () => {
        cy.get(sign_in_page.username_field).type(userName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.password_field).type(password).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.signIn_button).should('be.enabled').and('be.visible').click();
        cy.wait('@login').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/');
        cy.get(account_page.onboarding.next_btn).should('be.visible').and('have.text', 'Next').click();
        cy.get(account_page.onboarding.cba_title).should('be.visible').and('have.text', 'Create Bank Account');
        cy.get(account_page.onboarding.bank_name_field).should('have.attr', 'placeholder', 'Bank Name').and('be.visible')
         .click().type('12345').get(account_page.onboarding.bn_field_validation).should('not.exist');
        cy.get(account_page.onboarding.routing_name_field).should('have.attr', 'placeholder', 'Routing Number').and('be.visible')
         .click().type('123456789').get(account_page.onboarding.rn_field_validation).should('not.exist');
        cy.get(account_page.onboarding.account_number_field).should('have.attr', 'placeholder', 'Account Number').and('be.visible')
         .click().type('123456789').get(account_page.onboarding.an_field_validation).should('not.exist');
        cy.get(account_page.onboarding.cba_save_btn).should('be.visible').and('be.enabled').click();
        cy.wait('@graphql').its('response.statusCode').should('eq', 200);
        cy.get(account_page.onboarding.next_btn).should('have.text', 'Done').click();
        cy.url().should('include', '/');
    });

    it('Should be possible to Log Out from account', () => {
        cy.get(sign_in_page.username_field).type(userName).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.password_field).type(password).should('have.attr', 'aria-invalid', 'false').and('be.visible');
        cy.get(sign_in_page.signIn_button).should('be.enabled').and('be.visible').click();
        cy.wait('@login').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/');
        cy.get(account_page.sidebar_selectors.logout_btn).should('be.visible').and('have.text', 'Logout').click();
        cy.wait('@logout').its('response.statusCode').should('eq', 302);
        cy.url().should('include', '/signin');
    });
});