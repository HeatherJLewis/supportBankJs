const fs = require("fs");

const createObjectOfUsers = (transactionDataArray, usersObject) => {
    transactionDataArray.forEach(transaction => {
        usersObject[transaction[1]] = "You have no transactions"
    })
}
fs.readFile("Transactions2014.csv", function(err, data) {
    if(err) throw err;
    const transactionData = data.toString()
    const transactionDataArray = transactionData
                                .split("\n")
                                .map(singleTransaction => singleTransaction.split(','))

    const usersObject = {}
    createObjectOfUsers(transactionDataArray, usersObject)
    console.log(usersObject)
});