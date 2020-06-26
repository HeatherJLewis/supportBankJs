var fs = require("fs");

fs.readFile("Transactions2014.csv", function(err, data) {
    if(err) throw err;

    console.log('data', data.toString());
});
