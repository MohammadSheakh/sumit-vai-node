const express = require("express"); //require korle express
// muloto amader ke ekta function return kore ..
// amra jodi shei function ta ke call kore dei .. tahole ..
//  ami app nam e ekta object pabo
const app = express();
// ei app object amader ke shob dhoroner convenience dey .
/*
app.use(express.json()); // Application ke kon function she use korbe .. sheta bole deowa .. use er moddhe jodi
// amra kono function bole dei .. amader Application shei function ta ke use korbe ..
// tar mane amar application express.json jeta return kore .. sheta ke use korbe ..
// express.json jeta kore .. ei pash theke request er body te jodi kono data json format e pathai ..
// headers e content type .. application/json ke parse korte pare ..
*/
/*
app.use(express.raw()); // "application/octet-stream" header e bole dite hobe Content-Type hishebe..  buffer stream er data type
// amra raw string parse korte chacchi ... amra buffer pabo taile
*/
/*
app.use(express.text()); // jodi apni text plain akare pathan .. header e content type e  text-plain dite hobe
*/
/*
app.use(express.urlencoded()); // Content-Type : application/x-www-form-urlencoded
*/
/*
app.use(
    express.static(`${__dirname}/public/`, {
        // 2nd parameter e amra ekta option object dite
        // pari
        index: "home.html",
        // http://localhost:31313/TextFolder/ eta
        // bole dile home.html root hishebe khujbe
        // shekhan theke data load korbe
    })
);
*/
const router = express.Router({
    caseSensitive: true, // by default false thake .. true kore deowa jete pare .. iccha
});
app.use(router);
// ei function ta basically ekta router object return kore
// and amar app ke ami bolte pari .. tumi ei router ta use koro
// routing mechanism ta she ekta object er moddhe diye dey
// multiple router object create kora possible
// router 1,  router 2 , admin router .. public router
// and app ke bole deowa jay .. tumi ei router ta use koro ..
// shekhetre app.get/post na use kore .. router.get/post use korleo jinish ta kaj korbe
// router gula by default case insensitive .. mane /home ar /Home .. ek e kotha
//-----------------------------------------------------------------
// jodi user get request kore ei url e.. tahole second
// parameter e jei callback
// function ta dicchi .. shei function ta call kore deo

//app.get("/", (req, res) => {
router.get("/home", (req, res) => {
    // req and res accept kore .. ei function ta
    console.log("1⭕", req.body);
    //console.log("1⭕", req.body.toString()); // raw data er khetre eta JSON akare ashse na .. ekhon eta ekta String return kore
    res.send("This is homepage.............");
});
// app.post("/", (req, res) => {
router.post("/", (req, res) => {
    console.log("2⭕", req.body);
    res.send("This is homepage with post request");
});

// raw.js e jemon server create kore..server.listen korechilam ..
//  ekhane amra app.listen korte parbo
app.listen(31313, () => {
    // ei listen complete howar por..karon server listening ekta
    // system process tarpor ei function ta call hobe
    console.log(
        `
        ------------------------------------------------------------------------------------------
        📢📈listening on http://localhost:31313   📌⚡   application created by :- Baraka SoftNix
        Coder                  : Mohammad Sheakh.. fb: https://www.facebook.com/mohammadsheakh.mern/
        Application name       : Express.js Starting
        Project Starting Date  :
        Project Finishing Date :
        
        Project Received by    : 
        ----------------------------------------------Start------------------------------------------
        `
    );
}); // ebar eta 31313 port e listen korbe
// and ek e shathe ekhane ekta callback function diye dite parbo
