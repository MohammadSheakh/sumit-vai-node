// and eta jehetu userHandler er motoi hobe .. tai userhandler er boylar plate ta copy kore niye
// ashi ...
// TODO:   dependencies-section
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { createRandomString } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
// TODO:  app object - module scaffolding (blank object) // eita te attach kore .. function gula export kora jay
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    console.log("tokenHandler is checked ! from tokenHandler.js");
    //tokenHandler er maddhome jei request gula ashbe .. shegula onek rokom er hote pare .. selective kichu
    // request er baire kichu ashle shegula amra accept korbo na ..
    const acceptedMethods = ["get", "post", "put", "delete"];
    // ekhon check korte hobe .. ei array er moddhe requestProperties er method ta ase kina !
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        // na paile 0 er theke choto hobe .. thakle mane match korle 0 .. othoba onno kono index er shathe match korbe
        // array er moddhe element ase kina .. check korte hoy .indexOf method er maddhome ...
        handler._token[requestProperties.method](requestProperties, callback); // function ta amader ke call kore dite hobe
    } else {
        callback(450);
        // eta ekta convention.. requst allow na korte chaile 405 Status Code dite hoy ... jemon success er khetre
        // 200 status code dite hoy ..
    }
    // callback(200, {
    //     message: "This is token handler / url ! You are not allowed !",
    // });
};
// ami handlers arekta container banacchi .. mane arekta scaffolding banacchi ..
handler._token = {}; // handler to amar scaffolding .. tar moddhe service gula ke shob shomoy underscore diye likhi
// arki .. mane _token ta ektu private property arki ..
// token based authentication ashole ki ? => jokhon user request korbe .. she jodi emon kono route e hit kore ..
// jei route tar jonno ta ke log in korte hobe .. ekhon prottekbar to log in kora shomvob na prottek route
// e visit korar jonno .. bar bar to ar username ar password amra send korte parbo na ..
// ejonnoi token system
// POST diye amra token create korbo .. GET diye amra TOKEN nibo .. PUT diye amra token update korte parbo
// DELETE diye amra token DELETE korte parbo ..

// ekhon amra handler._token er shob gula method er jonno function banabo ..
handler._token.post = (requestProperties, callback) => {
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    // post mane new token create kora .. er jonno tar request er shathe phone number ar password pathate hobe. sheta validate
    // korte hobe amader ..
    const phone =
        typeof requestProperties.body.phone === "string" &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === "string" &&
        requestProperties.body.password.trim().length > 4
            ? requestProperties.body.password
            : false;
    console.log("😴", phone, password);
    if (phone && password) {
        // value gula jodi asholei ashe ..  jodi thik thake ..
        // ekhon amader database e check korte hobe .. ei phone number and password combination ta thik ase kina ..
        data.read("users", phone, (err, userData) => {
            // error callback pattern
            // amake dekhte hobe .. oi userData er phone number ar password ta jeno thik thake
            let hashedPassword = hash(password); // user jei password ta pathiyese .. sheta ke hash kore nilam
            // ekhon ami userData er already hash hoye thaka password er shathe compare korbo
            if (hashedPassword === parseJSON(userData).password) {
                // file theke asha String ta valid js object holo
                // ekhon amar kaj hocche ekta token create kora .. // ekta random token generate korte hobe
                // random token (String) generate kora eta ekta utiliti er moddhe pore .. tai utiliti file e ase
                let tokenID = createRandomString(20); //// amra ekta String Length pathabo .. shei length er Random String lagbe amader
                // ekhon ei token ta kotokkhon valid thakbe .. sheta amake set korte hobe .. valid time
                let expires = Date.now() + 60 * 60 * 1000; // মিলি সেকেন্ড // present time + 1 hour tike thakbe  /  valid thakbe
                // finally token object .. jeta user ke return korbo
                let tokenObject = {
                    phone: phone,
                    tokenID: tokenID,
                    expiresTime: expires,
                };
                // finally tokenObject ta database e store korte hobe
                data.create("tokens", tokenID, tokenObject, (err) => {
                    // kon folder, kon file, kon data
                    // ekta callback pabo
                    if (!err) {
                        callback(200, tokenObject);
                        // Final Callback er body hishebe tokenObject ta pass kore dilam .. 200 Response dilam
                    } else {
                        callback(500, {
                            error: "Server Side Error",
                        });
                    }
                });
            } else {
                callback(400, {
                    error: "Password is not valid in TokenHandler",
                });
            }
        });
    } else {
        // phone ar password er value gula na thik thakle ..
        callback(400, {
            error: "there is a problem in your request. Please provide proper data",
        }); // user er error hoyeche erokom khetre status dite hoy 400 // client er request er kono problem thakle by convention 400 dite hoy
        // there is a problem in your request
        console.log(
            "😴 there is a problem in your request. Please provide proper data"
        );
    }
};

