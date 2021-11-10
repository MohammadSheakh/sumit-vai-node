const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");

// express app initialization
const app = express();
dotenv.config();
app.use(express.json()); // json parser use kortesi // jeno amar jei API response gula ashbe .. shegula ami JSON akare pai

//database connection with mongoose  // eta korar jonno mongoose amader ekta simple function diye diyeche
mongoose
    .connect("mongodb://localhost/todos", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }) //database er URL ta bole dite hobe  // database er nam hocche todos
    // eta amader ekta promise return korbe .. eta ekta asyncronous bepar
    // 2nd parameter e thakbe bivinno dhoroner options
    // ekhon amra then catch block ta likhbo
    .then(() => console.log("MongoDB Connection Successful"))
    .catch((err) => console.log(err));
// database er shathe connection done .. ebar amra mongo db er shathe kaj kote parbo

//application routes
// amra mongo db database er shathe connect korbo mongoose er maddhome
// ebar amra amader application er bivinno route declare korbo ,.. and shei route er maddhome amra amader API banabo .. TODO API
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// default error handler
const errorHandler = (err, req, res, next) => {
    console.log("😀 ", err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
};

app.use(errorHandler);

app.listen(313, () => {
    console.log("Listening on http://localhost:313");
});
