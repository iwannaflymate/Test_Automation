import {funcs} from "../helpers/funcs";
import {sign_in_page} from "../selectors/sign_in_page";
import {sign_up_page} from "../selectors/sign_up_page";
import {account_page} from "../selectors/account_page";

const userName = funcs.randomUsername();
const password = 'Temp123!';

describe('Verify Bank Account flow', () => {

    before('Prepare test account', () => {
        cy.visit('/');
        cy.ui_signup(userName, password);
        cy.ui_signin(userName, password);
        cy.ui_onboarding();
        cy.ui_logout();
    });

    beforeEach('Intercept GraphQL request and sign into account', () => {
        cy.clearCookies();
        cy.visit('/');
        cy.intercept('POST', '/graphql').as('graphql');
        cy.ui_signin(userName, password);
    })

    it('Should be possible to delete bank account', () => {
        cy.get(account_page.bank_accounts_btn).should('be.visible').and('have.text', 'Bank Accounts').click();
        cy.url().should('include', '/bankaccounts');
        cy.get(account_page.bank_acc_delete_btn).should('be.visible').and('have.text', 'Delete').click();
        cy.wait('@graphql').its('response.statusCode').should('eq', 200);
    });
    
    it('Should not be possible to create Bank Account with invalid data and show validation messages', () => {
        cy.get(account_page.bank_accounts_btn).should('be.visible').and('have.text', 'Bank Accounts').click();
        cy.url().should('include', '/bankaccounts');
        cy.get(account_page.bank_acc_create_btn).should('be.visible').and('have.text', 'Create').click();
        cy.url().should('include', '/bankaccounts/new');
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
    });

    it('Should be possible to create Bank Account with valid data', () => {
        cy.get(account_page.bank_accounts_btn).should('be.visible').and('have.text', 'Bank Accounts').click();
        cy.url().should('include', '/bankaccounts');
        cy.get(account_page.bank_acc_create_btn).should('be.visible').and('have.text', 'Create').click();
        cy.url().should('include', '/bankaccounts/new');
        cy.get(account_page.bank_name_field).should('have.attr', 'placeholder', 'Bank Name').and('be.visible')
         .click().type('12345').get(account_page.bn_field_validation).should('not.exist');
        cy.get(account_page.routing_name_field).should('have.attr', 'placeholder', 'Routing Number').and('be.visible')
         .click().type('123456789').get(account_page.rn_field_validation).should('not.exist');
        cy.get(account_page.account_number_field).should('have.attr', 'placeholder', 'Account Number').and('be.visible')
         .click().type('123456789').get(account_page.an_field_validation).should('not.exist');
        cy.get(account_page.cba_save_btn).should('be.visible').and('be.enabled').click();
        cy.wait('@graphql').its('response.statusCode').should('eq', 200);
        cy.get(account_page.bank_acc_delete_btn).should('be.visible').and('have.text', 'Delete');
    });
});