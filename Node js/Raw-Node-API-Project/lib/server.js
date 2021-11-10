/* Title : Server Library
 * Description : Server related files
 * Author : Mohammad Bin Ab. Jalil Sheakh-----------------📞 0151-8419801, 01790-583345
 * Updated Date : --21 (Please update the error date also)
 * facebook id : https://www.facebook.com/mohammadsheakh.mern/ 🌐 Git Hub : https://github.com/MohammadSheakh
 * Mail : mohammad.sheakh@gmail.com
 */
// TODO: dependencies
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");
const environment = require("../helpers/environment");
// TODO: ... object - module scaffolding
const server = {};
// TODO: configurations
// app.config = {
//     // variable type er jinish gula ekhane rakha jete pare ..
//     port: 313,
// }; // configuration er shob kichu .. shudhu matro ei file ei access kora jacchilo .. kintu environment variable gula shobar jonno
// accessible kora proyojon .. ejonno shomosto environment property er jonno .. mane environment related kaj korar jonno separate
// folder create korechi .. helpers / environment.js

// TODO:  Server Creation
// server create korar jonno ekta function likhbo ekhane
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    // incoming request accept korle .. sheta handleReqRes function er moddhe diye dey ..
    // createServer method er moddhe amader ke pass korte hoy arekta function. jei function ta basically
    //she server object ta create korar jonno use korbe and shei function tai request and response handle korbe
    // server create korlei to hobe na .. Server ta Start korte hobe .. Server Start korte hobe .. Server ke
    // ekta port e listen korte hoy ..
    // app.config.port er jaygay ekhon environment.port hobe
    createServerVariable.listen(environment.port, () => {
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
server.handleReqRes = handleReqRes; // eta likhlei sheta call hobe ...
// start the workers
server.init = () => {
    server.createServer();
    console.log("Server is created ! >> server.js");
};
// TODO: export the module
module.exports = server;
