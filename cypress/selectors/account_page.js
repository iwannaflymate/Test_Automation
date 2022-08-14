export const account_page = {
onboarding: {
    next_btn: '[data-test="user-onboarding-next"] > .MuiButton-label',
    cba_title: '[data-test="user-onboarding-dialog-title"] > .MuiTypography-root',
    bank_name_field: '#bankaccount-bankName-input',
    routing_name_field: '#bankaccount-routingNumber-input',
    account_number_field: '#bankaccount-accountNumber-input',
    bn_field_validation: '#bankaccount-bankName-input-helper-text',
    rn_field_validation: '#bankaccount-routingNumber-input-helper-text',
    an_field_validation: '#bankaccount-accountNumber-input-helper-text',
    cba_save_btn: '[data-test="bankaccount-submit"]'
},

sidebar_selectors: {
    bank_accounts_btn: '[data-test="sidenav-bankaccounts"]',
    logout_btn: '[data-test="sidenav-signout"]'
},

bank_acc_selectors: {
    bank_acc_create_btn: '[data-test="bankaccount-new"]',
    bank_acc_delete_btn: '[data-test="bankaccount-delete"]'
},

transactions_selectors: {
    new$_btn: '[data-test="nav-top-new-transaction"]',
    search: '#user-list-search-input',
    userList: '[data-test="users-list"]',
    amount_fld: '#amount',
    note_fld: '#transaction-create-description-input',
    amount_validation: '#transaction-create-amount-input-helper-text',
    note_validation: '#transaction-create-description-input-helper-text',
    pay_btn: '[data-test="transaction-create-submit-payment"]',
    request_btn: '[data-test="transaction-create-submit-request"]',
    trnsct_submitted: '[data-test="alert-bar-success"]',
    balance: '[data-test="sidenav-user-balance"]'
},

notifications_selectors: {
    notifications_sidebar: '[data-test="sidenav-notifications"]',
    notifications_topbar: '[data-test="nav-top-notifications-link"]',
    notifs_items_list: '[data-test*="notification-list-item"]'
},

transaction_detail_selectors: {
    transactionDetail_header: '[data-test="transaction-detail-header"]',
    like_btn: '[data-test*="transaction-like-button"]',
    like_counter: '[data-test*="transaction-like-count"]',
    comment_input_fld: '[data-test*="transaction-comment-input"]',
    comments_list: '[data-test="comments-list"]',
    accept_req_btn: '[data-test*="transaction-accept"]',
    reject_req_btn: '[data-test*="transaction-reject-request"]'
},

homepage_selectors: {
    everyone_sec: '[data-test="nav-public-tab"]',
    friends_sec: '[data-test="nav-contacts-tab"]',
    mine_sec: '[data-test="nav-personal-tab"]'
}
};