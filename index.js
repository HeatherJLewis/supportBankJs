const fs = require("fs");

fs.readFile("Transactions2014.csv", function(err, data) {
    if(err) throw err;
    const transactionData = data.toString()
    const transactionDataArray = transactionData
                                .split("\n")
                                .map(singleTransaction => singleTransaction.split(','))

    const userBalances = {};

    transactionDataArray.forEach(el => {
        if(!userBalances[el[1]]){
            userBalances[el[1]] = {owed: +el[4], owing: 0}
        } else {
            userBalances[el[1]].owed += +el[4]
        }
    })

    transactionDataArray.forEach(el => {
      userBalances[el[2]].owing += +el[4]
    })


    console.log(userBalances)
});