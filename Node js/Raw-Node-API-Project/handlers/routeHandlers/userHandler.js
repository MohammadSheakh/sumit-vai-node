// and eta jehetu Sample Handler er motoi hobe .. tai sample handler er boylar plate ta copy kore niye
// ashi ...
// TODO:   dependencies-section
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
// TODO:  app object - module scaffolding (blank object) // eita te attach kore .. function gula export kora jay
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    console.log("userHandler is checked ! from userHandler.js");
    //userHandler er maddhome jei request gula ashbe .. shegula onek rokom er hote pare .. selective kichu
    // request er baire kichu ashle shegula amra accept korbo na ..
    const acceptedMethods = ["get", "post", "put", "delete"];
    // ekhon check korte hobe .. ei array er moddhe requestProperties er method ta ase kina !
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        // na paile 0 er theke choto hobe .. thakle mane match korle 0 .. othoba onno kono index er shathe match korbe
        // array er moddhe element ase kina .. check korte hoy .indexOf method er maddhome ...
        handler._users[requestProperties.method](requestProperties, callback); // function ta amader ke call kore dite hobe
    } else {
        callback(450);
        // eta ekta convention.. requst allow na korte chaile 405 Status Code dite hoy ... jemon success er khetre
        // 200 status code dite hoy ..
    }
    // callback(200, {
    //     message: "This is user handler / url ! You are not allowed !",
    // });
};
// ami handlers arekta container banacchi .. mane arekta scaffolding banacchi ..
handler._users = {}; // handler to amar scaffolding .. tar moddhe service gula ke shob shomoy underscore diye likhi
// arki .. mane _users ta ektu private property arki ..
// ekhon amra handler._users er shob gula method er jonno function banabo ..
handler._users.post = (requestProperties, callback) => {
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    //new user create korbo ekhane ..
    // user er kas theke je amra data collect korbo .. shegula field er value gula amader kase
    // request akare ashbe .. request er body hishebe ashbe ..
    //-----------------------------------------------------
    // ebar ami first jeta korbo .. ami jei jei field ekhane expect korchi .. shegular ekhon validation check korbo first e
    const firstName =
        typeof requestProperties.body.firstName === "string" &&
        requestProperties.body.firstName.trim().length > 0 &&
        requestProperties.body.firstName.trim().length < 20
            ? requestProperties.body.firstName
            : false; // thik thakle nam ta nilam .. otherwise false kore dilam ..
    const lastName =
        typeof requestProperties.body.lastName === "string" &&
        requestProperties.body.lastName.trim().length > 0 &&
        requestProperties.body.lastName.trim().length < 20
            ? requestProperties.body.lastName
            : false;
    const phone =
        typeof requestProperties.body.phone === "string" &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === "string" &&
        requestProperties.body.password.trim().length > 5
            ? requestProperties.body.password
            : false;
    // term of service Agreement
    const tosAgreement =
        typeof requestProperties.body.tosAgreement === "boolean"
            ? requestProperties.body.tosAgreement
            : false;
    console.log(
        "🔵🟣",
        requestProperties.body.firstName,
        requestProperties.body.lastName,
        requestProperties.body.phone,
        requestProperties.body.password,
        requestProperties.body.tosAgreement
    );
    console.log("🟣🔵", firstName, lastName, phone, password, tosAgreement);
    //validation er kahini kintu shesh // jehetu shob gulai required .. tai shob gulai check kortesi ..
    if (firstName && lastName && phone && password && tosAgreement) {
        // shob gula true holei amar mainly kaj .. validation done amar ekhane .. ekhon user add korbo amra.. kintu tar age check
        // korte hobe user already ase kina .. user er nam e already file theke thakle to abar oi nam e file ar create korbo na !
        // jehetu data folder e users nam e arekta folder er moddhe .. mobile number.json diye prottekta user er data save korbo
        // so check korar jonno .. age database read kore dekhte hobe .. ei mobile number er kono user already ase kina
        data.read("users", phone, (err) => {
            // error back pattern .. first e error then jei data ta pabo .. shetar nam dilam user
            if (err) {
                // jokhon ami data read korsi .. amar kintu ekhane error tai proyojon .. karon read  er khetre amra jani
                // oi nam e jodi already file theke thake .. tahole amader error dibe ..
                // ekhon file already theke thakle ami kintu insert korbo na .. shoja kotha .. tokhon e ami insert korte dibo ..
                // tokhon file na thake .. tar mane jodi error hoy.. read kore jodi khuje na paowa jay tahole..
                // user save korar jonno ready ekhon amra  // insert korte hobe amader  // tar mane data.write call korte hobe
                // data write korar age .. amader user er jei shob data ase .. shegula diye ekta object baniye nei
                // ekhon password to shora shori save korle hobe na .. password e hash kore database e rakhte hobe
                // shei hashing korar jonno amader ke arekta lib function banate hobe (utility er moddhe) help : node er core module
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // jei object ta insert korte hobe .. sheta ami prepared kore fellam
                // ekhon amra data / User Store korar jonno ready amader database e
                data.create("users", phone, userObject, (err) => {
                    //kon folder, kon file e , ki data , finally callback
                    if (!err) {
                        callback(200, {
                            message: "user was created successfully !",
                        });
                    } else {
                        // error hole callback diye dite hobe ..
                        // ekhane error houa mane oi side theke kono error hoyeche library te
                        callback(500, { error: "could not create user !" });
                        //status code 500 mane server side error
                    }
                });
            } else {
                // error na houa mane ei file ta khuje paowa gese .. already ei nam e user ase ..
                callback(500, {
                    error: "There was a problem in server side | Already an account assigned to this phone number ",
                }); // 500 karon server side e problem .. client er kono problem na ..
            }
        }); // users folder er moddhe ami check korbo , then.. phone.json nam e file ta hobe ..
        // kintu .json keno bolte hobe na .. sheta bujhlam na ⚫🟤 sorry 😁 data.js file e lib.read() e .json add kora ase
    } else {
        // otherwise ekhan thekei error provide korbo ..
        callback(400, {
            error: "there is a problem in your request. Please provide proper data",
        }); // user er error hoyeche erokom khetre status dite hoy 400 // client er request er kono problem thakle by convention 400 dite hoy
        // there is a problem in your request
        console.log(
            "there is a problem in your request. Please provide proper data"
        );
    }
};

