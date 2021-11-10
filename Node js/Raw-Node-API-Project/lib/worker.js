/* Title : Workers Library
 * Description : Worker related files
 * Author : Mohammad Bin Ab. Jalil Sheakh-----------------📞 0151-8419801, 01790-583345
 * Updated Date : --21 (Please update the error date also)
 * facebook id : https://www.facebook.com/mohammadsheakh.mern/ 🌐 Git Hub : https://github.com/MohammadSheakh
 * Mail : mohammad.sheakh@gmail.com
 */
// TODO: dependencies
const data = require("./data");
const { parseJSON } = require("../helpers/utilities");
const url = require("url");
const http = require("http");
const https = require("https");
const { sendTwilioSms } = require("../helpers/notifications");

// TODO: ... object - module scaffolding
const worker = {};
// TODO: configurations
//

// performCheck
worker.performCheck = (originalCheckData) => {
    // originalCheckData tai hocche check .. shekhane url ase .. sheta parse kore .. shekhane request pathate hobe
    // request pathanor jonno .. request prepare korte hobe amader ke ekhon ..
    // parse the hostname [www part] and full url  from original data
    let parseUrl = url.parse(
        originalCheckData.protocol + "://" + originalCheckData.url,
        true
    );
    // queryString o receive korbo .. mane user jetai pathabe .. shetai receive korbo .. ejonno true pathailam

    // initial the checkOutCome // jeta amra next process e pathabo // request kore response pabo amra eita
    let checkOutCome = {
        error: false,
        responseCode: false,
    };
    // mark the outCome has not been send yet
    let outComeSend = false; // mane outCome ami already next process e pathiye diyechi kina

    const hostName = parseUrl.hostname;
    const path = parseUrl.path; // path means with queryString .. pathname : without queryString

    // construct the request
    const requestDetails = {
        protocol: originalCheckData.protocol + ":",
        hostname: hostName,
        method: originalCheckData.method.toUpperCase(),
        path: path,
        timeout: originalCheckData.timeoutSeconds * 1000,
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ekhon amake decide korte hobe .. ami http module diye pathabo naki ami https module diye pathabo
    const protocolToUse = originalCheckData.protocol === "http" ? http : https;

    let req = protocolToUse.request(requestDetails, (res) => {
        // grab the status code // status of the response  // karon status dekhei ami bujhte parbo ..up na down
        const status = res.statusCode;
        console.log("status code : 🛑", status);

        // update the check outcome and pass to the next process

        // mane jeta pelam .. sheta ekhon database e update korte hobe......................................................
        // res ashar agei kintu amar error event fire hoye jete pare .. error event fire hoye geleo kintu amake somehow ..
        // check outcome .. jeta amra korte chacchi .. sheta kintu korte hoite pare .. mane jei response pailam sheta database e
        // update kora .. abar amake arekta event o kintu listen korte hobe .. sheta hocche ki .. timeout ..  karon timeout hoye
        // geleo kintu amar status code ashbe na .. tar agei .. kintu shesh hoye jabe ..
        // so status code porjonto kintu ami boshe thakte parbo na ..
        // so same kaj amake 3 jaygay korte hobe ..mane ei jaygay ami jeta korbo ... sheta amake req.on("err") and
        // req.on("timeout") er moddheo korte hobe  .. jar karone amake track rakhte hobe .. karon 3 ta jayga .. status paowar por
        // jekono jayga thekei ashte pare .. mane request korar pore .. response paowar agei .. error ba timeout egula call hoye
        // jete pare .. jar karone ei 3 tar jekono ekta jayga thekei ami end hoye jete pari ..abar response o pelam abar error
        // er moddheo gelo .. shetao kintu hote pare .. abar response o pelam abar timeout er moddheo gelo .. shetao kintu hoite pare ..
        // error .. timeout .. duitao ashte pare .. jeno amar porer jei kaj ta ami korbo .. mane { update the check outcome and pass to
        // to the next process} .. mane porer process function e pathabo .. porer process function kintu mainly database e save korbe
        // shomosto check outcome jeta ase .. sheita kintu multiple time hoye jete pare .. amar ekhetre.. jodi ami sheta check
        // na kori .. tahole sheta amader check korte hobe .. already sheta database e save kore felechi kina .. jekhan thekei
        // ashuk na keno .. sheta ei function othoba err othoba timeout function thekeo ashte pare .. tahole amake ekhane ekta
        // variable dia track rakhte hobe je .. checkOutCome ami already peyechi kina .. and sheta already porer process function
        // ke  pathiye diyechi kina .. jeno duibar kajta na hoye jay .. tahole sheta ke track rakhar jonno amra upore .. ei
        // function er baire ekta variable declare or function kichu ekta likhi .. # initialCheckOutCome

        // update the check outcome and pass to the next process
        checkOutCome.responseCode = status;
        if (!outComeSend) {
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outComeSend = true;
        }
    });
    // request ta send korbo kivabe ami .. send korbo req.end() er maddhome
    // kintu amra jani request er jei response ashe .. sheta kintu ek bar e ashe na ..sheta buffer akare ashe .. so amader ke
    // ashole event listen korte hoy response er .. so amader ke ekta error event listen korte hobe .. kono error hoyeche kina
    req.on("err", (err) => {
        let checkOutCome = {
            error: true,
            errorValue: err,
        };
        // update the check outcome and pass to the next process
        if (!outComeSend) {
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outComeSend = true;
        }
    });
    req.on("timeout", () => {
        let checkOutCome = {
            error: true,
            errorValue: "timeout",
        };
        // update the check outcome and pass to the next process
        if (!outComeSend) {
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outComeSend = true;
        }
    });

    req.end();
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// processCheckOutcome function er kaj hocche database e save kora ..jei outcome ta ami pelam .. and database e properly sheta
// mark kore rakha .. last check koto hoilo .. and shetar outcome ki peyechilam .. and finally amake ki korte hobe ?
// jodi .. state age ja chilo .. tar theke change hoy .. tahole amra user ke ekta sms pathabo down theke up ba up theke down
// hoile user ke amra twiloi api er function ta use kore user ke notification pathabo

worker.processCheckOutcome = (originalCheckData, checkOutCome) => {
    // check if check outCome is up or down !
    let state =
        !checkOutCome.error &&
        checkOutCome.responseCode &&
        originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1
            ? "up"
            : "down";
    // mane error jodi false hoy .. karon error thakle true ashbe
    // checkOutCome.responseCode jeno thake .. and eita ar user jei responseCode set kore diyechilo ba rekhese .. ei duita
    // same hoite hobe .. amra kintu user er kas theke successCode niye rekhechilam .. amake ekhon dekhte hobe ..
    // checkOutCome.responseCode jeta peyechi .. sheta user er successCode array er moddhe ase kina

    // ekhon amader check korte hobe .. amra ashole alert pathabo ki pathabo na ! mane amader check korte hobe
    // status age ja chilo .. tar theke change hoyeche kina .. shob shomoy up thakle to ar ami sms pathabo na .. down holei sms
    // jabe ..

    // decide whether we should alert the user or not
    let alertWanted =
        originalCheckData.lastChecked && originalCheckData.state != state
            ? true
            : false;
    //
    let newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    // update the check to disk
    data.update("checks", newCheckData.id, newCheckData, (err) => {
        if (!err) {
            // send checkData to next process
            if (alertWanted) {
                worker.alertUserToStatusChange(newCheckData);
            } else {
                console.log("Alert is not needed as there is no state change");
            }
        } else {
            console.log(
                "Error Trying to save check data of one of the checks "
            );
        }
    });
};

// send notification sms if state changes
worker.alertUserToStatusChange = (newCheckData) => {
    // user ke jei sms ta pathabo .. sheta age ektu consider kore nei
    let msg = `Alert : Your check for ${newCheckData.method.toUpperCase()} ${
        newCheckData.protocol
    }:// ${newCheckData.url} is currenty ${newCheckData.state}`;

    sendTwilioSms(newCheckData.userPhone, msg, (err) => {
        if (!err) {
            console.log(
                `User was alerted to a status change via SMS :  ${msg}`
            );
        } else {
            console.log("there was a problem sending sms to one of the users");
        }
    });
};

// validate individual check data
worker.validateCheckData = (originalCheckData) => {
    if (originalCheckData && originalCheckData.id) {
        originalCheckData.state =
            typeof originalCheckData.state === "string" &&
            ["up", "down"].indexOf(originalCheckData.state) > -1
                ? originalCheckData.state
                : "down";
        originalCheckData.lastChecked =
            typeof originalCheckData.lastChecked === "number" &&
            originalCheckData.lastChecked > 0
                ? originalCheckData.lastChecked
                : false;
        // validation done ... pass to the next process
        worker.performCheck(originalCheckData); // mane check er moddhe request pathano .. output dekha
    } else {
        console.log(
            "Error : Check was not properly formatted or not have any unique id in worker.js"
        );
    }
};

// lookup all the checks for Database for the first time and then remember it
worker.gatherAllChecks = () => {
    //get all the checks from database
    data.list("checks", (err, checks) => {
        // kon folder e khujbo .. // err back pattern // checks gula ashbe

        if (!err && checks && checks.length > 0) {
            checks.forEach((check) => {
                // read the check Data
                // file er nam e jehetu check
                let refinedCheck = check.trim();

                data.read("checks", refinedCheck, (err, originalCheckData) => {
                    if (!err && originalCheckData) {
                        // pass the data to next process which is check validator
                        // ekhon amra check er data validation korbo
                        // prottekta check er moddhe diye jehetu iterate korsi .. eder moddhe jei jei URL e hit
                        // korte hobe .. oi oi kaj gulai amake korte hobe ..
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log(
                            "Error :   Reading one of the check data in worker.js 😰"
                        );
                    }
                });
            });
        } else {
            console.log(
                "Error :  Could not find any check to process in worker.js gather all check function "
            );
        }
    });
};

//timer to execute the worker process once per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000 * 10);
};
// start the workers
worker.init = () => {
    console.log("Worker is working right now !");
    // execute all the checks
    worker.gatherAllChecks();

    // call the loop so that check checking continue
    worker.loop();
};
// TODO: export the module
module.exports = worker;
