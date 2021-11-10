const express = require("express");
// jodi amra ei router ta charao amader application e ekdom externally nijera arekta .. router banate chai .. tahole
const adminRouter = require("./adminRouter"); // adminRouter nam e ekta router create korbo .. shei router ta ke amra onno ekta
// file theke niye ashbo
const publicRouter = require("./publicRouter");

const app = express();
// router niye kaj korar jonno router nam e ekta specific object Express amader ke diye diyeche
/*
app.get("/", (req, res) => {
    res.send("From index.js Router Object  app.get /");
});
app.get("/about", (req, res) => {
    res.send("From index.js Router Object  app.get / about");
});
// ei je amra bivinno route e hit korchi .. ei route gula definitely ekta router object er maddhome controlled hocche
// currently ekhane kono router object  nai ..
*/
app.use("/admin", adminRouter);
app.use("/", publicRouter);

app.listen(313, () => {
    console.log("listening on http://localhost:313/ Router Concept");
});