// authentication lagbe .. tai kore felsi
handler._users.get = (requestProperties, callback) => {
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    // Get Route e amader kaj ki hobe ? amra first e check korbo .. get mane ki ! kono ekta user er information ..
    // post man e method GET select korar por .. query String akare .. she user er phone number ta dhoren dibe
    // http://localhost:3000/user?phone=01790583345 .. ei je erokom .. eta hocche query String ..
    // erokom jodi dey .. tahole amra corresponding user er information ene client ke dibo .. That's our goal

    // .. queryString object ta kintu amader handleReqRes() e ase .. and amra sheta requestProperties er moddhe pathiye diyechilam
    // check the phone number if valid
    // ebar ar amar requestProperties.body hobe na .. ebar hobe requestProperties.queryStringObject
    const phone =
        typeof requestProperties.queryStringObject.phone === "string" &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {
        // validation thik thakle ami kaj korbo // success block
        // ekhane kaj hocche oi user ta ke khuje ber kora .. // data library ta use korte hobe
        // 🔰🔥 ekhane amader ekhon veryfy korte hobe.. amra expect korbo user request er header e tokenObject ta pathabe ..
        // request er header ta amader request properties er moddhe ase .. request properties ta ashse amader handleReqRes file er
        // chosenHandler function theke shekhane .. requestProperties er moddhe headersObject Push kore deowa hoye chilo
        // verify token // headersObject e tokenID nam e token pathate hobe
        let tokenID =
            typeof requestProperties.headersObject.tokenid === "string"
                ? requestProperties.headersObject.tokenid
                : false;
        // tokenHandler jehetu ei file e niye ashsi .. etar _token.verify() function dia ekhon ami ekta checking kore felte parbo
        tokenHandler._token.verify(tokenID, phone, (tokenVerified) => {
            console.log(tokenVerified);
            if (tokenVerified) {
                // Token ID valid hole baki kaj gula korbo ekhon
                data.read("users", phone, (err, u) => {
                    // u basically valid javaScript object na .. eta kintu String .. file system theke direct pacchi ..
                    // tahole amake take parse kore nite hobe valid javaScript object e .. utilities er moddhe parseJSOn function ase

                    const user = { ...parseJSON(u) }; // ekhon user er moddhe valid object assign hoilo
                    // 🔰tar por amra take spread kore felsi .. immutably copy hoilo arki
                    // ekta object ke spread kore arekta variable er moddhe rakhle .. sheta ashole copy hoye jay ..
                    // deeply nested hole ei procedure ta kaj kore na (immutably copy hoy na) .. single level object er belay kaj kore ..

                    if (!err && user) {
                        // error jodi na thake ar user er data jodi asholei paowa jay ..
                        // user er information dibo .. kintu user er password remove kore nite hobe..karon password amra share korte chai na
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: "Requested user was not found ! .. Currently we are in userHandler.js GET method .. data.read",
                        });
                    }
                });
                // folder name , file name , callback..error back pattern.. error er shathe data o pabo.. jeta user .. mane user er data
            } else {
                callback(403, {
                    error: "Authentication Failed",
                }); // unauthenticated er jonno 403 dite hoy
            }
        });
    } else {
        // otherwise ami ekhane ekta error diye dibo
        callback(404, {
            error: "Requested user was not found ! .. Currently we are in userHandler.js GET method",
        }); // user er kono vul hole amra 400 status code diye thaki // kintu normally get route e 404 deowa better
        // not found deowa ta better .. mane jei phone number ta pathano hoyeche .. shei phone number e kono user paowa jay ni
        console.log(
            "🚦404, error: Requested user was not found ! .. Currently we are in userHandler.js GET method🚦"
        );
    }

    // callback(200);
};

