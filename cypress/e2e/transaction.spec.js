import {account_page} from "../selectors/account_page";
import {funcs} from "../helpers/funcs";

const userName = ['Allie2', 'Giovanna74'];
const password = 's3cret';
const randomMoneyValue = funcs.randomIntNumber();

describe('Verify transactions flow', () => {

    beforeEach('Visit page, login, intecept requests', () => {
        cy.visit('/');
        cy.intercept('GET', '/users').as('users');
        cy.intercept('POST', '/transactions').as('transact');
        cy.intercept('GET', '/transactions/*').as('transactions');
        cy.intercept('GET', '/checkAuth').as('auth');
        cy.intercept('GET', '/users/search*').as('search');
        cy.ui_signin(userName[0], password);
    });

    it('Should not be possible to create a transaction with invalid data and should show error messages', () => {
        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
         .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.contains('Edgar').should('be.visible').click();
        cy.get(account_page.transactions_selectors.note_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Add a note').click();
        cy.get(account_page.transactions_selectors.amount_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Amount').and('have.attr', 'inputmode', 'numeric').click();
        cy.get(account_page.transactions_selectors.amount_validation).should('be.visible')
         .and('have.text', 'Please enter a valid amount');
        cy.get(account_page.transactions_selectors.note_validation).should('be.visible')
         .and('have.text', 'Please enter a note');
        cy.get(account_page.transactions_selectors.amount_fld).should('have.attr', 'aria-invalid', 'true');
        cy.get(account_page.transactions_selectors.note_fld).should('have.attr', 'aria-invalid', 'true');
        cy.get(account_page.transactions_selectors.pay_btn).should('be.visible').and('be.disabled')
        .and('have.text', 'Pay').click({force: true});
        cy.get(account_page.transactions_selectors.trnsct_submitted).should('not.exist');
        cy.get(account_page.transactions_selectors.request_btn).should('be.visible').and('be.disabled')
        .and('have.text', 'Request').click({force: true});
        cy.get(account_page.transactions_selectors.trnsct_submitted).should('not.exist');
    });
    
    it('Should be possible to search for an another user', () => {
        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
         .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.search).should('be.visible')
         .and('have.attr', 'placeholder', 'Search...').and('have.attr', 'type', 'text')
         .click().type('Dev');
        cy.wait('@search').its('response.statusCode').should('eq', 304);
        cy.get(account_page.transactions_selectors.userList).should('be.visible').contains('Devon Becker');
    });

    it('Should be possible to create, submit payment transaction and calculate balance', () => {
        
        let prevBalance, newBalance;
        
        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
         .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible').contains('Edgar').should('be.visible')
        .click();
        cy.get(account_page.transactions_selectors.amount_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Amount').and('have.attr', 'inputmode', 'numeric').click().type(randomMoneyValue);
        cy.get(account_page.transactions_selectors.note_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Add a note').click().type('Note');
        cy.get(account_page.transactions_selectors.balance).should('be.visible').invoke('text')
         .then(x => {
          const removeDollar = x.slice(1);
          const removeComma = (removeDollar.length > 6) ? removeDollar.replace(/,/, '') : removeDollar;
          const textToNumber = parseFloat(removeComma);
          prevBalance = textToNumber;
          return prevBalance;
         });
        cy.get(account_page.transactions_selectors.pay_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Pay').click();
        cy.wait('@transact').its('response.statusCode').should('eq', 200);
        cy.wait('@auth');
        cy.get(account_page.transactions_selectors.trnsct_submitted).should('be.visible')
         .and('have.text', 'Transaction Submitted!');
        cy.get(account_page.transactions_selectors.balance).invoke('text')
         .then(y => {
          const removeDollar = y.slice(1);
          const removeComma = (removeDollar.length > 6) ? removeDollar.replace(/,/, '') : removeDollar;
          const textToNumber = parseFloat(removeComma);
          newBalance = prevBalance - textToNumber;
          return newBalance;
         }).should('eq', randomMoneyValue);
    });

    it('Should be possible to request a payment', () => {
        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
         .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible').contains('Edgar').should('be.visible')
        .click();
        cy.get(account_page.transactions_selectors.amount_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Amount').and('have.attr', 'inputmode', 'numeric').click().type(randomMoneyValue);
        cy.get(account_page.transactions_selectors.note_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Add a note').click().type('Note');
        cy.get(account_page.transactions_selectors.request_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Request').click();
        cy.wait('@transact').its('response.statusCode').should('eq', 200);
        cy.wait('@auth');
        cy.get(account_page.transactions_selectors.trnsct_submitted).should('be.visible')
         .and('have.text', 'Transaction Submitted!');
    });

    it('Should be possible to submit a payment and calculate recievers\'s balance', () => {

        let prevUser1Balance, newUser1Balance, prevUser2Balance, newUser2Balance;

        cy.ui_logout();
        cy.ui_signin(userName[1], password);
        cy.get(account_page.transactions_selectors.balance).should('be.visible').invoke('text')
         .then(x => {
          const removeDollar = x.slice(1);
          const removeComma = (removeDollar.length > 6) ? removeDollar.replace(/,/, '') : removeDollar;
          const textToNumber = parseFloat(removeComma);
          prevUser2Balance = textToNumber;
          return prevUser2Balance;
         });
        cy.ui_logout();
        cy.ui_signin(userName[0], password);
        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
         .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible').contains('Ibrahim').should('be.visible')
         .click();
        cy.get(account_page.transactions_selectors.amount_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Amount').and('have.attr', 'inputmode', 'numeric').click().type(randomMoneyValue);
        cy.get(account_page.transactions_selectors.note_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Add a note').click().type('Note');
        cy.get(account_page.transactions_selectors.balance).should('be.visible').invoke('text')
         .then(i => {
          const removeDollar = i.slice(1);
          const removeComma = (removeDollar.length > 6) ? removeDollar.replace(/,/, '') : removeDollar;
          const textToNumber = parseFloat(removeComma);
          prevUser1Balance = textToNumber;
          return prevUser1Balance;
         });
        cy.get(account_page.transactions_selectors.pay_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Pay').click();
        cy.wait('@transact').its('response.statusCode').should('eq', 200);
        cy.wait('@auth');
        cy.get(account_page.transactions_selectors.trnsct_submitted).should('be.visible')
         .and('have.text', 'Transaction Submitted!');
        cy.get(account_page.transactions_selectors.balance).invoke('text')
         .then(j => {
          const removeDollar = j.slice(1);
          const removeComma = (removeDollar.length > 6) ? removeDollar.replace(/,/, '') : removeDollar;
          const textToNumber = parseFloat(removeComma);
          newUser1Balance = prevUser1Balance - textToNumber;
          return newUser1Balance;
         }).should('eq', randomMoneyValue);
        cy.ui_logout();
        cy.ui_signin(userName[1], password);
        cy.get(account_page.transactions_selectors.balance).invoke('text')
         .then(y => {
          const removeDollar = y.slice(1);
          const removeComma = (removeDollar.length > 6) ? removeDollar.replace(/,/, '') : removeDollar;
          const textToNumber = parseFloat(removeComma);
          newUser2Balance = textToNumber - prevUser2Balance;
          return newUser2Balance;
         }).should('eq', randomMoneyValue);
    });

    it('Should be possible to request money, receive them and balance is calculated', () => {

        let prevUser1Balance, newUser1Balance, prevUser2Balance, newUser2Balance;

        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
         .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible').contains('Ibrahim').should('be.visible')
        .click();
        cy.get(account_page.transactions_selectors.amount_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Amount').and('have.attr', 'inputmode', 'numeric').click().type(randomMoneyValue);
        cy.get(account_page.transactions_selectors.note_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Add a note').click().type('Note');
        cy.get(account_page.transactions_selectors.balance).should('be.visible').invoke('text')
         .then(i => {
         const removeDollar = i.slice(1);
         const removeComma = (removeDollar.length > 6) ? removeDollar.replace(/,/, '') : removeDollar;
         const textToNumber = parseFloat(removeComma);
         prevUser1Balance = textToNumber;
         return prevUser1Balance;
        });
        cy.get(account_page.transactions_selectors.request_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Request').click();
        cy.wait('@transact').its('response.statusCode').should('eq', 200);
        cy.wait('@auth');
        cy.get(account_page.transactions_selectors.trnsct_submitted).should('be.visible')
         .and('have.text', 'Transaction Submitted!');
        cy.ui_logout();
        cy.ui_signin(userName[1], password);
        cy.get(account_page.transactions_selectors.balance).should('be.visible').invoke('text')
         .then(x => {
          const removeDollar = x.slice(1);
          const removeComma = (removeDollar.length > 6) ? removeDollar.replace(/,/, '') : removeDollar;
          const textToNumber = parseFloat(removeComma);
          prevUser2Balance = textToNumber;
          return prevUser2Balance;
         });
        cy.contains('Kaylin Homenick').click({force: true});
        cy.wait('@transactions');
        cy.url().should('include', '/transaction');
        cy.contains('Accept Request').click();
        cy.url().should('include', '/transaction');
        cy.wait('@transactions');
        cy.ui_logout();
        cy.ui_signin(userName[1], password);
        cy.get(account_page.transactions_selectors.balance).invoke('text')
         .then(y => {
          const removeDollar = y.slice(1);
          const removeComma = (removeDollar.length > 6) ? removeDollar.replace(/,/, '') : removeDollar;
          const textToNumber = parseFloat(removeComma);
          newUser2Balance = prevUser2Balance - textToNumber;
          return newUser2Balance;
         }).should('eq', randomMoneyValue);
        cy.ui_logout();
        cy.ui_signin(userName[0], password);
        cy.get(account_page.transactions_selectors.balance).invoke('text')
         .then(j => {
          const removeDollar = j.slice(1);
          const removeComma = (removeDollar.length > 6) ? removeDollar.replace(/,/, '') : removeDollar;
          const textToNumber = parseFloat(removeComma);
          newUser1Balance = textToNumber - prevUser1Balance;
          return newUser1Balance;
         }).should('eq', randomMoneyValue);
    });
});