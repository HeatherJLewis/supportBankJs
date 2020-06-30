const fs = require("fs");
const readline = require('readline-sync');
class Balances {
    constructor() {
        this.balance = 0
    }
};

class Transaction {
    constructor(dateOfTransaction, paidBy, paidTo, description, amount) {
        this.dateOfTransaction = dateOfTransaction,
        this.paidBy = paidBy,
        this.paidTo = paidTo,
        this.description = description,
        this.amount = Number(amount)
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
}

const createArrayOfTransactionObjects = (data) => {
    return data
            .toString()
            .split("\n")
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

fs.readFile("Transactions2014.csv", function(err, data) {
    if(err) throw err;

    let repeatTransaction;

    do {
        console.log('Which function would you like? Enter \'List All\' or \'Username\'');

        const userInput = readline.prompt();

        const transactionDataArray = createArrayOfTransactionObjects(data);

        const dictionaryOfUsers = createDictionaryOfUsers(transactionDataArray);


        if(userInput === 'List All'){
            const summaryOfUserBalances = updateBalances(transactionDataArray, dictionaryOfUsers);
            console.log(summaryOfUserBalances)

        } else if(dictionaryOfUsers.hasOwnProperty(userInput)){
            const summaryOfBalancesForAUser = createObjectOfTransactionsForAUser(userInput, transactionDataArray)
            console.log(summaryOfBalancesForAUser);

        } else {
                console.log("Sorry - that user is not in our database.");
            };
        console.log("Would you like another transaction? Type \'y\' for yes, \'n\' for no");
        repeatTransaction = readline.prompt();
    } while (repeatTransaction === "y");
});