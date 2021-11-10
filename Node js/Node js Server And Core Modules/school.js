const EventEmitter = require("events"); // karon events class provide kore .. tai Capital Letter use korlam
// first letter .. EventEmitter er ..
const emitter = new EventEmitter();

class School extends EventEmitter {
    // EventEmitter er shob method property ..School Class e chole ashlo
    startPeriod() {
        console.log("Class Started ! ");

        // raise event when bell rings -- register a listener for bell Ring Event

        this.emit("bellRing", "Right Now"); // raise event , parameter passing
    }
}

// module.exports = startPeriod; // function ta export kore fellam ..
module.exports = School; //

// Event Raise korsi ekhane ....
