const http = require("http");
const fs = require("fs");
const portNumber = 313;

const server = http.createServer((req, res) => {
    // readStream create kore big data theke file read kore .. output arek file e write korbo
    // response e jeta pabo .. sheta kivabe write kore dite pari arki
    const myReadStream = fs.createReadStream(
        `${__dirname}/bigdata.txt`,
        "utf8"
    );
    myReadStream.pipe(res);
    // res hocche clint ke jei response ta korbo sheta .. etake writable stream hishebe use kora jete pare..
});

server.listen(portNumber);
console.log("listening on port http://localhost:323"); //http://localhost:323