// authentication lagbe .. tai kore felsi
handler._users.put = (requestProperties, callback) => {
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    // update korbo arki .. ekhane .post er shathe onek mil thakbe ..
    // unique value ta age GET method er belay query String er maddhome pathiyechilam .. ebar kintu ar evabe pathabo na ..
    // ebar POST method er moto Normal JavaScript Object er motoi pathabo .. Phone number she pathabe thik e ..
    // shekhane mobile number ta change na kore corresponding onnano value gula she change / update kore dibo ..
    // so first e GET er moto phone number valid kina shei check ta amader abar o lagbe must
    const phone =
        typeof requestProperties.body.phone === "string" &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;
    const firstName =
        typeof requestProperties.body.firstName === "string" &&
        requestProperties.body.firstName.trim().length > 0 &&
        requestProperties.body.firstName.trim().length < 20
            ? requestProperties.body.firstName
            : false; // thik thakle nam ta nilam .. otherwise false kore dilam ..
    const lastName =
        typeof requestProperties.body.lastName === "string" &&
        requestProperties.body.lastName.trim().length > 0 &&
        requestProperties.body.lastName.trim().length < 20
            ? requestProperties.body.lastName
            : false;
    const password =
        typeof requestProperties.body.password === "string" &&
        requestProperties.body.password.trim().length > 5
            ? requestProperties.body.password
            : false;
    if (phone) {
        // validation thik thakle ami kaj korbo // success block
        // ekhane kaj hocche oi user ta ke khuje ber kora .. // data library ta use korte hobe
        // ekhon arekta kaj o korte hobe .. user jei FirstName, LastName, Password dise .. shegula thik ase kina ..
        if (firstName || lastName || password) {
            // jekono ekta data ase kina .. check korlam // karon update korte gele .. jekono ekta data to lagbe
            // ebar amra khujbo .. jei phone number she diyeche .. shei phone number amader database e ase kina .. database read..
            // shei phone number er file amar database e ase kina ..
            // 🔰🔥 ekhane amader ekhon veryfy korte hobe.. amra expect korbo user request er header e tokenObject ta pathabe ..
            // request er header ta amader request properties er moddhe ase .. request properties ta ashse amader handleReqRes file er
            // chosenHandler function theke shekhane .. requestProperties er moddhe headersObject Push kore deowa hoye chilo
            // verify token // headersObject e tokenID nam e token pathate hobe
            let tokenID =
                typeof requestProperties.headersObject.tokenid === "string"
                    ? requestProperties.headersObject.tokenid
                    : false;
            // tokenHandler jehetu ei file e niye ashsi .. etar _token.verify() function dia ekhon ami ekta checking kore felte parbo
            tokenHandler._token.verify(tokenID, phone, (tokenVerified) => {
                if (tokenVerified) {
                    // Token ID valid hole baki kaj gula korbo ekhon
                    data.read("users", phone, (err, uData) => {
                        // u basically valid javaScript object na .. eta kintu String .. file system theke direct pacchi ..
                        // eta ke json.parse kore nite hobe ...//GET function er moto
                        const userData = { ...parseJSON(uData) };
                        if (!err && userData) {
                            // error jodi na thake ar user er data jodi asholei paowa jay ..
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.password = hash(password);
                                // ekhon password er belay amra direct password save korte parbo na .. amader ke hash korte hobe
                            }
                            // finally file system e data gula save korte hobe
                            data.update("users", phone, userData, (err) => {
                                // kon folder, kon file , kon data , then error back pattern ..
                                if (!err) {
                                    callback(200, {
                                        message:
                                            "User's information is updated Successfully",
                                    });
                                } else {
                                    callback(500, {
                                        error: "There was a problem in the Server side ! .. Server Side Error .. ejonno 500",
                                    });
                                }
                            });
                        } else {
                            callback(404, {
                                error: "Requested user was not found ! .. Currently we are in userHandler.js GET method .. data.read",
                            });
                        }
                    });
                    // folder name , file name , callback..error back pattern.. error er shathe data o pabo.. jeta user .. mane user er data
                } else {
                    callback(403, {
                        error: "Authentication Failed",
                    }); // unauthenticated er jonno 403 dite hoy
                }
            });
        } else {
            callback(400, {
                error: "You have a problem in your request .. specially while updating data",
            });
        }
    } else {
        // otherwise ami ekhane ekta error diye dibo
        callback(400, {
            error: "Invalid Phone Number ! Please Try Again",
        }); // user er kono vul hole amra 400 status code diye thaki
        console.log("🚦400, error: Invalid Phone Number ! Please Try Again🚦");
    }
};

