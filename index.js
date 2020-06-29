const fs = require("fs");
const readline = require('readline-sync');

const createAnArrayOfUniqueUsers = (anArray) => {
    let arrayOfUsers = [];

    anArray.map(transaction => {
        if(arrayOfUsers.includes(transaction.paidBy)){
            return arrayOfUsers;
        } else {
            arrayOfUsers.push(transaction.paidBy);
        }
    });
    return arrayOfUsers;
};
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

    summary() {
        return { paidTo: this.paidTo, description: this.description, amount: this.amount }
    }
};

const createObjectOfUsers = (array) => {
    let object = {}
    array.forEach(transaction => {
        if(!object[transaction]){
            object[transaction] = new Balances
        };
    })
    return object;
};

const createObjectOfTransactionsForAUser = (accountName, array) => {
    let userAccount = { [accountName] : {} };
    array.forEach(transaction => {
        if(transaction.paidBy === accountName || transaction.paidTo === accountName){
            userAccount[accountName][transaction.dateOfTransaction] = transaction.summary()
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

const updateBalances = (array, object) => {

    array.forEach(transaction => {
        object[transaction.paidBy].balance += transaction.amount;
        object[transaction.paidTo].balance -= transaction.amount;
    });
    return object;
};

const roundMonies = (array, object) => {
    array.forEach(user => {
        object[user].balance = (object[user].balance).toFixed(2) * -1;
    });
    return object;
};

fs.readFile("Transactions2014.csv", function(err, data) {
    if(err) throw err;

    console.log('Which function would you like? List All or List');

    const input = readline.prompt();

    const transactionDataArray = createArrayOfTransactionObjects(data);

    const arrayOfUsers = createAnArrayOfUniqueUsers(transactionDataArray);

    const objectOfUsers = createObjectOfUsers(arrayOfUsers);

    const summaryOfUserBalances = roundMonies(arrayOfUsers, updateBalances(transactionDataArray, objectOfUsers));


    if(input === 'List All'){
        console.log(summaryOfUserBalances)
    } else if(input === "List[Account]"){
        console.log('Which user would you like?');
        const userRequired = readline.prompt();
        if(arrayOfUsers.includes(userRequired)){
            const summaryOfBalancesForAUser = createObjectOfTransactionsForAUser(userRequired, transactionDataArray)
            console.log(summaryOfBalancesForAUser);

    } else {
            console.log("Sorry - that user is not in our database");
        };
    }
});