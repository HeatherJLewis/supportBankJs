const fs = require("fs");
const readline = require('readline-sync');

const createAnArrayOfUniqueUsers = (anArray) => {
    let arrayOfUsers = [];
    anArray.map(el => {
        if(arrayOfUsers.includes(el[1])){
            return arrayOfUsers;
        } else {
            arrayOfUsers.push(el[1]);
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
    constructor(paidTo, description, amount) {
        this.paidTo = paidTo,
        this.description = description,
        this.amount = amount
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
    array.forEach(el => {
        if(el[1] === accountName || el[2] === accountName){
            userAccount[accountName][el[0]] = new Transaction(el[2], el[3], el[4])
        }
    })
    return userAccount;
}

const createArrayOfTransactions = (data) => {
    return data
            .toString()
            .split("\n")
            .map(singleTransaction => singleTransaction.split(','));
};

const convertAmountOwedToNumber = (array) => {
    array.map(el => el[4] = Number(el[4]));
};

const updateBalances = (array, object) => {
    array.forEach(el => {
        object[el[1]].balance += el[4];
        object[el[2]].balance -= el[4];
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

    const transactionDataArray = createArrayOfTransactions(data);

    convertAmountOwedToNumber(transactionDataArray);

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
            console.log("Sorry - that user is not in out database");
        };
    }
});