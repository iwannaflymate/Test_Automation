import {account_page} from "../selectors/account_page";
import {user_list} from "../fixtures/user_list";
import {funcs} from "../helpers/funcs";

const userName = [user_list.userA.userName, user_list.userB.userName, user_list.userC.userName];
const password = 's3cret';
const randomMoneyValue = funcs.randomNotAnullNumber();

describe('Verify notifications flow', () => {
    beforeEach('Reset DB, visit RWA page, inercept requests, sign in', () => {
        cy.task('db:seed');
        cy.visit('/');
        cy.intercept('GET', '/users').as('users');
        cy.intercept('POST', '/transactions').as('transact');
        cy.intercept('GET', '/notifications').as('notifs');
        cy.intercept('GET', '/checkAuth').as('auth');
        cy.intercept('POST', '/likes/*').as('like');
        cy.intercept('POST', '/comments/*').as('comments');
        cy.ui_signin(userName[1], password);
    });

    it('When user A likes a transaction of user B, user B should get notification that user A liked transaction', () => {
        
        let userBprevNotif, userBcurrentNotif;
        
        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
        .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible')
         .contains(`${user_list.userA.firstName} ${user_list.userA.lastName}`).should('be.visible').click();
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
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(a => {
            const stringToNumber = Number(a);
            userBprevNotif = stringToNumber;
            return userBprevNotif;
         });
        cy.ui_logout();

        cy.ui_signin(userName[0], password);
        cy.contains(`${user_list.userB.firstName} ${user_list.userB.lastName} paid ${user_list.userA.firstName} ${user_list.userA.lastName}`)
         .click({force: true});
        cy.get(account_page.transaction_detail_selectors.transactionDetail_header).should('be.visible')
         .and('have.text', 'Transaction Detail');
        cy.get(account_page.transaction_detail_selectors.like_btn).should('be.visible').and('be.enabled').click();
        cy.wait("@like").its("response.statusCode").should("eq", 200);
        cy.get(account_page.transaction_detail_selectors.like_btn).should('be.visible').and('be.disabled');
        cy.ui_logout();

        cy.ui_signin(userName[1], password);
        cy.wait('@notifs');
        cy.get(account_page.notifications_selectors.notifications_sidebar).should('be.visible')
         .and('have.text', 'Notifications').click();
        cy.wait('@notifs').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/notifications');
        cy.get(account_page.notifications_selectors.notifs_items_list).should('be.visible')
         .and('contain', `${user_list.userA.firstName} ${user_list.userA.lastName} liked a transaction.`);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(b => {
            const stringToNumber = Number(b);
            userBcurrentNotif = stringToNumber - userBprevNotif;
            return userBcurrentNotif;
         }).should('eq', 1);
    });

    it('When user C likes a transaction between user A and user B, user A and user B should get notifications that user C liked transaction', () => {

        let userAprevNotif, userAcurrentNotif, userBprevNotif2, userBcurrentNotif2;

        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
        .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible')
         .contains(`${user_list.userA.firstName} ${user_list.userA.lastName}`).should('be.visible').click();
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
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(c => {
            const stringToNumberB = Number(c);
            userBprevNotif2 = stringToNumberB;
            return userBprevNotif2;
         });
        cy.ui_logout();

        cy.ui_signin(userName[0], password);
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(d => {
            const stringToNumberA = Number(d);
            userAprevNotif = stringToNumberA;
            return userAprevNotif;
         });
        cy.ui_logout();

        cy.ui_signin(userName[2], password);
        cy.contains(`${user_list.userB.firstName} ${user_list.userB.lastName} paid ${user_list.userA.firstName} ${user_list.userA.lastName}`)
         .click({force: true});
        cy.get(account_page.transaction_detail_selectors.transactionDetail_header).should('be.visible')
         .and('have.text', 'Transaction Detail');
        cy.get(account_page.transaction_detail_selectors.like_btn).should('be.visible').and('be.enabled').click();
        cy.wait("@like").its("response.statusCode").should("eq", 200);
        cy.get(account_page.transaction_detail_selectors.like_btn).should('be.visible').and('be.disabled');
        cy.ui_logout();

        cy.ui_signin(userName[1], password);
        cy.wait('@notifs');
        cy.get(account_page.notifications_selectors.notifications_sidebar).should('be.visible')
         .and('have.text', 'Notifications').click();
        cy.wait('@notifs').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/notifications');
        cy.get(account_page.notifications_selectors.notifs_items_list).should('be.visible')
         .and('contain', `${user_list.userC.firstName} ${user_list.userC.lastName} liked a transaction.`);
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(f => {
            const stringToNumberB1 = Number(f);
            userBcurrentNotif2 = stringToNumberB1 - userBprevNotif2;
            return userBcurrentNotif2;
         }).should('eq', 1);
        cy.ui_logout();

        cy.ui_signin(userName[0], password);
        cy.wait('@notifs');
        cy.get(account_page.notifications_selectors.notifications_sidebar).should('be.visible')
         .and('have.text', 'Notifications').click();
        cy.wait('@notifs').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/notifications');
        cy.get(account_page.notifications_selectors.notifs_items_list).should('be.visible')
         .and('contain', `${user_list.userC.firstName} ${user_list.userC.lastName} liked a transaction.`);
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(g => {
            const stringToNumberA1 = Number(g);
            userAcurrentNotif = stringToNumberA1 - userAprevNotif;
            return userAcurrentNotif;
         }).should('eq', 1);
    });

    it('When user A comments on a transaction of user B, user B should get notification that User A commented on their transaction', () => {
        
        let userBprevNotif3, userBcurrentNotif3;

        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
        .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible')
         .contains(`${user_list.userA.firstName} ${user_list.userA.lastName}`).should('be.visible').click();
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
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(j => {
            const commentsNumber = Number(j);
            userBprevNotif3 = commentsNumber;
            return userBprevNotif3;
         });
        cy.ui_logout();

        cy.ui_signin(userName[0], password);
        cy.contains(`${user_list.userB.firstName} ${user_list.userB.lastName} paid ${user_list.userA.firstName} ${user_list.userA.lastName}`)
         .click({force: true});
        cy.get(account_page.transaction_detail_selectors.transactionDetail_header).should('be.visible')
         .and('have.text', 'Transaction Detail');
        cy.get(account_page.transaction_detail_selectors.comment_input_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Write a comment...').click().type('Comment{enter}');
        cy.wait("@comments").its("response.statusCode").should("eq", 200);
        cy.get(account_page.transaction_detail_selectors.comments_list).should('be.visible')
         .and('have.text', 'Comment');
        cy.ui_logout();

        cy.ui_signin(userName[1], password);
        cy.wait('@notifs');
        cy.get(account_page.notifications_selectors.notifications_sidebar).should('be.visible')
         .and('have.text', 'Notifications').click();
        cy.wait('@notifs').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/notifications');
        cy.get(account_page.notifications_selectors.notifs_items_list).should('be.visible')
         .and('contain', `${user_list.userA.firstName} ${user_list.userA.lastName} commented on a transaction.`);
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(o => {
            const commentsNumber = Number(o);
            userBcurrentNotif3 = commentsNumber - userBprevNotif3;
            return userBcurrentNotif3;
         }).should('eq', 1);
    });

    it('When user C comments on a transaction between user A and user B, user A and B should get notifications that user C commented on their transaction', () => {

        let userAprevNotif2, userAcurrentNotif2, userBprevNotif4, userBcurrentNotif4;

        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
        .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible')
         .contains(`${user_list.userA.firstName} ${user_list.userA.lastName}`).should('be.visible').click();
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
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(k => {
            const commentsB = Number(k);
            userBprevNotif4 = commentsB;
            return userBprevNotif4;
         });
        cy.ui_logout();

        cy.ui_signin(userName[0], password);
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(l => {
            const commentsA = Number(l);
            userAprevNotif2 = commentsA;
            return userAprevNotif2;
         });
        cy.ui_logout();

        cy.ui_signin(userName[2], password);
        cy.contains(`${user_list.userB.firstName} ${user_list.userB.lastName} paid ${user_list.userA.firstName} ${user_list.userA.lastName}`)
         .click({force: true});
        cy.get(account_page.transaction_detail_selectors.transactionDetail_header).should('be.visible')
         .and('have.text', 'Transaction Detail');
         cy.get(account_page.transaction_detail_selectors.comment_input_fld).should('be.visible')
         .and('have.attr', 'placeholder', 'Write a comment...').click().type('Comment{enter}');
        cy.wait("@comments").its("response.statusCode").should("eq", 200);
        cy.get(account_page.transaction_detail_selectors.comments_list).should('be.visible')
         .and('have.text', 'Comment');
        cy.ui_logout();

        cy.ui_signin(userName[1], password);
        cy.wait('@notifs');
        cy.get(account_page.notifications_selectors.notifications_sidebar).should('be.visible')
         .and('have.text', 'Notifications').click();
        cy.wait('@notifs').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/notifications');
        cy.get(account_page.notifications_selectors.notifs_items_list).should('be.visible')
         .and('contain', `${user_list.userC.firstName} ${user_list.userC.lastName} commented on a transaction.`);
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(p => {
            const commentsB1 = Number(p);
            userBcurrentNotif4 = commentsB1 - userBprevNotif4;
            return userBcurrentNotif4;
         }).should('eq', 1);
        cy.ui_logout();

        cy.ui_signin(userName[0], password);
        cy.wait('@notifs');
        cy.get(account_page.notifications_selectors.notifications_sidebar).should('be.visible')
         .and('have.text', 'Notifications').click();
        cy.wait('@notifs').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/notifications');
        cy.get(account_page.notifications_selectors.notifs_items_list).should('be.visible')
         .and('contain', `${user_list.userC.firstName} ${user_list.userC.lastName} commented on a transaction.`);
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(r => {
            const commentsA1 = Number(r);
            userAcurrentNotif2 = commentsA1 - userAprevNotif2;
            return userAcurrentNotif2;
         }).should('eq', 1);
    });

    it('When user A sends a payment to user B, user B should be notified of payment', () => {

        let userBprevPaymentNotif, userBcurrentPaymentNotif;

        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(s => {
            const paymentStringToNumber = Number(s);
            userBprevPaymentNotif = paymentStringToNumber;
            return userBprevPaymentNotif;
         });
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
        cy.get(account_page.transactions_selectors.pay_btn).should('be.visible').and('be.enabled')
         .and('have.text', 'Pay').click();
        cy.wait('@transact').its('response.statusCode').should('eq', 200);
        cy.wait('@auth');
        cy.get(account_page.transactions_selectors.trnsct_submitted).should('be.visible')
         .and('have.text', 'Transaction Submitted!');
        cy.ui_logout();

        cy.ui_signin(userName[1], password);
        cy.wait('@notifs');
        cy.get(account_page.notifications_selectors.notifications_sidebar).should('be.visible')
         .and('have.text', 'Notifications').click();
        cy.wait('@notifs').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/notifications');
        cy.get(account_page.notifications_selectors.notifs_items_list).should('be.visible')
         .and('contain', `${user_list.userB.firstName} ${user_list.userB.lastName} received payment.`);
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(w => {
            const paymentStringToNumber2 = Number(w);
            userBcurrentPaymentNotif = paymentStringToNumber2 - userBprevPaymentNotif;
            return userBcurrentPaymentNotif;
         }).should('eq', 1);
    });

    it('When user A sends a payment request to user C, user C should be notified of request from user A', () => {

        let userCprevNotif, userCcurrentNotif;

        cy.ui_logout();
        cy.ui_signin(userName[2], password);
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(x => {
            const requestStringToNumber = Number(x);
            userCprevNotif = requestStringToNumber;
            return userCprevNotif;
         });
        cy.ui_logout();

        cy.ui_signin(userName[0], password);
        cy.get(account_page.transactions_selectors.new$_btn).should('be.visible').and('have.attr', 'href', '/transaction/new')
        .and('have.text', ' New').click();
        cy.wait('@users');
        cy.url().should('include', '/transaction/new');
        cy.get(account_page.transactions_selectors.userList).should('be.visible')
         .contains(`${user_list.userC.firstName} ${user_list.userC.lastName}`).should('be.visible').click();
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

        cy.ui_signin(userName[2], password);
        cy.wait('@notifs');
        cy.get(account_page.notifications_selectors.notifications_sidebar).should('be.visible')
         .and('have.text', 'Notifications').click();
        cy.wait('@notifs').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/notifications');
        cy.get(account_page.notifications_selectors.notifs_items_list).should('be.visible')
         .and('contain', `${user_list.userA.firstName} ${user_list.userA.lastName} requested payment.`);
        cy.wait(500);
        cy.get(account_page.notifications_selectors.notifications_topbar).should('be.visible').invoke('text')
         .then(y => {
            const requestStringToNumber2 = Number(y);
            userCcurrentNotif = requestStringToNumber2 - userCprevNotif;
            return userCcurrentNotif;
         }).should('eq', 1);
    })
})