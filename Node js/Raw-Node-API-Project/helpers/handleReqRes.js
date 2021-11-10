// TODO:   dependencies-section
const { StringDecoder } = require("string_decoder");
const url = require("url");
const routes = require("../routes"); // sample Handler ta import kora lagbe na .. karon sheta routes er moddhei ase
const { parseJSON } = require("../helpers/utilities");
// routes er moddhe sample handler er moto aro onek handler e thakbe .. jetar shathe match korbe .. shetar
// corresponding function ta call hobe .. kono ta match na hoile notFoundHandler function ta call hobe ..
const {
    notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");
// TODO:  app object - module scaffolding (blank object) // eita te attach kore .. function gula export kora jay
const handler = {};

// ei function tai amader incoming request gula ke accept korse ar process korse ..
handler.handleReqRes = (req, res) => {
    console.log(
        "---------------------------------------------------------------------------"
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
    /*
     * er age amra dekhsilam kivabe buffer gula pete hoy .. buffer gula jehetu continously ashte thake .. ta ke paowar jonno amader
     * event er maddhome pete hobe .. she REQUEST object er upore data event fire korte thake .. Sheta jodi amra listen kori
     * taholei kintu amra buffer gula pete thaki ..
     */
    const decoder = new StringDecoder("utf-8"); // StringDecoder vai .. tumi amake decode kore diba .. 'utf-8' hocche amar encoding
    // ei decoder object diye ami ekhon decode korte parbo ..

    const chosenHandler = routes[trimmedPath]
        ? routes[trimmedPath]
        : notFoundHandler;
    // exist korle shetai .. otherwise notFoundHandler // ekhane amra bujhe jabo je kon function ta call korte hobe
    // ⚡ ar ei chosenHandler ta .. jei handler ta hobe .. sheta jokhon ami call korbo .. tokhon ek e shathe oi handler ta jehetu
    // ei file er baire thakbe .. so shomsto request property jegula ami ektu age ber korechilam shegula kintu amake tar kase
    // pathiye dite hobe .. So ami shomosto request gula ke ekta alada object er moddhe dhukiye nicchi ..
    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    }; // chosenHandler function call korar shomoy ei request properties gula pathiye dibo ..
    /*....// chosenHandler call houwa mane holo sampleHandler er moto handler function gula call houwa .. to shei function gular modddhe
    // to besh kichu kaj korbe she .. kaj korar pore she nije ekta callback function call kore dibe .. shei callback function ta
    // chosenHandler er 2nd parameter hishebe likhsi ekhon
    chosenHandler(requestProperties, (statusCode, payLoad) => {
        // shei callback function er moddhe duita jinish ami nicchi.. jetar value ashbe.. sampleHandler er moto function gula theke
        // chosenHandler er moddhe jokhon ami response dibo .. response deowar shomoy amake ekta status code pathate hobe .. 200/400
        // shei statusCode tao amake ei sampleHandler ba jekono handler .. ekta callback function er maddhome pathiye dibe ..
        // and she response hishebe ki dite hobe .. sheta payLoad hishebe pathiye dibe .....
        statusCode = typeof statusCode === "number" ? statusCode : 500;
        payLoad = typeof payLoad === "object" ? payLoad : {};
        const payLoadString = JSON.stringify(payLoad);
        console.log("Choosen Handler is finished ");
        //🏅 return the final Response
        res.writeHead(statusCode);
        res.end(payLoadString);
    });
*/

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

        requestProperties.body = parseJSON(realData);
        // ete jeta hobe .. ekhane kono error khabe na .. hoy error er karone blank object dibe .. naile proper object thabe
        // so requestProperty.body er moddhe ekhon amar request er data ta thakbe

        chosenHandler(requestProperties, (statusCode, payLoad) => {
            // shei callback function er moddhe duita jinish ami nicchi..jetar value ashbe.. sampleHandler er moto function gula theke
            // chosenHandler er moddhe jokhon ami response dibo .. response deowar shomoy amake ekta status code pathate hobe.200/400
            // shei statusCode tao amake ei sampleHandler ba jekono handler .. ekta callback function er maddhome pathiye dibe ..
            // and she response hishebe ki dite hobe .. sheta payLoad hishebe pathiye dibe .....
            statusCode = typeof statusCode === "number" ? statusCode : 500;
            payLoad = typeof payLoad === "object" ? payLoad : {};
            const payLoadString = JSON.stringify(payLoad);
            console.log("Choosen Handler is finished ");
            //🏅 return the final Response
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(payLoadString);
        }); // ekhon realData jodi choosen Handler er moddhe kono karone proyojon hoy ... tahole use korte parbo ..
        ///////////////////////////////// console.log("🔵🟣", realData);
        // body te ja user Requested data er shathe pathacche .. sheta ekhon real data er moddhe paowa jacche ..
        // Requested body kivabe record korte hoy .. sheta amra dekhlam  ..
        //response handle ---------------------------------------------------------------------------------------
        // res.end("🔵🟣hello folks ! Response is end !");
        // ekhon maximum kaj hobe amader ei function er moddhe ..
    });
};

module.exports = handler;
