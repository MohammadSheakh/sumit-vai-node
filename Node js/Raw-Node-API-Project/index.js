/*
 * Title        : Uptime Monitoring Application
 * Description  : A RESTFul API to monitor up or down time of user defined links
 * Author       : Mohammad Bin Ab. Jalil Sheakh
 * Date         : --21
 * facebook id  : https://www.facebook.com/chill.mohammad/
 * Git Hub      : https://github.com/MohammadSheakh
 * Mail         : mohammad.sheakh@gmail.com
 * Phone Number : 01790-583345, 0151-8419801
 */

// TODO:   dependencies-section
const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environment");
const data = require("./lib/data");
const { sendTwilioSms } = require("./helpers/notifications");
const server = require("./lib/server");
const workers = require("./lib/worker");

// TODO  app object - module scaffolding (blank object) // eita te attach kore .. function gula export kora jay
const app = {}; // full application er structure ta etar moddhe thakbe ..

app.init = () => {
    // start the server
    server.init();
    // start the workers
    workers.init();
};
app.init();
module.exports = app;

// // TODO: this is just to test the twilio ... we should remove this later .. remove done means commenting done
// sendTwilioSms("01518419801", "Hello ", (err) => {
//     console.log("Twilio call in index.js: ", err, "⭕");
// });

/*
///////////////////////////////////////////File system test start//////////////////////////////////////////////////////////////////
// testing file system
// TODO:  remove this testing part letter
// test namer inner folder ta kintu amader create kore dite hobe .. she file create korte pare .. folder na

data.create(
    "test",
    "newFile2",
    {
        name: "Bangladesh",
        language: "Bangla",
        FavFood: "panta Bhat",
        FavPlace: "Water Kingdom",
    },
    (err) => {
        console.log("🔴Error was : {index.js > data.create}🔵", err); // false meaning kono error nai
    }
);

// ekhon data update korbo file er
data.update(
    "test",
    "newFile2",
    {
        name: "India",
        language: "Hindi",
        FavFood: "Dal Vat",
        FavPlace: "Water Ganga",
    },
    (err) => {
        console.log("🔴Error was :  {index.js > data.update}🔵", err); // false meaning kono error nai
    }
);

// data read korbo ebar file system theke ..
data.read("test", "newFile2", (err, result) => {
    console.log("🔴Error was :  {index.js > data.read}🔵", err); // data read korar shomoy kono
    // error na thakle null print korbe
    console.log("🌐Read Data From File => ", result);
});

// ekhon file delete korbo
// data.delete("test", "newFile2", (err) => {
//     console.log("🔴Error was :  {index.js > data.delete}🔵", err); // false meaning kono error nai
// });
////////////////////////////////////////////File system test end/////////////////////////////////////////////////////////////////
*/

