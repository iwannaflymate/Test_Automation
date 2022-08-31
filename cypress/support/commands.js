import {sign_in_page} from "../selectors/sign_in_page";
import {sign_up_page} from "../selectors/sign_up_page";
import {account_page} from "../selectors/account_page";

const APIurl = 'http://localhost:3001';

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
    cy.get(account_page.onboarding.next_btn).should('be.visible').and('have.text', 'Next').click();
    cy.get(account_page.onboarding.cba_title).should('be.visible').and('have.text', 'Create Bank Account');
    cy.get(account_page.onboarding.bank_name_field).should('have.attr', 'placeholder', 'Bank Name').and('be.visible')
     .click().type('12345').get(account_page.onboarding.bn_field_validation).should('not.exist');
    cy.get(account_page.onboarding.routing_name_field).should('have.attr', 'placeholder', 'Routing Number').and('be.visible')
     .click().type('123456789').get(account_page.rn_field_validation).should('not.exist');
    cy.get(account_page.onboarding.account_number_field).should('have.attr', 'placeholder', 'Account Number').and('be.visible')
     .click().type('123456789').get(account_page.onboarding.an_field_validation).should('not.exist');
    cy.get(account_page.onboarding.cba_save_btn).should('be.visible').and('be.enabled').click();
    cy.wait('@graphql').its('response.statusCode').should('eq', 200);
    cy.get(account_page.onboarding.next_btn).should('have.text', 'Done').click();
    cy.url().should('include', '/');
});

Cypress.Commands.add('ui_logout', () => {
    cy.intercept('POST', '/logout').as('logout');
    cy.get(account_page.sidebar_selectors.logout_btn).should('be.visible').and('have.text', 'Logout').click();
    cy.wait('@logout').its('response.statusCode').should('eq', 302);
    cy.url().should('include', '/signin');
});

Cypress.Commands.add('api_login', (userName, password) => {
    cy.request('POST', `${APIurl}/login`, {
      username: userName,
      password: password,
    });
  });
  
  Cypress.Commands.add('api_signup', (userName, password) => {
    cy.request('POST', `${APIurl}/users`, {
      firstName: 'Big',
      lastName: 'Smoke',
      username: userName,
      password: password,
      confirmPassword: password,
    });
  });
  
  Cypress.Commands.add('api_logout', () => {
    cy.request('POST', `${APIurl}/logout`);
  });

  Cypress.Commands.add(
    'create_ba_api',
    (bankName, accountNumber, routingNumber) => {
      cy.request('POST', `${APIurl}/bankAccounts`, {
        bankName,
        accountNumber,
        routingNumber,
      });
    }
  );
  
  Cypress.Commands.add('delete_ba_api', (bankAccountId) => {
    cy.request('DELETE', `${APIurl}/bankAccounts/${bankAccountId}`);
  });
  
  Cypress.Commands.add('add_contact_api', (userId) => {
    cy.request('POST', `${APIurl}/contacts`, {
      contactUserId: userId,
    });
  });
  
  Cypress.Commands.add('del_contact_api', (userId) => {
    cy.request('DELETE', `${APIurl}/contacts/${userId}`);
  });