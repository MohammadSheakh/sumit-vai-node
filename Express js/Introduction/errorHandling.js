const express = require("express");
const fs = require("fs");
const app = express();
// express e syncronous and asyncronous code er khetre dui vabe error handling korte hoy
// syncronous code er khetre express nijei amader jonno error handling kore dey

app.get("/", (req, res) => {
    //res.send("Error Handling Start");
    throw new Error("There was an error !");
});
// development environment .. production environment

// ekdom last basic .. -> amra chaile asyncronous code ke komiye syncronous code er default error handling er shubidha nite pari
// kivabe ? middleware chaining kore ..

app.get("/readfileNew", [
    (req, res, next) => {
        fs.readFile("/file-does-not-exist", (err, data) => {
            // Asyncronous Function  // Code
            console.log(data); // data kintu pai nai ..
            next(err); // express-error-handler er kache forward kore deowa te .. tai app ta crash korbe na .. handle hoye jabe
            //🎯 console.log(data.property); // kintu er porer line e jodi abar error hoy .. ekhanei crash korbe app ta
            // karon eita async code ar ei problem ta amra express ke forward kori nai ...
            // Solution er trick jeta hote pare .. next(err) er porer line gula .. porer syncronous middleware function e .. chain
            // kore dite pari. karon amra jani amra chaile middleware er function evabe array akareo chain korte pari ..
        });
    },
    (req, res, next) => {
        console.log(data.property);
        // ei khetre taile .. ei porer error ta jehetu ei syncronous code er moddhe ase .. ei error ta amader ke handle na korleo
        // cholbe .. karon amra jani sync code er error express automatically nijei handle kore .. ei khetre ar crash ta hobe na
        // express eta ke default error handler er kache pathiye dibe .. and sheta handle hobe
    },
]);

app.get("/readfile", (req, res, next) => {
    fs.readFile("/file-does-not-exist", (err, data) => {
        // Asyncronous Function  // Code
        if (err) {
            next(err);
        } else {
            res.send(data);
        }
    });
});

app.get("/setTime", (req, res, next) => {
    setTimeout(function () {
        try {
            console.log(a);
        } catch (err) {
            next(err);
        }
    }, 1000);
});

// jodi amra emon kono route e hit kori .. jeta exist e kore na .. tahole express amader ke 404 error dibe .. ei error ta kintu
// amader likha custom message ta dekhacche na .. 404 error er porjaye pore na .. eta just not found .. user er vul.. server er na
// etakeo handle korte chaile ....
app.use((req, res, next) => {
    // jokhon e keo emon kono URL e hit korbe .. jeta amader Route e nai .. tokhon express . shob gula route path check korte korte
    // jabe .. tarpor she ei middleware e dhuke jabe .. ekhan theke amra chaile user ke response dia dite parbo
    // abar chaile amader default error handling middleware er kache .. next function call kore pathiye dite parbo
    ///🎯 res.status(404).send("Requested url was not found !");
    // amra jodi response ta ekhane na dia .. porer middleware ke pathiye dite chai .. tahole next() er moddhe error message
    // ta vore dia .. amader error handling middleware er kache pathiye dilam
    next("Requested url was not found !"); // next() function er kono parameter text hishebe deowa mane holo .. error shoho porer
    // middleware e pathano
});

// Custom Error Handling
app.use((err, req, res, next) => {
    // last middleware function hote hobe ..
    // console.log(err);
    // headers send kora niye jei problem ta shetar jonno //9:00 theke video ta dekhte hobe
    if (res.headersSent) {
        next("There was a problem");
        // ekhaneo next call korle sheta invisible default error handler er moddhe jabe je shobar shesh e boshe ase ..
    } else {
        if (err.message) {
            res.status(500).send(err.message);
        } else {
            res.status(500).send("There was an error ");
        }
    }
    // res.status(500).send("There was an error ");
});

///////////////////////////// Default Error handling

app.listen(313, () => {
    console.log("app listening at http://localhost:313 errorHandling.js");
});
