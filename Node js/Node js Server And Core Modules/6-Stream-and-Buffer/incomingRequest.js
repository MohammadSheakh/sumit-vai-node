//incomingRequest
// ekhon http module use kore .. server e jokhon ekta incoming request ashe .. shei request ta keo kintu amra chunk e chunk ei
// receive kori .. node.js by default amader ke chunk e chunk ei pathay ..
const http = require("http"); // ei module ta network er shathe communicate korte pare
// ekta route diye user post korte parbe .. arekta route diye .. jeta post korsilo sheta receive korbo ..
const server = http.createServer((req, res) => {
    if (req.url == "/form") {
        console.log("condition : /form");
        //http://localhost:323/form
        res.write("<!DOCTYPE html><head><title>Document</title></head>");
        res.write(
            '<body><form method="post" action="/view"><input name="message"/></form></body></html>'
        );
        res.write("Hello folks !");
        res.end();
    } else if (req.url == "/view" && req.method == "POST") {
        const body = [];
        console.log("condition : /view");
        // jehetu post method e data ta ashse ..
        // req.data ta amra petam.. jodi data ta ekbare chole ashto .. kintu data ta onno vabe ashse ..
        req.on("data", (chunk) => {
            // console.log(chunk.toString()); // data ta encoded hoye ashse ..
            body.push(chunk);
            // chunk e chunk e jei data gula ashtese .. shegula ke amra ekta body namok array te save kore rakhtesi ..
        });
        req.on("end", () => {
            console.log("Stream Finished");
            const parseBody = Buffer.concat(body).toString();
            console.log(parseBody);
            // end event ta tokhon e listen hobe .. jokhon shob data  chole ashbe .. shegula concat method er maddhome Buffer e
        }); //add hobe
        res.write("Thank you for submitting ! ");
        res.end();
    } else {
        console.log("condition : default else");
        res.write("Hello folks ! this is default");
        res.end();
    }
});

//........................  ekhane last picture er code gula ...........ar ei code gula server on korar jonno..................
server.on("connection", () => {
    console.log("New Connection");
});
server.listen(313); //http://localhost:323 ei port number e server ta run korbe  ..
