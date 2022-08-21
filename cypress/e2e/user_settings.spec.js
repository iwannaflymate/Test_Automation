import {account_page} from "../selectors/account_page";
import {user_list} from "../helpers/user_list";

const userName = user_list.userA.userName;
const password = 's3cret';

describe('Verify user settings flow', () => {

    beforeEach('Resetting DB, visiting RWA page, intercepting checkAuth req, signing into account', () => {
        cy.task('db:seed');
        cy.visit('/');
        cy.intercept('GET', '/checkAuth').as('auth');
        cy.ui_signin(userName, password);
    });

    it('Should render the user settings form', () => {

        cy.get(account_page.sidebar_selectors.myaccount_btn).should('be.visible')
         .and('have.text', 'My Account').click();
        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.firstname_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.firstName).and('have.attr', 'type', 'text')
         .and('have.attr', 'required');
        cy.get(account_page.user_settings.lastname_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.lastName).and('have.attr', 'type', 'text')
         .and('have.attr', 'required');
        cy.get(account_page.user_settings.email_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.email).and('have.attr', 'type', 'text')
         .and('have.attr', 'required');
        cy.get(account_page.user_settings.phone_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.phoneNumber).and('have.attr', 'type', 'text')
         .and('have.attr', 'required');
        cy.get(account_page.user_settings.save_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Save').and('have.attr', 'tabindex', 0);
    });

    it('Should display user setting form errors', () => {

        cy.get(account_page.sidebar_selectors.myaccount_btn).should('be.visible')
         .and('have.text', 'My Account').click();
        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.firstname_fld).clear().should('be.visible')
         .and('have.attr', 'placeholder', 'First Name').and('have.attr', 'aria-invalid', 'true');
        cy.get(account_page.user_settings.fn_validation).should('be.visible')
         .and('have.text', 'Enter a first name');
        cy.get(account_page.user_settings.save_btn).should('be.visible').and('be.disabled')
         .and('have.text', 'Save').and('have.attr', 'tabindex', -1).click({force: true});
        
        cy.get(account_page.user_settings.lastname_fld).clear().should('be.visible')
         .and('have.attr', 'placeholder', 'Last Name').and('have.attr', 'aria-invalid', 'true');
        cy.get(account_page.user_settings.ln_validation).should('be.visible')
         .and('have.text', 'Enter a last name');
        cy.get(account_page.user_settings.save_btn).should('be.visible').and('be.disabled')
         .and('have.text', 'Save').and('have.attr', 'tabindex', -1).click({force: true});

        cy.get(account_page.user_settings.email_fld).clear().should('be.visible')
         .and('have.attr', 'placeholder', 'Email').and('have.attr', 'aria-invalid', 'true');
        cy.get(account_page.user_settings.email_validation).should('be.visible')
         .and('have.text', 'Enter an email address');
        cy.get(account_page.user_settings.save_btn).should('be.visible').and('be.disabled')
         .and('have.text', 'Save').and('have.attr', 'tabindex', -1).click({force: true});
        cy.get(account_page.user_settings.email_fld).type('abc@d.').should('be.visible');
        cy.get(account_page.user_settings.email_validation).should('be.visible')
         .and('have.text', 'Must contain a valid email address');
        cy.get(account_page.user_settings.save_btn).should('be.visible').and('be.disabled')
          .and('have.text', 'Save').and('have.attr', 'tabindex', -1).click({force: true});

        cy.get(account_page.user_settings.phone_fld).clear().should('be.visible')
         .and('have.attr', 'placeholder', 'Phone Number').and('have.attr', 'aria-invalid', 'true');
        cy.get(account_page.user_settings.phone_validation).should('be.visible')
         .and('have.text', 'Enter a phone number');
        cy.get(account_page.user_settings.save_btn).should('be.visible').and('be.disabled')
         .and('have.text', 'Save').and('have.attr', 'tabindex', -1).click({force: true});
        cy.get(account_page.user_settings.phone_fld).type('12345').should('be.visible');
        cy.get(account_page.user_settings.phone_validation).should('be.visible')
         .and('have.text', 'Phone number is not valid');
        cy.get(account_page.user_settings.save_btn).should('be.visible').and('be.disabled')
         .and('have.text', 'Save').and('have.attr', 'tabindex', -1).click({force: true});
        
        cy.reload();
        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.firstname_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.firstName);
        cy.get(account_page.user_settings.lastname_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.lastName);
        cy.get(account_page.user_settings.email_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.email);
        cy.get(account_page.user_settings.phone_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.phoneNumber);
    });

    it('User should be able to update all settings in once', () => {

        cy.get(account_page.sidebar_selectors.myaccount_btn).should('be.visible')
         .and('have.text', 'My Account').click();
        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.firstname_fld).should('be.visible').clear();
        cy.get(account_page.user_settings.fn_validation).should('be.visible')
         .and('have.text', 'Enter a first name');
        cy.get(account_page.user_settings.firstname_fld).should('be.visible').type('Donovan')
         .and('have.attr', 'aria-invalid', 'false');
        cy.get(account_page.user_settings.fn_validation).should('not.exist');

        cy.get(account_page.user_settings.lastname_fld).should('be.visible').clear();
        cy.get(account_page.user_settings.ln_validation).should('be.visible')
         .and('have.text', 'Enter a last name');
        cy.get(account_page.user_settings.lastname_fld).should('be.visible').type('Sparrow')
         .and('have.attr', 'aria-invalid', 'false');
        cy.get(account_page.user_settings.ln_validation).should('not.exist');

        cy.get(account_page.user_settings.email_fld).should('be.visible').clear();
        cy.get(account_page.user_settings.email_validation).should('be.visible')
         .and('have.text', 'Enter an email address');
        cy.get(account_page.user_settings.email_fld).should('be.visible').type('test@gmail.com')
         .and('have.attr', 'aria-invalid', 'false');
        cy.get(account_page.user_settings.email_validation).should('not.exist');

        cy.get(account_page.user_settings.phone_fld).should('be.visible').clear();
        cy.get(account_page.user_settings.phone_validation).should('be.visible')
         .and('have.text', 'Enter a phone number');
        cy.get(account_page.user_settings.phone_fld).should('be.visible').type('123456')
         .and('have.attr', 'aria-invalid', 'false');
        cy.get(account_page.user_settings.phone_validation).should('not.exist');
        cy.get(account_page.user_settings.save_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Save').and('have.attr', 'tabindex', 0).click();
        cy.wait('@auth');
        cy.reload();

        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.firstname_fld).should('be.visible')
         .and('have.attr', 'value', 'Donovan');
        cy.get(account_page.user_settings.lastname_fld).should('be.visible')
         .and('have.attr', 'value', 'Sparrow');
        cy.get(account_page.user_settings.email_fld).should('be.visible')
         .and('have.attr', 'value', 'test@gmail.com');
        cy.get(account_page.user_settings.phone_fld).should('be.visible')
         .and('have.attr', 'value', '123456');
    });

    it('User should be able to update first name', () => {

        cy.get(account_page.sidebar_selectors.myaccount_btn).should('be.visible')
         .and('have.text', 'My Account').click();
        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.firstname_fld).should('be.visible').clear();
        cy.get(account_page.user_settings.fn_validation).should('be.visible')
         .and('have.text', 'Enter a first name');
        cy.get(account_page.user_settings.firstname_fld).should('be.visible').type('Donovan')
         .and('have.attr', 'aria-invalid', 'false');
        cy.get(account_page.user_settings.fn_validation).should('not.exist');
        cy.get(account_page.user_settings.save_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Save').and('have.attr', 'tabindex', 0).click();
        cy.wait('@auth');
        cy.reload();

        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.firstname_fld).should('be.visible')
         .and('have.attr', 'value', 'Donovan');
        cy.get(account_page.user_settings.lastname_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.lastName);
        cy.get(account_page.user_settings.email_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.email);
        cy.get(account_page.user_settings.phone_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.phoneNumber);
    });

    it('User should be able to update last name', () => {

        cy.get(account_page.sidebar_selectors.myaccount_btn).should('be.visible')
         .and('have.text', 'My Account').click();
        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.lastname_fld).should('be.visible').clear();
        cy.get(account_page.user_settings.ln_validation).should('be.visible')
         .and('have.text', 'Enter a last name');
        cy.get(account_page.user_settings.lastname_fld).should('be.visible').type('Sparrow')
         .and('have.attr', 'aria-invalid', 'false');
        cy.get(account_page.user_settings.ln_validation).should('not.exist');
        cy.get(account_page.user_settings.save_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Save').and('have.attr', 'tabindex', 0).click();
        cy.wait('@auth');
        cy.reload();

        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.firstname_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.firstName);
        cy.get(account_page.user_settings.lastname_fld).should('be.visible')
         .and('have.attr', 'value', 'Sparrow');
        cy.get(account_page.user_settings.email_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.email);
        cy.get(account_page.user_settings.phone_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.phoneNumber);
    });

    it('User should be able to update email', () => {

        cy.get(account_page.sidebar_selectors.myaccount_btn).should('be.visible')
         .and('have.text', 'My Account').click();
        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.email_fld).should('be.visible').clear();
        cy.get(account_page.user_settings.email_validation).should('be.visible')
         .and('have.text', 'Enter an email address');
        cy.get(account_page.user_settings.email_fld).should('be.visible').type('test@gmail.com')
         .and('have.attr', 'aria-invalid', 'false');
        cy.get(account_page.user_settings.email_validation).should('not.exist');
        cy.get(account_page.user_settings.save_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Save').and('have.attr', 'tabindex', 0).click();
        cy.wait('@auth');
        cy.reload();

        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.firstname_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.firstName);
        cy.get(account_page.user_settings.lastname_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.lastName);
        cy.get(account_page.user_settings.email_fld).should('be.visible')
         .and('have.attr', 'value', 'test@gmail.com');
        cy.get(account_page.user_settings.phone_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.phoneNumber);
    });

    it('User should be able to update phone number', () => {

        cy.get(account_page.sidebar_selectors.myaccount_btn).should('be.visible')
         .and('have.text', 'My Account').click();
        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.phone_fld).should('be.visible').clear();
        cy.get(account_page.user_settings.phone_validation).should('be.visible')
         .and('have.text', 'Enter a phone number');
        cy.get(account_page.user_settings.phone_fld).should('be.visible').type('123456')
         .and('have.attr', 'aria-invalid', 'false');
        cy.get(account_page.user_settings.phone_validation).should('not.exist');
        cy.get(account_page.user_settings.save_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Save').and('have.attr', 'tabindex', 0).click();
        cy.wait('@auth');
        cy.reload();

        cy.url().should('include', '/user/settings');
        cy.contains('User Settings');
        cy.get(account_page.user_settings.firstname_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.firstName);
        cy.get(account_page.user_settings.lastname_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.lastName);
        cy.get(account_page.user_settings.email_fld).should('be.visible')
         .and('have.attr', 'value', user_list.userA.email);
        cy.get(account_page.user_settings.phone_fld).should('be.visible')
         .and('have.attr', 'value', '123456');
    });
})