handler._token.get = (requestProperties, callback) => {
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    // user query String hishebe token id ta pathabe..and amra ta ke token object ta..mane token er details full ta ke diye dibo

    // Get Route e amader kaj ki hobe ? amra first e check korbo .. get mane ki ! kono ekta user er information ..
    //// post man e method GET select korar por .. query String akare .. she user er phone number ta dhoren dibe
    //// http://localhost:3000/user?phone=01790583345 .. ei je erokom .. eta hocche query String ..
    //// erokom jodi dey .. tahole amra corresponding user er information ene client ke dibo .. That's our goal

    // .. queryString object ta kintu amader handleReqRes() e ase .. and amra sheta requestProperties er moddhe pathiye diyechilam
    // check the token ID if valid // karon ekhane token ID ashbe
    // ebar ar amar requestProperties.body hobe na .. ebar hobe requestProperties.queryStringObject
    const tokenID =
        typeof requestProperties.queryStringObject.tokenID === "string" &&
        requestProperties.queryStringObject.tokenID.trim().length === 20 // karon amra 20 charecter er tokenID banaisilam
            ? requestProperties.queryStringObject.tokenID
            : false;

    if (tokenID) {
        // validation thik thakle ami kaj korbo // success block
        // ekhane kaj hocche oi token ta ke khuje ber kora .. // data library ta use korte hobe
        data.read("tokens", tokenID, (err, tokenData) => {
            // tokenData basically valid javaScript object na .. eta kintu String .. file system theke direct pacchi ..
            // tahole amake take parse kore nite hobe valid javaScript object e .. utilities er moddhe parseJSOn function ase

            const token = { ...parseJSON(tokenData) }; // ekhon token er moddhe valid object assign hoilo
            // 🔰tar por amra take spread kore felsi .. immutably copy hoilo arki
            // ekta object ke spread kore arekta variable er moddhe rakhle .. sheta ashole copy hoye jay ..
            // deeply nested hole ei procedure ta kaj kore na (immutably copy hoy na) .. single level object er belay kaj kore ..

            if (!err && token) {
                // error jodi na thake ar user er data jodi asholei paowa jay ..
                // user er information dibo .. kintu user er password remove kore nite hobe..karon password amra share korte chai na

                callback(200, token);
            } else {
                callback(404, {
                    error: "Requested token was not found ! .. Currently we are in tokenHandler.js GET method .. data.read",
                });
            }
        });
        // folder name , file name , callback..error back pattern.. error er shathe data o pabo.. jeta user .. mane user er data
    } else {
        // otherwise ami ekhane ekta error diye dibo
        callback(404, {
            error: "Requested token was not found ! .. Currently we are in tokenHandler.js GET method",
        }); // user er kono vul hole amra 400 status code diye thaki // kintu normally get route e 404 deowa better
        // not found deowa ta better .. mane jei phone number ta pathano hoyeche .. shei phone number e kono user paowa jay ni
    }

    // callback(200);
};

handler._token.put = (requestProperties, callback) => {
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    //Token.put mane ... token update kora .. basically put method e amra token er ID pai .. ar shathe etao pabo .. je
    // user amake bole dibe .. je token ta extend kore deo .. extend hishebe jodi she true pathay .. tahole ami token ta ke
    // extend korbo .. mane expire time ta ke aro 1 hour bariye dibo .. echara to token ta ke ar kichu update korar nai
    // token ta ke refresh kora arki
    // ekhon amake check korte hobe .. user jei token id ta pathacche ... sheta valid kina .. jodi sheta valid hoy and extend
    // true hoy ..tahole ami token er expire time bariye dibo // tokenID er validation check korte hobe ekhane

    const tokenID =
        typeof requestProperties.body.tokenID === "string" &&
        requestProperties.body.tokenID.trim().length === 20
            ? requestProperties.body.tokenID
            : false;
    const extend =
        typeof requestProperties.body.extend === "boolean" &&
        requestProperties.body.extend === true
            ? requestProperties.body.extend
            : false;

    if (tokenID && extend) {
        // shob kichu thik thakle .. ami ekhon token tar validity check korbo .. token ta ashole valid kina

        data.read("tokens", tokenID, (err, tokenData) => {
            // error back pattern callback
            // ekhon arekta checking korte hobe .. tokenData ta already expire koreche kina .. already expire korle kintu
            // reject kore dite hobe amader ..
            // tokenData ekhane file theke String akare esheche .. tai amake parseJSON er maddhome object e transfer kore nite hobe
            let tokenObject = parseJSON(tokenData);
            if (tokenObject.expiresTime > Date.now()) {
                // tahole ami shamne agabo je token ekhono expire hoy nai .. she time baranor kaj ta korte parbe
                tokenObject.expiresTime = Date.now() + 60 * 60 * 1000; // 1 hour time extend korlam present time er shathe// মিলি সেকেন্ড
                // store the updated token
                data.update("tokens", tokenID, tokenObject, (err) => {
                    if (!err) {
                        // error na hole shamne agabo
                        // update hoye gelo ar ki .. time extend kore dilam ... status code 200 OK DOne
                        callback(200);
                    } else {
                        callback(500, {
                            error: "Server side error ! .. Currently we are in tokenHandler.js PUT method .. data.read",
                            // kono ekta server side error er jonno status code 500 dilam
                        });
                    }
                });
            } else {
                // error diye dibo
                callback(400, {
                    error: "Token Already Expires ! .. Currently we are in tokenHandler.js PUT method .. data.read",
                });
                console.log("400");
            }
        });
    } else {
        // id and extend er value thik moto na ashle error diye dibo
        callback(400, {
            error: "There was a problem in your request ! .. Currently we are in tokenHandler.js PUT method .. data.read",
        });
    }
};

