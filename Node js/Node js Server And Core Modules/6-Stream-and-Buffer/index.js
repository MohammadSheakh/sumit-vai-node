const fs = require("fs");

// streaming way te bigdata.txt file theke data read korbo ekhon ...
const ourReadStream = fs.createReadStream(`${__dirname}/bigdata.txt`, "utf8"); // data read korar age ekta stream create korsi ..
// , "utf8" encoding pass kore dilam .. ekhon amra data dekhte pabo .. chunk na ....
// readStream create kore felle .. she amader ke ekta event diye thake ..  ektu ektu kore buffer dibe ..
// ar ektu ektu kore event dite thakbe ..
// node.js jehetu ekta event driven runtime .. event diyei beshi kaj korbo ekhane
ourReadStream.on("data", (chunk) => {
    // ekhane ekta call back function likhlam .. ekhane amra chunk of data receive korbo
    console.log(chunk); // Buffer Reture kore ..  Binary Buffer data
    // parameter hishebe "utf8" encoding pass na korte chaile .. toString() method call korleo same kaj hobe
    // console.log(chunk.toString());
});
// on likhar mane holo event listen korsi amra .. and data event ta listen korbo ..
// stream continues amader ke data diye jacche .. ekta kore chunk of buffer ashte thakbe .. amra ekta kore data event listen korbo

// ekhon http module use kore .. server e jokhon ekta incoming request ashe .. shei request ta keo kintu amra chunk e chunk ei
// receive kori .. node.js by default amader ke chunk e chunk ei pathay ..
