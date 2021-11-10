const http = require("http"); // ei module ta network er shathe communicate korte pare

const server = http.createServer((req, res) => {
    // request , response
    // on event listen na kore .. amra createServer er moddhei ekta callback function diye dibo
    // jokhon e kono user server er kase request korbe .. tokhon ei callback function ta call hobe ..
    // connection event er moto same kahini ar ki ..
    if (req.url == "/new") {
        //http://localhost:323/new
        res.write("Hello folks !"); // response object er moddhe ami ki pathate chai ..
        res.end(); // finally response ta end korte hobe ..  aro jinish ase .. shamne shegula dekhbo ..
    }
}); /// notun ekta server create korlam .. // eta ekta server object

// ei server object ta ekta event emitter .. tar mane .. er o ... on, listen .. ei jinish gula ase ..
// amra EventEmitter er on method ektu age use korechilam  .
server.on("connection", () => {
    console.log("New Connection");
}); // on kintu ekta listener // jodi ami connection namok event ta ashole fire hoy ..
// jokhon e amae ekta notun server e connection ashe ..  ekhane ekta callback function thake .. function er
// parameter hishebe socket type er object pai .. eta niye pore amra alochona korbo ..
// keo jokhon amar server e hit korbe .. tokhon e connection event ta fire hobe .. ar jehetu ekta listener ..
// tai listen korbe ..

// jokhon notun keo request kore apnar server e ..  tokhon she connection event ta emmit kore ..
server.listen(323); // ekta port number dite hobe ..mane koto number port e server ta run korbe .. localhost:
// ei application e amra chaile aro beshi server o create korte pari
// event loop ta on hoye jay and server listen korar kajta repetedly hotei thake ..
console.log("listening on port http://localhost:323");
