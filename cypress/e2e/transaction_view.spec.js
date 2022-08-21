import {account_page} from "../selectors/account_page";
import {user_list} from "../fixtures/user_list";
import {funcs} from "../helpers/funcs";

const userName = [user_list.userA.userName, user_list.userB.userName];
const password = 's3cret';
const randomMoneyValue = funcs.randomIntNumber();

describe('Verify transaction view flow', () => {

    beforeEach('Resetting DB, visiting RWA page, intercepting requests, signing into acc', () => {
        
        cy.task('db:seed');
        cy.visit('/');
        cy.intercept('GET', '/users').as('users');
        cy.intercept('POST', '/transactions').as('transact');
        cy.intercept('GET', '/checkAuth').as('auth');
        cy.intercept('POST', '/likes/*').as('like');
        cy.intercept('POST', '/comments/*').as('comments');
        cy.ui_signin(userName[0], password);
    });

    it('transactions navigation tabs should be hidden on a transaction view page', () => {
        
        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
        .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.homepage_selectors.everyone_sec).should('not.exist');
        cy.get(account_page.homepage_selectors.friends_sec).should('not.exist');
        cy.get(account_page.homepage_selectors.mine_sec).should('not.exist');
    });

    it('User should be able to like a transaction', () => {
        
        let prevLike, currentLike;
        
        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
        .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible')
         .contains(`${user_list.userB.firstName} ${user_list.userB.lastName}`).should('be.visible').click();
        cy.get(account_page.transactions_selectors.amount_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Amount').and('have.attr', 'inputmode', 'numeric').click().type(randomMoneyValue);
        cy.get(account_page.transactions_selectors.note_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Add a note').click().type('Note');
        cy.get(account_page.transactions_selectors.pay_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Pay').click();
        cy.wait('@transact').its('response.statusCode').should('eq', 200);
        cy.wait('@auth');
        cy.get(account_page.transactions_selectors.trnsct_submitted).should('be.visible')
         .and('have.text', 'Transaction Submitted!');
        cy.ui_logout();

        cy.ui_signin(userName[1], password);
        cy.contains(`${user_list.userA.firstName} ${user_list.userA.lastName} paid ${user_list.userB.firstName} ${user_list.userB.lastName}`)
         .click({force: true});
        cy.get(account_page.transaction_detail_selectors.transactionDetail_header).should('be.visible')
         .and('have.text', 'Transaction Detail');
        cy.get(account_page.transaction_detail_selectors.like_counter).should('be.visible').invoke('text')
         .then(a => {
            const likeToNumberPrev = Number(a);
            prevLike = likeToNumberPrev;
            return prevLike;
         });
        cy.get(account_page.transaction_detail_selectors.like_btn).should('be.visible').and('be.enabled').click();
        cy.wait("@like").its("response.statusCode").should("eq", 200);
        cy.get(account_page.transaction_detail_selectors.like_btn).should('be.visible').and('be.disabled');
        cy.get(account_page.transaction_detail_selectors.like_counter).should('be.visible').invoke('text')
         .then(b => {
            const likeToNumberCurrent = Number(b);
            currentLike = prevLike + likeToNumberCurrent;
            return currentLike;
         }).should('eq', 1);
    });

    it('User should be able to comment on a transaction', () => {

        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
        .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible')
         .contains(`${user_list.userB.firstName} ${user_list.userB.lastName}`).should('be.visible').click();
        cy.get(account_page.transactions_selectors.amount_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Amount').and('have.attr', 'inputmode', 'numeric').click().type(randomMoneyValue);
        cy.get(account_page.transactions_selectors.note_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Add a note').click().type('Note');
        cy.get(account_page.transactions_selectors.pay_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Pay').click();
        cy.wait('@transact').its('response.statusCode').should('eq', 200);
        cy.wait('@auth');
        cy.get(account_page.transactions_selectors.trnsct_submitted).should('be.visible')
         .and('have.text', 'Transaction Submitted!');
        cy.ui_logout();

        cy.ui_signin(userName[1], password);
        cy.contains(`${user_list.userA.firstName} ${user_list.userA.lastName} paid ${user_list.userB.firstName} ${user_list.userB.lastName}`)
         .click({force: true});
        cy.get(account_page.transaction_detail_selectors.transactionDetail_header).should('be.visible')
         .and('have.text', 'Transaction Detail');
        cy.get(account_page.transaction_detail_selectors.comment_input_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Write a comment...').click().type('Comment{enter}');
        cy.wait("@comments").its("response.statusCode").should("eq", 200);
        cy.get(account_page.transaction_detail_selectors.comments_list).should('be.visible')
         .and('have.text', 'Comment');
        cy.ui_logout();
    });

    it('User should be able to accept a transaction request', () => {

        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
        .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible')
         .contains(`${user_list.userB.firstName} ${user_list.userB.lastName}`).should('be.visible').click();
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
        cy.ui_logout();

        cy.ui_signin(userName[1], password);
        cy.contains(`${user_list.userA.firstName} ${user_list.userA.lastName} requested ${user_list.userB.firstName} ${user_list.userB.lastName}`)
         .click({force: true});
        cy.get(account_page.transaction_detail_selectors.transactionDetail_header).should('be.visible')
         .and('have.text', 'Transaction Detail');
        cy.get(account_page.transaction_detail_selectors.accept_req_btn).should('be.visible')
         .and('have.text', 'Accept Request').click();
    });

    it('User should be able to reject a transaction request', () => {

        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
        .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible')
         .contains(`${user_list.userB.firstName} ${user_list.userB.lastName}`).should('be.visible').click();
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
        cy.ui_logout();

        cy.ui_signin(userName[1], password);
        cy.contains(`${user_list.userA.firstName} ${user_list.userA.lastName} requested ${user_list.userB.firstName} ${user_list.userB.lastName}`)
         .click({force: true});
        cy.get(account_page.transaction_detail_selectors.transactionDetail_header).should('be.visible')
         .and('have.text', 'Transaction Detail');
        cy.get(account_page.transaction_detail_selectors.reject_req_btn).should('be.visible')
         .and('have.text', 'Reject Request').click();
    });

    it('Accept/reject buttons shouldn\'t exist on completed request', () => {

        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
        .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible')
         .contains(`${user_list.userB.firstName} ${user_list.userB.lastName}`).should('be.visible').click();
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
        cy.ui_logout();

        cy.ui_signin(userName[1], password);
        cy.contains(`${user_list.userA.firstName} ${user_list.userA.lastName} requested ${user_list.userB.firstName} ${user_list.userB.lastName}`)
         .click({force: true});
        cy.get(account_page.transaction_detail_selectors.transactionDetail_header).should('be.visible')
         .and('have.text', 'Transaction Detail');
        cy.get(account_page.transaction_detail_selectors.accept_req_btn).should('be.visible')
         .and('have.text', 'Accept Request').click();
        cy.get(account_page.transaction_detail_selectors.accept_req_btn).should('not.exist');
        cy.get(account_page.transaction_detail_selectors.reject_req_btn).should('not.exist');
        cy.ui_logout();

        cy.ui_signin(userName[0], password);
        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
        .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible')
         .contains(`${user_list.userB.firstName} ${user_list.userB.lastName}`).should('be.visible').click();
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
        cy.ui_logout();

        cy.ui_signin(userName[1], password);
        cy.contains(`${user_list.userA.firstName} ${user_list.userA.lastName} requested ${user_list.userB.firstName} ${user_list.userB.lastName}`)
         .click({force: true});
        cy.get(account_page.transaction_detail_selectors.transactionDetail_header).should('be.visible')
         .and('have.text', 'Transaction Detail');
        cy.get(account_page.transaction_detail_selectors.reject_req_btn).should('be.visible')
         .and('have.text', 'Reject Request').click();
        cy.get(account_page.transaction_detail_selectors.accept_req_btn).should('not.exist');
        cy.get(account_page.transaction_detail_selectors.reject_req_btn).should('not.exist');
    });
})