handler._token.delete = (requestProperties, callback) => {
    // requestProperties, callback receive kore .. ei jaygay she kichu ekta korbe ..
    // eta userHandler er user delete korar motoi hobe ..
    // Ashole token Delete mane hocche user ke log out kore deowa
    // queryString er maddhome Get method er moto Phone number ashbe ..
    // Check the token if valid
    const tokenID =
        typeof requestProperties.queryStringObject.tokenID === "string" &&
        requestProperties.queryStringObject.tokenID.trim().length === 20
            ? requestProperties.queryStringObject.tokenID
            : false;
    if (tokenID) {
        // validation thik thakle ami kaj korbo // success block // khuje ber korte hobe oi phone number e kono file ase kina
        // ekhane kaj hocche oi user ta ke khuje ber kora .. // data library ta use korte hobe
        data.read("tokens", tokenID, (err, tokenData) => {
            // tokenData basically valid javaScript object na .. eta kintu String .. file system theke direct pacchi ..
            // tahole amake take parse kore nite hobe valid javaScript object e .. utilities er moddhe parseJSOn function ase

            const token = { ...parseJSON(tokenData) }; // ekhon token er moddhe valid object assign hoilo
            // 🔰tar por amra take spread kore felsi .. immutably copy hoilo arki
            // ekta object ke spread kore arekta variable er moddhe rakhle .. sheta ashole copy hoye jay ..
            // deeply nested hole ei procedure ta kaj kore na (immutably copy hoy na) .. single level object er belay kaj kore ..

            if (!err && token) {
                // error jodi na thake ar token er data jodi asholei paowa jay ..
                // ekhon ekhane amra token delete kore dibo
                data.delete("tokens", tokenID, (err) => {
                    if (!err) {
                        // not error mane successfully delete hoyeche
                        callback(200, {
                            message: "Token is successfully deleted !",
                        });
                    } else {
                        callback(500, {
                            error: "Requested user was not found ! .. Currently we are in tokenHandler.js Delete method .. data.read",
                        });
                    }
                });
            } else {
                callback(500, {
                    error: "Requested user was not found ! .. Currently we are in tokenHandler.js Delete method .. data.read",
                });
                // 500 .. karon server side theke error ashse
            }
        });
        // folder name , file name , callback..error back pattern.. error er shathe data o pabo.. jeta user .. mane user er data
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

handler._token.verify = (tokenID, phone, callback) => {
    // ei function ta true false return kore ..
    data.read("tokens", tokenID, (err, tokenData) => {
        console.log(
            "🔊Phone Number while token Verify checking ",
            tokenID,
            ".  .",
            tokenData
        );
        if ((!err, tokenData)) {
            // ekhon amra check korbo .. user er tokenID er shathe phone number ta match kore kina
            // mane holo .. token object er jei phone number deowa ... ar user er phone number match korte hobe

            if (
                parseJSON(tokenData).phone === phone &&
                parseJSON(tokenData).expiresTime > Date.now()
            ) {
                // tokenID jeno valid thake .. etao check korte hobe
                // expire time present time er cheye boro mane .. aro time ase
                callback(true); //  callback true kore dilam .. karon eta simple token verification function
            } else {
                callback(false);
            }
        } else {
            callback(false); // eta just general purpose function .. eta route theke ashbe na ..
            // ejonno amra 200 ba erokom kichu dicchi na .. request ashle eta call hocche na kintu
            // route handler na .. eta ekta normal function
        }
    });
};

module.exports = handler;
