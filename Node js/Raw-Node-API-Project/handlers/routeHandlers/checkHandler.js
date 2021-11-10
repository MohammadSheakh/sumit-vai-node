// and eta jehetu user Handler er motoi hobe .. tai user handler er boylar plate ta copy kore niye ashlam ...

// TODO:   dependencies-section
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON, createRandomString } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const { maxChecks } = require("../../helpers/environment");
// TODO:  app object - module scaffolding (blank object) // eita te attach kore .. function gula export kora jay
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    console.log("checkHandler is checked ! from checkHandler.js");
    //checkHandler er maddhome jei request gula ashbe .. shegula onek rokom er hote pare .. selective kichu
    // request er baire kichu ashle shegula amra accept korbo na ..
    const acceptedMethods = ["get", "post", "put", "delete"];
    // ekhon check korte hobe .. ei array er moddhe requestProperties er method ta ase kina !
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        // na paile 0 er theke choto hobe .. thakle mane match korle 0 .. othoba onno kono index er shathe match korbe
        // array er moddhe element ase kina .. check korte hoy .indexOf method er maddhome ...
        handler._check[requestProperties.method](requestProperties, callback); // function ta amader ke call kore dite hobe
    } else {
        callback(450);
        // eta ekta convention.. requst allow na korte chaile 405 Status Code dite hoy ... jemon success er khetre
        // 200 status code dite hoy ..
    }
    // callback(200, {
    //     message: "This is check handler / url ! You are not allowed !",
    // });
};
// ami handlers arekta container banacchi .. mane arekta scaffolding banacchi ..
handler._check = {}; // handler to amar scaffolding .. tar moddhe service gula ke shob shomoy underscore diye likhi
// arki .. mane _check ta ektu private property arki ..