// authentication lagbe .. tai kore felsi
handler._users.delete = (requestProperties, callback) => {
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    // queryString er maddhome Get method er moto Phone number ashbe ..
    const phone =
        typeof requestProperties.queryStringObject.phone === "string" &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        // validation thik thakle ami kaj korbo // success block // khuje ber korte hobe oi phone number e kono file ase kina
        // ekhane kaj hocche oi user ta ke khuje ber kora .. // data library ta use korte hobe
        // 🔰🔥 ekhane amader ekhon veryfy korte hobe.. amra expect korbo user request er header e tokenObject ta pathabe ..
        // request er header ta amader request properties er moddhe ase .. request properties ta ashse amader handleReqRes file er
        // chosenHandler function theke shekhane .. requestProperties er moddhe headersObject Push kore deowa hoye chilo
        // verify token // headersObject e tokenID nam e token pathate hobe
        let tokenID =
            typeof requestProperties.headersObject.tokenid === "string"
                ? requestProperties.headersObject.tokenid
                : false;
        // tokenHandler jehetu ei file e niye ashsi .. etar _token.verify() function dia ekhon ami ekta checking kore felte parbo
        tokenHandler._token.verify(tokenID, phone, (tokenVerified) => {
            if (tokenVerified) {
                // Token ID valid hole baki kaj gula korbo ekhon
                data.read("users", phone, (err, u) => {
                    // u basically valid javaScript object na .. eta kintu String .. file system theke direct pacchi ..
                    // tahole amake take parse kore nite hobe valid javaScript object e .. utilities er moddhe parseJSOn function ase

                    const user = { ...parseJSON(u) }; // ekhon user er moddhe valid object assign hoilo
                    // 🔰tar por amra take spread kore felsi .. immutably copy hoilo arki
                    // ekta object ke spread kore arekta variable er moddhe rakhle .. sheta ashole copy hoye jay ..
                    // deeply nested hole ei procedure ta kaj kore na (immutably copy hoy na) .. single level object er belay kaj kore ..

                    if (!err && user) {
                        // error jodi na thake ar user er data jodi asholei paowa jay ..
                        // ekhon ekhane amra user delete kore dibo
                        data.delete("users", phone, (err) => {
                            if (!err) {
                                // not error mane successfully delete hoyeche
                                callback(200, {
                                    message: "user is successfully deleted !",
                                });
                            } else {
                                callback(500, {
                                    error: "Requested user was not found ! .. Currently we are in userHandler.js Delete method .. data.read",
                                });
                            }
                        });
                    } else {
                        callback(500, {
                            error: "Requested user was not found ! .. Currently we are in userHandler.js Delete method .. data.read",
                        });
                        // 500 .. karon server side theke error ashse
                    }
                });
                // folder name , file name , callback..error back pattern.. error er shathe data o pabo.. jeta user .. mane user er data
            } else {
                callback(403, {
                    error: "Authentication Failed",
                }); // unauthenticated er jonno 403 dite hoy
            }
        });
    } else {
        // otherwise ami ekhane ekta error diye dibo
        callback(404, {
            error: "Requested user was not found ! .. Currently we are in userHandler.js Delete method",
        }); // user er kono vul hole amra 400 status code diye thaki // kintu normally get route e 404 deowa better
        // not found deowa ta better .. mane jei phone number ta pathano hoyeche .. shei phone number e kono user paowa jay ni
        console.log(
            "🚦404, error: Requested user was not found ! .. Currently we are in userHandler.js Delete method🚦"
        );
    }
};

///////////////////// Token Verification boylarplate .........const tokenHandler = require("./tokenHandler");
// // 🔰🔥 ekhane amader ekhon veryfy korte hobe.. amra expect korbo user request er header e tokenObject ta pathabe ..
// // request er header ta amader request properties er moddhe ase .. request properties ta ashse amader handleReqRes file er
// // chosenHandler function theke shekhane .. requestProperties er moddhe headersObject Push kore deowa hoye chilo
// // verify token // headersObject e tokenID nam e token pathate hobe
// let tokenID =
//     typeof requestProperties.headersObject.tokenid === "string"
//         ? requestProperties.headersObject.tokenid
//         : false;
// // tokenHandler jehetu ei file e niye ashsi .. etar _token.verify() function dia ekhon ami ekta checking kore felte parbo
// tokenHandler._token.verify(tokenID, phone, (tokenVerified) => {
//     if (tokenVerified) {
//         // Token ID valid hole baki kaj gula korbo ekhon
//     } else {
//         callback(403, {
//             error: "Authentication Failed",
//         }); // unauthenticated er jonno 403 dite hoy
//     }
// });

module.exports = handler;
