// ekhon requestObject.js er app object ta jodi amader ekhane dorkar hoy .. taile  req.app
// onek shohoj hoye gese arki jinish ta
const handler = (req, res) => {
    console.log(req.app);
    console.log(
        "--------------------------------------------------------------------------"
    );
    console.log("req.app.get => ", req.app.get("view engine")); // undefined karon apatoto view engine nai amader

    ///////// ekhon amra method dekhbo
    console.log("req.accepts => ", req.accepts("html")); // tumi ki html accept koro ?
    // eta header e bole deowa jay kon dhoroner data accept korbe html / application/json / */* shob dhoroner

    console.log("req.get => ", req.get("accept")); // header er value jante eita help kore
    console.log("req.get => ", req.get("content-type"));
    console.log(
        "--------------------------------------------------------------------------"
    );
    res.send("This is form handler.js handler function");
};

module.exports = handler;
