const express = require("express");

const app = express();

app.set("view engine", "ejs");

//-------------------------------- res.locals ------------------------------------------------
app.get("/about", (req, res) => {
    /*
    🎯 console.log("before sending response res.headersSent => ", res.headersSent);
    //🎯 res.send("This is about page .. Response Object.js GET");
      🎯 res.render("pages/about", {
        name: "Bangladesh",
    }); // path ta bole dilam .. jeta render korte hobe
    //response deowar shomoy ei template ta she ashole load korbe.. ei je about.ejs .. shetar moddhe jodi
    // amra kono data pathate chai .. tokhon amra res.locals ta use korbo .. sheta hocche res.render er
    // second parameter hishebe ekta simple object pathate pari.. shetar moddhe amra jeta pathabo ..
    // sheta shekhane locals hishebe receive hobe
    //----------------------------- res.headersSend-------------------------------------------------
    // ami ekhane already ekta jinish pathiye diyechi
    🎯 console.log("after sending response res.headersSent => ", res.headersSent);
    */
    // property dekha shesh .. ekhon amra method gula dekhbo
    //🎯 res.send("This is about page "); // with data response end
    //🎯 res.end(); // without data response end
    //🎯  res.json({
    //     name: "Bangladesh For about",
    //     age: 32,
    //     District: "Dhaka",
    // });
    //rest api er khetre json response pathano ta khub e common..  response er header e application json kore
    // dicche ..  and ek e shathe .. eta ke json.stringify kore response diye dicche ..
    //🎯 res.status(200); // ekhane kintu response shesh hoy na .. er porer line e response end o korte hobe
    //🎯 res.end();
    // ek e shathe status set o end kore dite chaile ..
    //🎯 res.sendStatus(400);// 400 pathabei client e .. and 400 er jei corresponding header value (http term) ..
    // pathiye dibe
    /*
    // ebar res.format ta amra dekhbo  // eta request er shathe ekta content negotiation kore .. mane .. request er shathe
    // jodi kono rokom er accept header eshe thake .. like request e jodi client bole dey je ami .. ei dhoroner content-type
    // accept kori .. taile ei pash e eshe .. res.format jodi amra use kori .. tahole she automatically content negotiate korbe
    // kore dekhbe client ki chacche .. and shei onujayi .. she ashole response dite parbe ..
    🎯 
    res.format({
        "text/plain": () => {
            res.send("hi");
        },
        "text/html": () => {
            res.render("pages/about", {
                name: "Bangladesh",
            });
        },
        "application/json": () => {
            res.json({
                name: "Bangladesh For about",
                age: 32,
                District: "Dhaka",
            });
        },
        default: () => {
            res.status(406).send("Not Acceptable");
        },
    }); 
    // prothom property hishebe amra ek ekta content type hishebe amra ek ekta property dibo
    // content-type jodi text/plain hoy .. tahole .. amra bole dibo .. tumi ei function tar moddhe jaba
    // jokhon e request ashbe .. shei request er header e accept ta check korbe .. jodi accept mention kora thake .. and etar
    // moddhei kono ekta hoy .. tahole she dibe .. accept e jodi anything thake .. mane *./.* thake .. tahole she prothom ta dibe
    // ar jodi konotai match na kore .. tahole she fallback hishebe default ta dibe

    // ekta single response function diye .. amra bivinno content type er upor base kore .. client ja chacche .. tar upore base
    // kore amra response dite pari ..
    */
    // */*

    // ebar amra cookie er usecase dekhbo ..
    //🎯 res.cookie("name", "learnwithsumit"); // kon nam e cookie dite chai .. 2nd parameter e value dite pari
    // // cookie related option gula third parameter e deowa jabe .. documentation dekhte hobe must ..
    //🎯 res.end(); // eta must ditei hobe

    //🎯 res.location("/test"); // header e paowa jabe eita .. client jeno location header er upor e base kore redirect korte pare
    //🎯 res.redirect("/test"); //location er jaygay redirect kore dile .. ager bar e shudhu header e set kore diyechilo ..
    // ebar redirect kore diyeche ... /test route e
    res.set("Title", "Learn with sumit "); // response e ekta header set korchi
    console.log("res.get => ", res.get("Title"));
    res.end();
});
app.get("/test", (req, res) => {
    res.send("Redirect is done !");
});

app.listen(313, () => {
    console.log("listening on http://localhost:313/ response object");
});