// // TODO:  configuration section
/*
//////////////////////////////// Server Creation related shob code lib folder er server.js e niye gesi .. shekhan theke call korbo
// app.config = {
//     // variable type er jinish gula ekhane rakha jete pare ..
//     port: 313,
// }; // configuration er shob kichu .. shudhu matro ei file ei access kora jacchilo .. kintu environment variable gula shobar jonno
// accessible kora proyojon .. ejonno shomosto environment property er jonno .. mane environment related kaj korar jonno separate
// folder create korechi .. helpers / environment.js

// TODO:  Server Creation
// server create korar jonno ekta function likhbo ekhane
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    // incoming request accept korle .. sheta handleReqRes function er moddhe diye dey ..
    // createServer method er moddhe amader ke pass korte hoy arekta function. jei function ta basically
    //she server object ta create korar jonno use korbe and shei function tai request and response handle korbe
    // server create korlei to hobe na .. Server ta Start korte hobe .. Server Start korte hobe .. Server ke
    // ekta port e listen korte hoy ..
    // app.config.port er jaygay ekhon environment.port hobe
    server.listen(environment.port, () => {
        //NODE_ENV hocche variable er nam ..
        console.log(`environment variable : ${process.env.NODE_ENV}`); // process nam e global er motoio ekta jinish ase .. object
        console.log(
            `listening to port ${environment.port} and full link :- http://localhost:${environment.port}/ application created by :-https://www.facebook.com/mohammadsheakh.mern/`
        );
    }); // shathe she ekta callback function receive kore .. jodi she successfullys
    // function ta start korte pare .. tahole she ei callback function ta run korbe ..
};
// TODO:  handle request and response
// jehetu handleReqRes er code ta arek jaygay niye gesi .. ar ei file e import o korsi ..
app.handleReqRes = handleReqRes; // eta likhlei sheta call hobe ...
*/
/*app.handleReqRes = (req, res) => {
    console.log(
        "-------------------------------------------comment start--------------------------------"
    );
    // request handling
    // get the url and parse it ..
    const parsedUrl = url.parse(req.url, true);
    // true deowar mane hocche .. shob gula keo consider kono mane .. query string gula keo consider koro ..
    // false pathale shei ongsho gula ke ignore kore jeto ..
    console.log("🔴parsedUrl🔵", parsedUrl); // http://localhost:313/?a=3&b=4
    const path = parsedUrl.pathname;
    console.log("🔵path🟣", path); // 🔵path🟣 /abo/obo/
    const trimmedPath = path.replace(/^\/+|\/+$/g, ""); // 2nd parameter dia replace korbe ..
    // majh khane chara .. shurute ba shesh e unwanted slash thakle sheta shoriye dey  ..
    console.log("🟣trimmedPath🔵", trimmedPath); // 🟣trimmedPath🔵 abo/obo
    //                                              -------------------    ----------------------------------
    const method = req.method.toLowerCase(); // request er maddhome method jetai ashuk na keno .. ami choto hat er receive korbo
    // receive query string ... multiple query string thakte pare ... object hishebe pabo ..
    const queryStringObject = parsedUrl.query; // http://localhost:313/abo/obo/?a=4&b=9
    console.log("🔴queryStringObject🔵", queryStringObject); //🔴queryStringObject🔵 [Object: null prototype] { a: '4', b: '9' }
    // request er headers holo.. request er shathe .. URL charao aro besh kichu jinish ashe .. request er bivinno meta data ..
    // request er shathe shomporkito choto choto property .. value .. server theke automatic onek kichui ashe .. postman onek kichui pathacchilo ..
    // echarao nijossho meta data pathate pari ..
    const headersObject = req.headers;
    console.log("🔵headersObject🟣", headersObject); // valid javaScript object return kore ..
    //                                              -------------------    ----------------------------------
    // ekhon amra request er most important part niye kaj korbo .. sheta holo .. request er body ba .. request er  pay load
    // GET Request e kono parameter patha te hole amra query String hishebe pathaitam ..
    // kintu POST Request er belay amra .. Request er Body te amader ke data pathate hoto ..
    // front end er kono form e data submit dile .. tokhon sheta kintu request er body hishebe amader kase server side e submit hoy
    // request er body direct data hishebe ashe na .. stream hishebe ashe.. buffer hishebe amra receive kori.. tarpor sheta ke
    // original data te porinoto korte hoy .. ajke amra different way te decode korbo .. (reccomended way to decode buffers)
    //
    // * er age amra dekhsilam kivabe buffer gula pete hoy .. buffer gula jehetu continously ashte thake .. ta ke paowar jonno amader
    // * event er maddhome pete hobe .. she REQUEST object er upore data event fire korte thake .. Sheta jodi amra listen kori
    // * taholei kintu amra buffer gula pete thaki ..
     
    const decoder = new StringDecoder("utf-8"); // StringDecoder vai .. tumi amake decode kore diba .. 'utf-8' hocche amar encoding
    // ei decoder object diye ami ekhon decode korte parbo ..
    // buffer jehetu ashtei thakbe .. tai real data namok ekta variable nicchi ..
    let realData = "";
    req.on("data", (buffer) => {
        //request.on .. ei data event ta ami listen korsi .. and amar kase buffer ashte thakse ..
        // shei buffer ta ke amake data te porinoto korte hobe .. eta korar jonno amra node er ekta core module nicchi ..
        // full module ta amra nibo na .. sheta theke ekta part distructure kore niye ashsi ..
        // const {StringDecoder} = require('string_decoder'); //StringDecoder class ta niye ashlam
        // StringDecoder jehetu ekta class .. shuru te er ekta object create kore nicchi
        realData += decoder.write(buffer); // buffer ta data hote thakbe .. ar add hote thakbe ..
    }); // data event ta amake listen korte hobe .. and shekhane callback hishebe ami buffer pabo ..
    // ----------------
    // jokhon buffer ta shesh hoye jabe ..  tokhon Request er upore 'end' event fire hoy
    req.on("end", () => {
        // end howar pore ei code block kaj korbe ..  ekhane decoder.write ta end kore dite hobe
        realData += decoder.end();
        console.log("🔵🟣", realData);
        // body te ja user Requested data er shathe pathacche .. sheta ekhon real data er moddhe paowa jacche ..
        // Requested body kivabe record korte hoy .. sheta amra dekhlam  ..
        //response handle --------------------------------------------------------------------comment done-------------------
        res.end("🔵🟣", "hello folks ! Response is end !");
        // ekhon maximum kaj hobe amader ei function er moddhe ..
    });
};
*/

// etokkhon amra function body means .. function defination likhechi .. function call korini .. ekhon call korbo
// TODO: start the server
//app.createServer(); // server ta call korlam  .. ekhon server ta lib folder er moddher server.js theke call hobe
