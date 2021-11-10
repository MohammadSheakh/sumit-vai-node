// const startPeriod = require("./school");
const School = require("./school");
// const EventEmitter = require("events"); // karon events class provide kore .. tai Capital Letter use korlam

// const emitter = new EventEmitter();

const school1 = new School();

school1.on("bellRing", function (when) {
    // callback function
    console.log(`we need to leave this school ! ${when}`);
});

school1.startPeriod();

// event listen kortesi ekhane

// Main point :  Jei object ke dia event ta emit korben .. thik shei object ke diyei event ta listen korte hobe
