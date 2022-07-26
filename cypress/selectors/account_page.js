export const account_page = {
// Onboarding selectors:
    next_btn: '[data-test="user-onboarding-next"] > .MuiButton-label',
    cba_title: '[data-test="user-onboarding-dialog-title"] > .MuiTypography-root',
    bank_name_field: '#bankaccount-bankName-input',
    routing_name_field: '#bankaccount-routingNumber-input',
    account_number_field: '#bankaccount-accountNumber-input',
    bn_field_validation: '#bankaccount-bankName-input-helper-text',
    rn_field_validation: '#bankaccount-routingNumber-input-helper-text',
    an_field_validation: '#bankaccount-accountNumber-input-helper-text',
    cba_save_btn: '[data-test="bankaccount-submit"]',

// Sidebar selectors:
    bank_accounts_btn: '[data-test="sidenav-bankaccounts"]',
    logout_btn: '[data-test="sidenav-signout"]',

// "Bank Accounts" section selectors:
    bank_acc_create_btn: '[data-test="bankaccount-new"]',
    bank_acc_delete_btn: '[data-test="bankaccount-delete"]'
};