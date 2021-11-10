// dependencies
const crypto = require("crypto");
const environments = require("./environment");
// module scaffolding
const utilities = {};

// utilities gula define korchi ekhane

// JSON ke parse korbo ekhane // parse JSON String to Object..
utilities.parseJSON = (jsonString) => {
    // er moddhe expect korbo ekta jsonString.. sheta ke amar JSON.parse e convert korte hobe
    let output;

    try {
        output = JSON.parse(jsonString); // valid JSON na dile JSON.parse er karone jeno program ta crash na kore
        // ejonno eta ke try catch block er moddhe rakhlam ..
    } catch {
        output = {};
    }
    return output;
};
// finally ei function ta ekta object nilo .. Error Handling kore diye dilo ...

// hashing function ..  crypto module .. input data/ password -> output hash
utilities.hash = (str) => {
    // she ekta String expect kortese .. jeta ke she hash korbe .. // ekhon crypto er documentation dekhte hobe
    // amra HMAC ta use korbo .. eta more secure .. ei HMAC e nijossho ekta secret key deowa jabe .. authenticity thake ..
    // jokhon she encrypt korbe .. tokhon apnar ekta secret key niye she encrypt korbe ..
    // secret key ta amra ekhaneo diye dite pari .. kintu which is not a good practice .. amra obosshoi secret key ta ke amader
    // kono ekta config theke niye ashbo .. config er jonno already environment nam e ekta file create korechilam age helpers folder
    // er moddhe amra staging and production er jonno secretKey bole dite pari .. tobe secret key evabe rakhai uchit na ..
    // hidden file e rakha uchit .. apatoto amra ekhane rekhe kaj korbo ..
    if (typeof str === "string" && str.length > 0) {
        let hash = crypto
            .createHmac("sha256", environments.secretKey) //"sha256", "password" > password er jaygay amar secret key ta ami dibo ..
            .update(str) // ekhane string ta dite hobe .. jeta ke encrypt korbo//chilo environments[process.env.NODE_ENV].secretKey
            .digest("hex");
        return hash;
    } else {
        return false;
    }
    // process.env.NODE_ENV ekhane bole deowa ase staging naki production ... package.json er moddhe
    // ekhon userHandler er moddhe giye Password e Hash Data te trasfer korte hobe
};

// Generate Random String For Token function ..
utilities.createRandomString = (strlength) => {
    // amra ekta String Length pathabo .. shei length er Random String lagbe amader
    let length = strlength;
    length = typeof strlength === "number" && strlength > 0 ? strlength : false;
    if (length) {
        let possiblecharacters = "8qwe2hm134u6ijkpa7rtylzxcvbn59fgosd";
        let output = "";
        for (let i = 1; i <= length; i++) {
            let randomCharacter = possiblecharacters.charAt(
                Math.floor(Math.random() * possiblecharacters.length)
            ); // float number return kore ..
            // Math.random() * 10 -> 0 theke 9 er moddhe number return korbe ..
            output = output + randomCharacter;
        }
        return output;
    } else {
        return false;
    }

    return "sdkdsjmocsijowroleTokenNumber";
    // eta tokenHandler file e POST method e kaje lagbe
};

//Export module
module.exports = utilities;
