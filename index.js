const fs = require("fs");
const readline = require('readline-sync');
const log4js = require('log4js');

let transactionDataArray = [];
let repeatTransaction;

log4js.configure({
    appenders: {
        file: { type: 'file', filename: 'logs/debug.log' },
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'},
    }
});

const logger = log4js.getLogger("debug");

class Transaction {
    constructor(dateOfTransaction, paidBy, paidTo, description, amount) {
        this.dateOfTransaction = dateOfTransaction;
        this.paidBy = paidBy;
        this.paidTo = paidTo;
        this.description = description;
        this.amount = isNaN(Number(amount)) ? 0 : Number(amount)
    }

    summaryOfMoneyDueTransactions() {
        return { paidTo: this.paidTo, description: this.description, amount: this.amount }
    }

    summaryOfMoneyOwedTransactions() {
        return { paidBy: this.paidBy, description: this.description, amount: this.amount }
    }
};

const createDictionaryOfUsers = (transactionDataArray) => {
    let dictionaryOfUsers = {};
    transactionDataArray.forEach(transaction => {
        dictionaryOfUsers[transaction.paidBy] = { balance : 0 };
    });
    return dictionaryOfUsers;
};

const createObjectOfTransactionsForAUser = (accountName, transactionDataArray) => {
    let userAccount = { [accountName] : {} };
    transactionDataArray.forEach(transaction => {
        if(transaction.paidTo === accountName){
            userAccount[accountName][transaction.dateOfTransaction] = transaction.summaryOfMoneyDueTransactions()
        }
        if(transaction.paidBy === accountName){
            userAccount[accountName][transaction.dateOfTransaction] = transaction.summaryOfMoneyOwedTransactions()
        }
    })
    return userAccount;
};

const createArrayOfTransactionObjects = (data) => {
    return data
            .toString()
            .split("\n")
            .slice(1)
            .map(singleTransaction => singleTransaction.split(','))
            .map(transaction => new Transaction(transaction[0], transaction[1], transaction[2], transaction[3], transaction[4]));
};

const updateBalances = (transactionDataArray, dictionaryOfUsers) => {

    transactionDataArray.forEach(transaction => {
        dictionaryOfUsers[transaction.paidBy].balance += transaction.amount;
        dictionaryOfUsers[transaction.paidTo].balance -= transaction.amount;
    });

    return dictionaryOfUsers;
};

const roundBalances = (summaryOfUserBalances) => {
    Object.keys(summaryOfUserBalances).forEach(username => {
        summaryOfUserBalances[username].balance = (summaryOfUserBalances[username].balance).toFixed(2);
    });
};

fs.readFile("DodgyTransactions2015.csv", function(err, data) {
    if(err){
        logger.debug(err);
        throw err;
    };
    logger.info('Application started ...')
    logger.info(`File successfully read`)

    do {
        console.log('Which function would you like? Enter \'List All\' or \'Username\'');

        const userInput = readline.prompt();

        logger.info(`User input: ${userInput}`)

        try {
            transactionDataArray = createArrayOfTransactionObjects(data);
        } catch (e) {
            logger.debug(e);
        }

        const dictionaryOfUsers = createDictionaryOfUsers(transactionDataArray);

        if(userInput === 'List All'){
            const summaryOfUserBalances = updateBalances(transactionDataArray, dictionaryOfUsers);
            roundBalances(summaryOfUserBalances);
            console.log(summaryOfUserBalances)

        } else if(dictionaryOfUsers.hasOwnProperty(userInput)){
            const summaryOfBalancesForAUser = createObjectOfTransactionsForAUser(userInput, transactionDataArray)
            console.log(summaryOfBalancesForAUser);

        } else {
                logger.info(`Incorrect name given: ${userInput}`)
                console.log("Sorry - that user is not in our database.");
            };
        console.log("Would you like another transaction? Type \'y\' for yes, \'n\' for no");
        repeatTransaction = readline.prompt();
    } while (repeatTransaction === "y");
});