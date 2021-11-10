const express = require("express");
const cookieParser = require("cookie-parser");
const handler = require("./handler");

const app = express();
app.use(express.json());
app.use(cookieParser());

// amra ekhon ekta subApp banabo .. tar jonno adminRoute nam e ekta notun route create korchi
const adminRoute = express.Router(); // it's a new Routing System
adminRoute.get("/dashboard", (req, res) => {
    // admin app er dashboard e gele .. ei function ta call hobe
    // ekhon ei admin app er jinish ta app er moddhe mount kora .. ekhon ekhane baseUrl => app ashbe
    console.log("admin/dashboard => req.baseUrl => ", req.baseUrl); // /admin
    console.log("admin/dashboard => req.originalUrl => ", req.originalUrl); // /admin/dashboard
    console.log("admin/dashboard => req.url => ", req.url); // /dashboard
    console.log("admin/dashboard => req.path => ", req.path); // /dashboard            // sub app er porer ongsho dicche
    console.log("admin/dashboard => req.hostname => ", req.hostname); // localhost
    res.send("We are in Admin Dashboard");
});

// ebar ami amar main jei App ta ase ... shetake bole dicchi .. tumi .. ei route tao use koro
app.use("/admin/", adminRoute); //ei route ta she .. use korbe, kintu kon path e use korbe ? sheta amake bole dite hobe..
//use korbe /admin path e ... http://localhost:313/admin/ .. jokhon e she dekhbe admin .. taile bujhbe je amar router change hoye
// gese .. adminRoute e jete hobe ... adminRoute e  /dashboard ... tar mane .. /admin/dashboard .. taholei oi route ta kaj korbe

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/user/:id", (req, res) => {
    // eta amar root route
    res.send("Request Object .js GET method ");
    console.log(
        "================================= Start ============================================"
    );
    console.log(
        "http://localhost:313/user/3?filter=name,age => req.originalUrl => ",
        req.originalUrl
    ); // /user/3?filter=name,age
    console.log(
        "http://localhost:313/user/3?filter=name,age => req.url => ",
        req.url
    ); // /user/3?filter=name,age
    console.log(
        "http://localhost:313/user/3?filter=name,age => req.path => ",
        req.path
    ); // /user/3 // path er moddhe query String gula thake na .. full path paowa jay .. shob slash thake

    console.log(
        "http://localhost:313/user/3?filter=name,age => req.hostname => ",
        req.hostname
    ); // localhost

    console.log("1. req.baseUrl =>", req.baseUrl);
    console.log("2. req.path => ", req.path);
    console.log("3. req.hostname =>", req.hostname);
    console.log("4.req.ip => ", req.ip);
    console.log("5. req.method => ", req.method); // shob Capital letter e ashbe
    console.log("6.req.protocol  => ", req.protocol);
    console.log("7.req.params => ", req.params);
    console.log("8. req.query => ", req.query);
    console.log("9.req.body=> ", req.body); // json parser user korte hobe
    console.log("10. req.cookies=> ", req.cookies); // cokies parser na thakle kaj korbe na ... npm i cookie-parser
    console.log("11. req.signedCookies=> ", req.signedCookies);
    console.log("12.  req.secure=> ", req.secure);
    console.log(
        "============================================================================="
    );
    console.log("13. req.app=> ", req.app);
    console.log(
        "============================================================================="
    );
    console.log("14.req.route => ", req.route);
    console.log(
        "================================= EnD ============================================"
    );
});

app.post("/user/", (req, res) => {
    // eta amar root route // req.body check korar jonno amra arekta route banailam
    res.send("Request Object .js POST method ");

    console.log(
        "http://localhost:313/user/3?filter=name,age => req.body => ",
        req.body
    ); // undefined
    // er karon hocche normal raw node js e kono request er response ashle sheta amra normal buffer akare pai .. express e ar
    // buffer paowa lage na .. direct value jeta send kora hoyeche .. shetai paowa jay .. shejonno amader parsing korte hobe
    // parser function use korte hobe .. jemon express.json / express.urlencode .. ami jehetu json data pathiyechi .. tai
    // express er epash e jodi ekta json parser rakhtam .. tahole she amake data ta dite parto .. parser jehetu rakhini ..
    // tai she amake undefined diyeche
    // parser use korar jonno bolte hobe .. app.use(express.json()); // app ke ami bolchi tumi use koro .. kon parser ta ..
    // express.json() .. ei parser ta // jeta pabo .. sheta valid js object
});

app.put("/user/", handler);

app.listen(313, () => {
    console.log("listening on http://localhost:313/");
});
