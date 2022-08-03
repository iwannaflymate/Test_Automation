export const funcs = {
    randomUsername() {
        const random_username = ['Chris', 'Jake', 'Kenneth', 'Doyle', 'Jacob', 'Raymond', 'Daryl', 'Samantha', 'Denis', 'Webber', 'Donovan', 'Bradberry', 'Tenpenny', 'Johnson', 'Wexell', 'Teller', 'Wayne', 'Flame'];
        const unIndex = Math.floor(Math.random() * random_username.length);
        const UNrandomNumber = Math.floor(Math.random() * 10000);
        return `${random_username[unIndex]}${UNrandomNumber}`;
    },
    randomIntNumber() {
        const giveMeNumber = Math.floor(Math.random() * 30);
        return giveMeNumber;
    }
};