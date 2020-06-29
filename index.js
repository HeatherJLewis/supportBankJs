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
        this.toPay = 0,
        this.toReceive = 0
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
        object[el[1]].toPay += el[4];
        object[el[2]].toReceive += el[4];
    });
    return object;
};

const roundMonies = (array, object) => {
    array.forEach(user => {
        object[user].toPay = (object[user].toPay).toFixed(2) * -1;
        object[user].toReceive = (object[user].toReceive).toFixed(2);
    });
    return object;
};

fs.readFile("Transactions2014.csv", function(err, data) {
    if(err) throw err;

    const transactionDataArray = createArrayOfTransactions(data);

    convertAmountOwedToNumber(transactionDataArray);

    const arrayOfUsers = createAnArrayOfUniqueUsers(transactionDataArray);

    const objectOfUsers = createObjectOfUsers(arrayOfUsers);

    const summaryOfUserBalances = roundMonies(arrayOfUsers, updateBalances(transactionDataArray, objectOfUsers));

    console.log(summaryOfUserBalances)
});