//===============================================================🚦🟡🔵🔰============== handler._check.post
// ekhon amra handler._check er shob gula method er jonno function banabo ..
handler._check.post = (requestProperties, callback) => {
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    // kivabe check Create kora jay
    // validate inputs
    // ki ki jinish user check er jonno add korbe . ?  user ekta link add korbe .. sheta http / https o hote pare ..
    // tai shobar age protocol nam e ekta jinish add korbe
    // er pore she URL ta dibe .. mane http er porer jei part ta something.com/something .. ei type er
    // er pore she method ta amader bole dibe .. je she kon kon method ashole track korte chay
    // mane she amake ekta link dilo .. amra jokhon hit korbo .. amader system oi domain.com e ki GET request pathiye check korbe
    // naki POST request pathiye check korbe ..  shei jinish ta amra nibo ...
    // ar arekta jinish hocche . success code ta input nibo amra user er kas theke .. she jei link ta add korse .. shei link
    // er kase success mane ki ? 200 /201/ 300 -> konta ? .. shetao amra input nibo .. oita ekta array hobe arki
    // arekta hoce .. timeout seconds arki .. mane amra jokhon hit korbo oi URL gula te .. shei URL gula to emon o hote pare
    // je 10 second dhore amader kono response dicche na .. so amra user er kase input niye rakhbo je .. kotokkhon porjonto
    // amar system wait korbe .. tomar oi .. URL e hit korar pore .. 5 second likhle .. 5 second er moddhe jodi response na ashe
    // tahole amra timeout dhore niye shei link ke amra downTime kore dibo
    //🔰🔥 so ei koyta input ashole amader .. check create korar jonno lagbe .. so shei shei input tahole amar POST Request e
    // ashbe .. and shegula amader ke validate korte hobe .. ekhon amra shegula ekta ekta kore validate korbo
    let protocol =
        typeof requestProperties.body.protocol === "string" &&
        ["http", "https"].indexOf(requestProperties.body.protocol) > -1 // dekhte chacchi array tar moddhe protocol ta ase kina
            ? requestProperties.body.protocol //
            : false;
    let url =
        typeof requestProperties.body.url === "string" &&
        requestProperties.body.url.trim().length > 0 // jeno she blank kichu na dey
            ? requestProperties.body.url
            : false;
    // method ja kichui hote pare.. GET, POST, PUT, DELETE .. ei 4 tar moddhe jekono ekta hote hobe
    let method =
        typeof requestProperties.body.method === "string" &&
        ["GET", "POST", "PUT", "DELETE"].indexOf(
            requestProperties.body.method
        ) > -1 // // dekhte chacchi array tar moddhe protocol ta ase kina ..   > -1 mane .. sheta ase
            ? requestProperties.body.method
            : false;

    // JavaScript e array er type hocche object .. object kina sheta to check korte hobei .. tar shathe array kina .. shetao
    // check korte hobe.. instanceOf diye check kora jabe sheta ki array kina .. instanceOf mane kisher instance sheta ..
    // array er naki object er
    let successCodes =
        typeof requestProperties.body.successCodes === "object" &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;
    // kotokkhon shomoy porjonto ami wait korbo // whole number check korlam
    // minumus 1 second jeno hoy
    let timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === "number" &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        // ekhon prothom kaj hocche User first e token na pathale to ar amra ta ke allow korbo na
        // karon user jodi kono url add korte chay monitor korar jonno .. definately ta ke age log in kore nite hobe ..
        // so amake ekhane authentication checking tai korte hobe ..
        // so ami expect korbo user request er header e obosshoi token ta diyeche // small letter expect kore tokenid likhata
        let tokenID =
            typeof requestProperties.headersObject.tokenid === "string"
                ? requestProperties.headersObject.tokenid
                : false;

        // tokenID jehetu peye giyechi .. ekhon ei tokenID er shathe associated jei user er phone number ta ase .. sheta ekhon
        // amader ber kore niye ashte hobe // look up the user phone by look up the token
        data.read("tokens", tokenID, (err, tokenData) => {
            if (!err && tokenData) {
                let userPhone = parseJSON(tokenData).phone;
                // ser er phone number ta ber korlam .. ekhon oi phone number dia user data base theke user er information ber korbo

                data.read("users", userPhone, (err, userData) => {
                    if (!err && userData) {
                        // finally ekhon amader token verify korte hobe // so amader tokenHandler ta lagbe
                        tokenHandler._token.verify(
                            tokenID,
                            userPhone,
                            (istokenValid) => {
                                if (istokenValid) {
                                    // token Valid hoile amar baki kaj // ekhane amra sure token valid and expire kore nai
                                    let userObject = parseJSON(userData); // String ke JSON formate kore nilam

                                    // userObject er check nam e ekta property add korte chacchi
                                    // check property er moddhe array akare tar shob check save thakbe
                                    // ashole check thakbe onno database e .. user er shathe shudhu check er uniqueID assign kora
                                    // thakbe   // jehetu sheta array .. ejonno check korte hobe sheta object kina
                                    // alse userObject.checks eita Array er instance kina shetao check korte hobe
                                    let userChecks =
                                        typeof userObject.checks === "object" &&
                                        userObject.checks instanceof Array
                                            ? userObject.checks
                                            : []; // na thakle blank array return korbe .. jeta kaj korar upojukto

                                    // maxChecks ta environment variable theke ashse
                                    if (userChecks.length < maxChecks) {
                                        // shob kichu ok .. first e random checkID create korbo
                                        let checkID = createRandomString(20); // check database e save korte hole
                                        // jei unique ID ta lage .. sheta ami create korlam
                                        // ekhon check Object create korbo ekta .. jeta ami database e finally
                                        // save korbo
                                        let checkObject = {
                                            id: checkID,
                                            userPhone: userPhone,
                                            protocol: protocol,
                                            url: url,
                                            method: method,
                                            successCodes: successCodes,
                                            timeoutSeconds: timeoutSeconds,
                                        };

                                        // ekhon ami object ta database e save korbo
                                        data.create(
                                            "checks",
                                            checkID,
                                            checkObject,
                                            (err) => {
                                                if (!err) {
                                                    // ami to create kore felechi checkObject ta amar database e
                                                    //.. ekhon amar user keo shetar ekta instance pete hobe
                                                    // user er checkID property te checkObject ta assign korte hobe
                                                    // add checkID to the user's object
                                                    userObject.checks =
                                                        userChecks; // userChecks array ta assign
                                                    // korlam .. ekhon shei array te checkObject gula push korte hobe
                                                    // sorry shudhu ID assign korbo ..full Object rakhbo na
                                                    userObject.checks.push(
                                                        checkID
                                                    );
                                                    // So amar final User Object Ready hoye gelo
                                                    // Now save the new User Data
                                                    // user object jehetu already database e ase .. tai ekhon amake
                                                    // shudhu update korte hobe
                                                    data.update(
                                                        "users",
                                                        userPhone,
                                                        userObject,
                                                        (err) => {
                                                            if (!err) {
                                                                // return the data about the new check
                                                                callback(
                                                                    200,
                                                                    checkObject
                                                                );
                                                                // checkObject tai return kore dilam .. jeno
                                                                // oi pasher user dekhte pare .. ki pelo she
                                                            } else {
                                                                callback(500, {
                                                                    error: "Server side error .. ",
                                                                });
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    callback(500, {
                                                        error: "Server side error .. ",
                                                    });
                                                }
                                            }
                                        );
                                    } else {
                                        callback(401, {
                                            error: "user has already reached max check limit",
                                        });
                                    }
                                } else {
                                    callback(403, {
                                        error: "Authentication problem token is not valid checkHandler",
                                    });
                                }
                            }
                        );
                    } else {
                        callback(403, {
                            error: "User not found in checkHandler",
                        });
                    }
                });
            } else {
                callback(403, {
                    error: "Authentication problem checkHandler.",
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your request checkHandler",
        });
    }
};

//===============================================================🚦🟡🔵🔰============== handler._check.get
// authentication lagbe .. tai kore felsi
handler._check.get = (requestProperties, callback) => {
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    // GET er jonno POSTman theke ID ashbe queryString hishebe .. tokenHandler e ei kaj ta korechilam .. oi khan theke copy kortesi
    // and amra ta ke check object ta..mane check er details full ta ke diye dibo
    //// http://localhost:3000/user?phone=01790583345 .. ei je erokom .. eta hocche query String ..
    //// erokom jodi dey .. tahole amra corresponding user er information ene client ke dibo .. That's our goal
    // .. queryString object ta kintu amader handleReqRes() e ase .. and amra sheta requestProperties er moddhe pathiye diyechilam
    // check the check ID if valid // karon ekhane check ID ashbe
    // ebar ar amar requestProperties.body hobe na .. ebar hobe requestProperties.queryStringObject
    const checkID =
        typeof requestProperties.queryStringObject.checkid === "string" &&
        requestProperties.queryStringObject.checkid.trim().length === 20 // karon amra 20 charecter er checkID banaisilam
            ? requestProperties.queryStringObject.checkid
            : false;

    if (checkID) {
        // look up the check from database
        data.read("checks", checkID, (err, checkData) => {
            if (!err && checkData) {
                // ekhane authenticated user cheking korte hobe .. header theke tokenID niye ashte hobe
                // so ami expect korbo user request er header e obosshoi token ta diyeche // small letter expect kore tokenid likhata
                let tokenID =
                    typeof requestProperties.headersObject.tokenid === "string"
                        ? requestProperties.headersObject.tokenid
                        : false;
                // ekhon amake ei tokenID tar verification korte hobe

                tokenHandler._token.verify(
                    tokenID,
                    parseJSON(checkData).userPhone,
                    (tokenIsValid) => {
                        if (tokenIsValid) {
                            // valid hole ..CheckData ta diye dibo arki
                            console.log("Finally GET method is done");
                            callback(200, parseJSON(checkData));
                        } else {
                            callback(403, {
                                error: ".UnAuthentication Error checkHandler Get Method Authentication failure token is not valid",
                            });
                        }
                    }
                );
            } else {
                callback(500, {
                    error: "Server side error ",
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your request",
        });
    }
};

//===============================================================🚦🟡🔵🔰============== handler._check.put
// authentication lagbe .. tai kore felsi
handler._check.put = (requestProperties, callback) => {
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    // update korar jonno POST man theke request er shathe ID pabo
    // check er id pabo .. jei check ta user update korte chacche .. shei ID ta she amake pass korbe ..
    // taile ekhon ID verification korte hobe
    const checkID =
        typeof requestProperties.body.id === "string" &&
        requestProperties.body.id.trim().length === 20 // karon amra 20 charecter er checkID banaisilam
            ? requestProperties.body.id
            : false;
    console.log(requestProperties.body.checkid);

    let protocol =
        typeof requestProperties.body.protocol === "string" &&
        ["http", "https"].indexOf(requestProperties.body.protocol) > -1 // dekhte chacchi array tar moddhe protocol ta ase kina
            ? requestProperties.body.protocol //
            : false;
    let url =
        typeof requestProperties.body.url === "string" &&
        requestProperties.body.url.trim().length > 0 // jeno she blank kichu na dey
            ? requestProperties.body.url
            : false;
    // method ja kichui hote pare.. GET, POST, PUT, DELETE .. ei 4 tar moddhe jekono ekta hote hobe
    let method =
        typeof requestProperties.body.method === "string" &&
        ["GET", "POST", "PUT", "DELETE"].indexOf(
            requestProperties.body.method
        ) > -1 // // dekhte chacchi array tar moddhe protocol ta ase kina ..   > -1 mane .. sheta ase
            ? requestProperties.body.method
            : false;

    // JavaScript e array er type hocche object .. object kina sheta to check korte hobei .. tar shathe array kina .. shetao
    // check korte hobe.. instanceOf diye check kora jabe sheta ki array kina .. instanceOf mane kisher instance sheta ..
    // array er naki object er
    let successCodes =
        typeof requestProperties.body.successCodes === "object" &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;
    // kotokkhon shomoy porjonto ami wait korbo // whole number check korlam
    // minumus 1 second jeno hoy
    let timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === "number" &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;

    // ekhon amra dekhbo .. minumum ekta input diyeche .. ar CheckID ta valid kina
    if (checkID) {
        if (protocol || url || method || successCodes || timeoutSeconds) {
            // ekhane prothom e token verify korte hobe .. tar mane phone number lagbe ..
            // tar mane checkDatabase ta read kore ashte hobe
            data.read("checks", checkID, (err, checkData) => {
                if (!err && checkData) {
                    // checkData ta hocche String eta niye kaj kora jabe na .. eta ke check object baniye felte
                    // hobe ... mane parseJSON korte hobe
                    let checkObject = parseJSON(checkData);
                    // ekhon amader token ta lagbe .. header theke jei token ta ashse ..
                    let tokenID =
                        typeof requestProperties.headersObject.tokenid ===
                        "string"
                            ? requestProperties.headersObject.tokenid
                            : false;
                    // ebar amader ke token ta verify korte hobe ..
                    tokenHandler._token.verify(
                        tokenID,
                        checkObject.userPhone,
                        (istokenValid) => {
                            if (istokenValid) {
                                // token Valid hoile amar baki kaj // ekhane amra sure token valid and expire kore nai
                                // ekhon amra final update korar kaj ta korbo
                                if (protocol) {
                                    checkObject.protocol = protocol;
                                }
                                if (url) {
                                    checkObject.url = url;
                                }
                                if (method) {
                                    checkObject.method = method;
                                }
                                if (successCodes) {
                                    checkObject.successCodes = successCodes;
                                }
                                if (timeoutSeconds) {
                                    checkObject.timeoutSeconds = timeoutSeconds;
                                }
                                // shob thik thak thakle .. finally check object ta store kore dilei amar hoye jacche
                                data.update(
                                    "checks",
                                    checkID,
                                    checkObject,
                                    (err) => {
                                        if (!err) {
                                            callback(200);
                                        } else {
                                            callback(500, {
                                                error: "there was a server side error in data update part database close ",
                                            });
                                        }
                                    }
                                );
                            } else {
                                callback(403, {
                                    error: "token verification failed ! Authentication error",
                                });
                            }
                        }
                    );
                } else {
                    callback(400, {
                        error: "there was a problem in the server side ",
                    });
                }
            });
        } else {
            callback(400, {
                error: "You must provide at least one field to update ",
            });
        }
    } else {
        callback(400, {
            error: "You have a problem in your request in update check Handler",
        });
    }
};
//===============================================================🚦🟡🔵🔰==============handler._check.delete
// authentication lagbe .. tai kore felsi
handler._check.delete = (requestProperties, callback) => {
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    // Delete e GET er moto ID ta ashbe ..
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    // GET er jonno POSTman theke ID ashbe queryString hishebe .. tokenHandler e ei kaj ta korechilam .. oi khan theke copy kortesi
    // and amra ta ke check object ta..mane check er details full ta ke diye dibo
    //// http://localhost:3000/user?phone=01790583345 .. ei je erokom .. eta hocche query String ..
    //// erokom jodi dey .. tahole amra corresponding user er information ene client ke dibo .. That's our goal
    // .. queryString object ta kintu amader handleReqRes() e ase .. and amra sheta requestProperties er moddhe pathiye diyechilam
    // check the check ID if valid // karon ekhane check ID ashbe
    // ebar ar amar requestProperties.body hobe na .. ebar hobe requestProperties.queryStringObject
    const checkID =
        typeof requestProperties.queryStringObject.checkid === "string" &&
        requestProperties.queryStringObject.checkid.trim().length === 20 // karon amra 20 charecter er checkID banaisilam
            ? requestProperties.queryStringObject.checkid
            : false;

    if (checkID) {
        // look up the check from database
        data.read("checks", checkID, (err, checkData) => {
            if (!err && checkData) {
                // ekhane authenticated user cheking korte hobe .. header theke tokenID niye ashte hobe
                // so ami expect korbo user request er header e obosshoi token ta diyeche // small letter expect kore tokenid likhata
                let tokenID =
                    typeof requestProperties.headersObject.tokenid === "string"
                        ? requestProperties.headersObject.tokenid
                        : false;
                // ekhon amake ei tokenID tar verification korte hobe
                tokenHandler._token.verify(
                    tokenID,
                    parseJSON(checkData).userPhone,
                    (tokenIsValid) => {
                        if (tokenIsValid) {
                            // valid hole ..CheckData ta diye dibo arki
                            console.log("Finally GET method is done");
                            // Delete er jonno ekhane Final kaj korte hobe amader// delete the check data
                            data.delete("checks", checkID, (err) => {
                                if (!err) {
                                    // amra shudhu matro checks ta delete korlam .. kintu user er moddheo je check id ta assign kora chilo
                                    // shetao ekhon delete korte hobe .. user er database theke
                                    data.read(
                                        "users",
                                        parseJSON(checkData).userPhone,
                                        (err, userData) => {
                                            if (!err && userData) {
                                                userObject =
                                                    parseJSON(userData);
                                                // ekhon userCheck object ta ke niye ashte hobe
                                                let userChecks =
                                                    typeof userObject.checks ===
                                                        "object" &&
                                                    userObject.checks instanceof
                                                        Array
                                                        ? userObject.checks
                                                        : [];
                                                // remove the deleted check id from user's list of check
                                                // age amake jante hobe user object er check array tar koto number check ta amake
                                                // delete korte hobe
                                                let checkPosition =
                                                    userChecks.indexOf(checkID);
                                                // ei just ei position er id ta amra delete kore dibo users theke
                                                if (checkPosition > -1) {
                                                    // mane she id ta peyeche
                                                    userChecks.splice(
                                                        checkPosition,
                                                        1
                                                    ); // vanila js er delete korar system
                                                    // ekhon amra user ta update korbo arki
                                                    userObject.checks =
                                                        userChecks;
                                                    data.update(
                                                        "users",
                                                        userObject.phone,
                                                        userObject,
                                                        (err) => {
                                                            if (!err) {
                                                                callback(200);
                                                            } else {
                                                                callback(500, {
                                                                    error: "There was a server side problem ",
                                                                });
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    callback(500, {
                                                        // mane she id ta pay nai
                                                        error: "There was a server side problem  check id was not found in users... that you are trying to remove",
                                                    });
                                                }
                                            } else {
                                                callback(500, {
                                                    error: "There was a server side problem ",
                                                });
                                            }
                                        }
                                    );
                                } else {
                                    callback(500, {
                                        error: "There was a server side problem ",
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                error: ".UnAuthentication Error checkHandler Get Method Authentication failure token is not valid",
                            });
                        }
                    }
                );
            } else {
                callback(500, {
                    error: "Server side error ",
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your request",
        });
    }
};

module.exports = handler;
