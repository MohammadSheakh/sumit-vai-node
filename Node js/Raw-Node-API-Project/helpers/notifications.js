/* Title : Notification Library
 * Description : Important function to notify users ... twillo
 * Author : Mohammad Bin Ab. Jalil Sheakh-----------------📞 0151-8419801, 01790-583345
 * Updated Date : --21 (Please update the error date also)
 * facebook id : https://www.facebook.com/mohammadsheakh.mern/ 🌐 Git Hub : https://github.com/MohammadSheakh
 * Mail : mohammad.sheakh@gmail.com
 */

// TODO: dependencies
const https = require("https"); // amra jehetu twilio use korsi .. she jeta chay .. ta ke obosshoi ..
// https protocol e request korte hobe
const { twilio } = require("./environment");
const querystring = require("querystring");

// TODO:  module scaffolding
const notifications = {};

// TODO: configurations

// send sms to user using twilio API
notifications.sendTwilioSms = (phone, msg, callback) => {
    // input validation
    const userPhone =
        typeof phone === "string" && phone.trim().length === 11
            ? phone.trim()
            : false;
    const userMsg =
        typeof msg === "string" &&
        msg.trim().length > 0 &&
        msg.trim().length <= 1600
            ? msg.trim()
            : false;

    if (userPhone && userMsg) {
        // at first .. twilio API jei jinish gula amader kase chay ... SMS pathate hole ..
        // configure the request payload
        const payload = {
            From: twilio.fromPhone,
            to: `+88${userPhone}`,
            Body: userMsg,
        };
        // jokhon ami kono request pathabo .. tokhon erokom valid js object kintu request hishebe pathano jay na ..
        // pathaite hobe .. Stringify kore .. Stringify korar jonno JSON.Stringify use kora jay .. kintu amra ekhane
        // stringify the payload .. node er ekta package ase .. sheta use korbo .. eta node recommend kore
        const stringifyPayload = querystring.stringify(payload);
        // finally jei request details .. jeta twilio ke dibo .. sheta ekhon create korbo .. tar age
        // request pathanor age https kichu jinish expect kore .. shegula ready korte hobe .. configure korte hobe

        // TODO:  configure the request details
        const requestDetails = {
            hostname: "api.twilio.com", // eta hocche twilio er host name .. she eta expect kore
            method: "GET",
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                "Content-Type": "application/x-www-from-urlencoded",
            },
        };
        // ekhon request ta pathanor jonno amader ke request instantiate korte hobe
        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of the send request
            const status = res.statusCode;
            // callback successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false); // mane no error
            } else {
                callback(`Status code returned was ${status}`);
            }
        });
        // ekhon amader kaj hocche request ta pathano ..
        // req.end kore dilei request ta chole jabe ..  tar age ⭕payload ta request er shathe diye dite hobe
        // jeta twilio expect kore ..

        // error handling .. request ta jokhon jacche .. error ta she dey hocche ekta event er maddhome ..
        req.on("error", (err) => {
            callback(err); // request e kono error hole .. error event fire korbe .. and tokhon amar ei callback
            // ta call hoye jabe .. network e kono error hoile ei error event ta fire hote pare
        });

        req.write(stringifyPayload);
        req.end(); // request ta chole gelo ..
        // function ta test korbo .. index.js e
    } else {
        callback("Given Parameters were invalid !");
    }
};

// TODO: export the module
module.exports = notifications;
