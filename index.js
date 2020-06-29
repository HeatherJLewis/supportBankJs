const fs = require("fs");
const readline = require('readline-sync');

const createArrayOfTransactions = (data) => {
    return data
            .toString()
            .split("\n")
            .map(singleTransaction => singleTransaction.split(','))
}

const convertAmountOwedToNumber = (array) => {
    array.map(el => el[4] = Number(el[4]));
}

const createObjectOfUserOwedBalance = (array) => {
    let object = {}
    array.forEach(transaction => {
        if(!object[transaction[1]]){
            object[transaction[1]] = {toPay: transaction[4], toReceive: 0}
        } else {
            object[transaction[1]].toPay += transaction[4]
        }
    })
    return object;
}

const addsUserOwingBalance = (array, object) => {
    array.forEach(transaction => {
      object[transaction[2]].toReceive += transaction[4]
    })
    return object;
}

fs.readFile("Transactions2014.csv", function(err, data) {
    if(err) throw err;

    const transactionDataArray = createArrayOfTransactions(data);

    convertAmountOwedToNumber(transactionDataArray);

    const userBalancesOwed = createObjectOfUserOwedBalance(transactionDataArray)

    const userCompleteBalances = addsUserOwingBalance(transactionDataArray, userBalancesOwed)

    const arrayOfUsers = [];

// take each element of the array and extract unique names
    transactionDataArray.map(el => {
        if(arrayOfUsers.includes(el[1])){
            return arrayOfUsers;
        } else {
            arrayOfUsers.push(el[1])
        }
    });

// for each user, update their object to round the monies toPay and toReceive to two decimal placess
    arrayOfUsers.forEach(user => {
        userCompleteBalances[user].toPay = (userCompleteBalances[user].toPay).toFixed(2) * -1
        userCompleteBalances[user].toReceive = (userCompleteBalances[user].toReceive).toFixed(2)
    })

    console.log(userCompleteBalances)
});

// TODO
// Refactor to create functions
// Tidy up file, improve comments and push
// Remove comments
//