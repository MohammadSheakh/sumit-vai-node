// ekhon amra to file theke data pailam .. sheta streaming way te arekta file e write kore dekhabo ebar ...
const fs = require("fs");

const ourReadStream = fs.createReadStream(`${__dirname}/bigdata.txt`, "utf8");
const ourWriteStream = fs.createWriteStream(`${__dirname}/output.txt`, "utf8"); // data read korar age ekta stream create korsi ..

// ourReadStream.on("data", (chunk) => {
//     // console.log(chunk); // Buffer Reture kore ..  Binary Buffer data
//     // full file ekbare write na kore .. ektu ektu kore write korbo ..
//     // jei ektu ektu kore chunk pacchi .. sheta ektu ektu kore amar ei writeStream e pathaye dibo ..
//     // writeStream notun file er moddhe ektu ektu kore write korte thakbe...
//     ourWriteStream.write(chunk);
// });

// ekhon amra to file theke data pailam .. sheta streaming way te arekta file e write kore dekhabo ebar ...

// Read Stream ar Write Stream er kaj ta ke korar jonno aro simple way ase .... jeta hocche PIPE ... ( pipe)
ourReadStream.pipe(ourWriteStream);
