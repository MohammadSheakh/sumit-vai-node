const path = require("path");
const myPath =
    "E:/Web Development/Sumit Node/Node js/Node js Server And Core Modules/index.js";
console.log("1", path.basename(myPath)); // file name
console.log("2", path.dirname(myPath)); // directory
console.log("3", path.extname(myPath)); // extension
console.log("4", path.parse(myPath)); // object
console.log(
    "///////////////////////////////////////////////////////////////////////////////////"
);

const os = require("os");
console.log("5", os.platform()); // win32
console.log("6", os.homedir()); //
console.log("7", os.freemem()); // memory koto tuku free ase ..
// console.log("8", os.cpus()); // cpu  core
console.log(
    "///////////////////////////////////////////////////////////////////////////////////"
);

const fs = require("fs");
// file writing
fs.writeFileSync("myfile.txt", "welcome to myfile.txt !"); //  file name, file e jeta likhte chai
fs.writeFileSync("myfile.txt", " Have a nice day");
fs.appendFileSync("myfile.txt", " ! You are again welcome");
// file reading
const data = fs.readFileSync("myfile.txt");
console.log(data); // buffer // different type er data type er moto kolpona kora jete pare // binary formate
console.log(data.toString()); // string

// Asyncronous
fs.readFile("myfile.txt", (error, data2) => {
    console.log(data2.toString());
});
console.log("123... Data Loading ...");

// console.log("9", os.freemem());
console.log(
    "///////////////////////////////// Event Emitter //////////////////////////////////////////////////"
);

const EventEmitter = require("events"); // karon events class provide kore .. tai Capital Letter use korlam
// first letter .. EventEmitter er ..
const emitter = new EventEmitter();

// register a listener for bell Ring Event
emitter.on("bellRing", function (when) {
    // callback function
    console.log(`we need to leave this school ! ${when}`);
});
emitter.on("walking", () => {
    console.log("Stop walking ! Run Fast");
});
emitter.on("school", ({ period, section, roll }) => {
    console.log(`For a School : ${period} ${section} ${roll}`);
});

//raise an event
emitter.emit("bellRing", "Right Now"); // raise event , parameter passing
emitter.emit("walking");
emitter.emit("school", {
    period: "last",
    section: "b",
    roll: 12,
});
