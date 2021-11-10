const express = require("express");
const adminRouter = require("./adminRouter");
const publicRouter = express.Router(); // express.Router() amake ekta router instance dibe .. notun ekta router object dibe

// router object er belay o amra all use korte parbo
const log = (req, res, next) => {
    // middleware function.. publicRouter e jei URL ei keo hit koruk na keno .. just ei log function ta jeno run hoye ..
    // amar console e ekta log ashe ..
    console.log("I am logging something in public Router.js");
    next();
};

// router.param => app.param er motoi kaj kore .. router er moddhe jei parameter gula thake .. shei parameter er upore base kore
// amader jodi kono callback function call korte hoy .. tahole amra router.param / app.param .. egula amra use korbo
// shetar jonno amader ke kono ekta URL e parameter receive korte hobe
//

publicRouter.param("user", (req, res, next, id) => {
    // amar jei routing parameter .. shei parameter er nam ki ? amar ei publicRouter e .. jokhon e user nam e kono parameter
    // URL e ashbe .. tokhon e ei callback function ta call kore deo .. parameter er nam hocche user .. kintu etar value chole
    // jabe id er moddhe .. mane /3 jodi hoy ei 3 parameter er nam hocche user ... ar ei je value 3 sheta thakbe id er moddhe
    // URL e hit korle  ei function ta ekbar e call korbe ..
    req.user = id === "1" ? "Admin" : "Anonymous"; // id == 1 hole req.user = Admin .. erokom arki
    next();
    // ei param function er behavior ta amra chaile change korte pari .. kivabe ? etar calling mechanism ta change kore ..
});

publicRouter.param((param, option) => (req, res, next, val) => {
    // val hocche URL er parameter hishebe jei value deowa hobe sheita ..
    if (val === option) {
        next();
    } else {
        res.sendStatus(403);
    }
});
publicRouter.param("count", "3"); // publicRouter.param ke erokom vabe amra call korte pari .. 3 hocche option er value

publicRouter.all("*", log); //all mane jekono method ..  star mane jekono URL

publicRouter.get("/about", (req, res) => {
    res.send("From publicRouter Object /about");
});
publicRouter.get("/about/:count", (req, res) => {
    res.send("From publiciRouter Object  /about/:count");
});
publicRouter.get("/", (req, res) => {
    res.send("From publicRouter Object  /");
});
publicRouter.get("/:user", (req, res) => {
    // ei URL e user nam e ekta routing parameter receive korbo ..
    res.send(`.From publicRouter Object  /:user  ${req.user}`);
});
publicRouter
    .route("/dash")
    .all((req, res, next) => {
        console.log("I am in dashboard admin");
        next();
    })
    .get((req, res) => {
        res.send("GET");
    })
    .post((req, res) => {
        res.send("POST");
    })
    .put((req, res) => {
        res.send("PUT");
    })
    .delete((req, res) => {
        res.send("DELETE");
    });

// publicRouter.use((req, res, next) => {
// ei part ta bujhi nai ..........................
//     console.log("Logging");
//     next();
// });
// publicRouter.use(adminRouter);

module.exports = publicRouter;
