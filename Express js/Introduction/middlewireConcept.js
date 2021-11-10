const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const adminRouter = express.Router();
app.use("/admin", adminRouter); // app ke bole dilam .. tumi adminRouter use koro ..
app.use(express.json()); // built in level
app.use(cookieParser()); // cookieParser() ekta middleware return kore .. third party level

const myMiddleware2 = (req, res, next) => {
    // next e proyojon hoile jabe .. ar ei middleware tai jodi amar response diye dey taile ar next er proyojon nai
    console.log("I am logging in myMiddleware 2");
    next(); // next call na kore dile .. ei jayga tay hang hoye jabe amar middle ware
};
adminRouter.use(myMiddleware2); //  ekhon Router level e ei middleware ta ke use kortesi

const myMiddleware3 = (req, res, next) => {
    // next e proyojon hoile jabe .. ar ei middleware tai jodi amar response diye dey taile ar next er proyojon nai
    console.log("I am logging in myMiddleware 3");
    //next(); // next call na kore dile .. ei jayga tay hang hoye jabe amar middle ware
    throw new Error("This is an error "); // tar mane response end hocche na ..
    // ei error ta ke jodi ami arekta middle wire diye catch na kori .. taile kintu amar application crash korbe
};

adminRouter.use(myMiddleware3);

adminRouter.get("/dashboard", (req, res) => {
    res.send(
        "We are in admin/dashboard GET .. Middle Ware concept Router level"
    );
});

// configurable middleware
const loggerWrapper = (options) =>
    function (req, res, next) {
        if (options.log) {
            console.log("Logger Wrapper is cool ! ");
            next();
        } else {
            throw new Error("Failed to log into Logger Wrapper");
        }
    };
app.use(loggerWrapper({ log: true })); // ebar amra middleWare function ke call korar shomoy data pathaitesi

const myMiddleware = (req, res, next) => {
    // next e proyojon hoile jabe .. ar ei middleware tai jodi amar response diye dey taile ar next er proyojon nai
    console.log("I am logging in myMiddleware");
    next(); // next call na kore dile .. ei jayga tay hang hoye jabe amar middle ware
    // next() call na kore res.end() er maddhomeo response ta end o kora jete pare .. taile ar porer step e jabe na
    // next() er moddhe kono string value  dile .. sheta ke she error mone kore
};
// ei function ta matro define korechi .. kintu app ke ekhono bole dei nai je .. tumi eita use koro
app.use(myMiddleware); //app jehetu eita ke use kore .. taile age middleware call hobe ..then baki kaj
// app.use(myMiddleware2); // application level e amra middlewire ta ke use korechi

app.get("/about", (req, res) => {
    res.send("MiddleWare Concept !");
});

/**
 * jekono middleware theke amra chaile ekta error throw korte pari
 */

// error handling middleware
const errorMiddleware = (err, req, res, next) => {
    console.log(err); // eta ekta javaScript object
    console.log(err.message);
    res.status(500).send("There was a server side error ! ");
};
adminRouter.use(errorMiddleware);

app.listen(313, () => {
    console.log("listening on http://localhost:313/ middleware concept object");
});
