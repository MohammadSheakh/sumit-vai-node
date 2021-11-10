const express = require("express"); //require korle express
// muloto amader ke ekta function return kore ..
// amra jodi shei function ta ke call kore dei .. tahole ..
//  ami app nam e ekta object pabo
const outside = require("./outside");

//------------------------------------------------------------------------------------------------------
const app = express();
// ei app object amader ke shob dhoroner convenience dey .
// ei je amra ekta app niyechi .. express function call kore .. eta to ekta app

app.set("view engine", "ejs"); // ejs template engine ta ke express application e add korte chaile ..
////////////////////////////ekhane settings table er ekta settings ase .. view engine.. and shetar nam bolbo .. ejs
// settings table ta documentation theke dekhe nite hobe
// amra je .. get e etokkhon raw response dicchilam..res.send();// ebar send na diye..amra jeta bolbo.. res.render()
// and eitar moddhe amra ekta template file er nam bole dibo

//=================================================================================================================================

// amra chaile ei express project er moddhe multiple app rakhte pari
// duitai separate object .. karon object hocche reference type
const admin = express(); // admin hocche arekta separate app
// admin kintu amader sub app
// amra jokhon kono parent app e thakbo.. parent app e thaka obosthay jodi kono sub app mounted hoy.. taholei shathe
//  shathe mount event ta fire hobe  ... parent mane hocche amar main app // mane she call back e parent ta diye dey
admin.on("mount", function (parent) {
    console.log("Admin Mounted");
    console.log(parent); // refers to the parent app
    // sub app ta jokhon kono ekta particular app er moddhe mount hobe .. tokhon eita fire hobe    >>>> EVENT <<<<<<<<<<<<<<<<<<
});

/*
 * jemon ekta project e front-end ase .. abar back-end o ase .. front-end er route gula ek rokom .. ar jegula
 * back-end .. shekhane ami chacchi /admin/ er pore jei route gula shegula shob hocche back-end
 * app.use er /admin route e jokhon keo hit korbe .. tokhon amra ta ke pathiye dibo kothay ! admin app e pathiye dibo
 *
 */
app.use("/admin", admin);
// ei admin app er jonno
admin.get("/dashboard", (req, res) => {
    console.log("🔗", admin.mountpath); // admin er root path ta she return kore
    res.send("This is admin / dashboard");
});

//------------------------------------------------------------------------------------------------------

/*
app.locals.title = "My APP !"; // local variable application er moddhe save kore rakhe .. eta ekta object .. tar moddhe amra chaile
// amader pochondo moto property set korte parbo .. eta amader application er local variable .. eta amader entire
// application er jekono jaygay access korte pari .. entire application
*/

const router = express.Router({
    caseSensitive: true, // by default false thake .. true kore deowa jete pare .. iccha
});
app.use(express.json());
app.use(router);

router.get("/", (req, res) => {
    // req and res accept kore .. ei function ta
    console.log("1⭕", req.body);
    console.log("1️⃣", app.locals.title);

    //  res.send("This is Root GET Request.............");
    res.render("pages/home"); // .ejs likha lagbe na ==============================================
});
app.enable("case sensitive routing"); // routing ta ke case sensitive koro
app.disable("case sensitive routing"); // ekbar enable kore .. abar disable kore dile .. ekhon upper case kaj korbe
// ei jinish app er jonno kaj kore .. but router er jonno kaj kore na ... ei case sensitive enable disable korar bepar ta
// kono ekta setting enable thake. tahole app.enabled() true return korbe .. ar kono settings disable thakle.. app.disabled()->false
//----------------------------------------------------------// app.disable(name) // app er kono ekta settings ke disable kore dey
//                                                                            // >>>>>> app.delete() <<<<<< dekhte hobe
////////////////////////////////////////////////////////////// app.set()-> local variable er motoi .. kono kichu custom settings
////////////////////////////////////////////////////////////// set korle .. sheta app.get() dia .. sheta get kora jabe ...
////////////////////////////////////////////////////////// app.listen() -> port number dia server start
////////////////////////////////////////////////////////// app.METHOD() -> shob method er common -> GET,PUT,POST
///////////////////////////////////////////////////////// app.path() -> eta khub e simple .. dekhte hobe
////////////////////////////////////////////////////////// app.param() -> this is very important
// param jeta kore .. amader route e to onek dhoroner parameter thakte pare .. onek route e user er shathe ID parameter hishebe
// pathate hoy .. jemon -> http://localhost:3000/user/5 -> mane 5 number user er resourse amader dorkar
// so sheta ke routing korar jonno .. common dhorar jonno ":" ei sign dite hobe .. tarpor apni ki chacchen .. shei je 5 .. sheta ke
// jodi apni ID nam e pete chan .. tahole ":id" ... evabe bolte hobe.. mane route parameter ID er moddhe 5 ke paben arki
// ekhon app.param jei kaj ta kore ..
app.param("id", (req, res, next, id) => {
    // eta middle wire / interceptor o bola jay
    // jokkhon e route er moddhe id nam e kono param thakbe {:id} {http://localhost:3000/user/5 ei 5 ta jokhon :id er shathe
    // match korse .. shathe shathe ei param{5} er value hoye jacche :id} and ei :id jehetu app.param("id",)-> id er shathe match
    // koreche .. tahole ei callback function ta execute hobe ... ei callback er moddhe amra jekono kaj korte pari ..
    // amra chaile request object er moddhe kichu ekta dhukiye dite pari ..ba database theke kono data ene .. kono ekta kaj korte
    // pari .. mot kotha hocche ei callback function ta ashole execute hobe .. and sheta kintu ei route er callback function e
    // jaowar age ... { app.get("/user/:id", (req, res) => {} }.. mane app.param() ta hocche ekta middle wire ..
    // middle wire hocche request e jaowar age ... kichu ekta kora ... so .. jeta korte hoy ...
    // ekhane kichu kaj kore ....  param theke ekta next call kore dite hoy
    const user = {
        userID: id,
        name: "bangladesh",
    };
    req.userDetails = user; // mane request object er moddhe intercept kore .. age request object er moddhe ekta jinish add kore
    // dilen ..
    next(); // mane ekhan kar kaj shesh .. tarpore app.get() er callback function e chole jabe
    // mane .. request ta process houar age .. kichu ekta kora
    //-----------------------------------------------------------------------------------------------------------------------
}); // she basically kono ekta perticular param name er upor base kore .. kono ekta kaj kore .. majhkhane boshe jay
// amar param er nam ta ki .. id .. id nam e jodi kono param she pay mane id ta jodi match kore .. tahole id owala shob param er
// jonno .. she hocche 2nd parameter er callback function ta execute hobe.. shkhane amra pabo hocche req,res, next, id (finally
// shei id ta ) id ta onno nam eo receive kora jabe ..
app.get("/user/:id", (req, res) => {
    console.log(req.userDetails); // eta taile ekhon ekhane available ase ..
    // input-> http://localhost:31313/user/4 output -> { userID: '4', name: 'bangladesh' }
    res.send("we are from USER ");
});

//------------------------------------------------------------------------------------------------------

app.all("/appall", (req, res) => {
    ///////////////////////////////////// kahini ta bujhlam na .. router ta na use kortesi .. taile ekhon app ashlo koi theke
    res.send("This is app.all");
});
// je method ei .. ei route e hit kora hok na keno ... take amra response dibo       >>>>>> app.all() <<<<<<
// it would be accept by all type of method
router.all("/all", (req, res) => {
    // req and res accept kore .. ei function ta
    console.log("2⭕", req.body);
    console.log("1️⃣", app.locals.title);

    res.send("This is ALL Request.............");
});
router.get("/home", (req, res) => {
    // req and res accept kore .. ei function ta
    console.log("3⭕", req.body);
    console.log("1️⃣", app.locals.title);

    res.send("This is homepage GET Request.............");
});

router.get("/outside", outside); //app.locals.title eta outside.js er moddhe access kora jabe . request er maddhome

router.post("/home", (req, res) => {
    console.log("4⭕", req.body);
    res.send("This is homepage with POST request");
});

//------------------------------------------------------------------------------------------------------
// app.route(); // same url er  bivinno method er function likhar jonno bar bar same link likhar dorkar nai
app.route("/same/route/for/diff/method/")
    .get((req, res) => {
        //{GET, POST, PUT, DELETE}
        res.send("Same Route For Different Mehtod {GET}");
    })
    .post((req, res) => {
        res.send("Same Route For Different Mehtod {POST}");
    })
    .put((req, res) => {
        res.send("Same Route For Different Mehtod {PUT}");
    });

//------------------------------------------------------------------------------------------------------
// app.engine() // template engine()
// ekhon amra ekta template engine install korsi .. normally etokkhon porjonto .. REST API er moto .. amra just JSON Response
// (TEXT/ RAW) dicchilam .. kintu ekhon amra ekta template response dibo ...mane kono ekta html response dibo
// jodi express.js ta ke ekta MVC framework hishebe use korte chai .. shejonno amra template engine lagiye nibo ..
// ejs is close to html
//------------------------------------------------------------------------------------------------------
//  ekhane amra app.listen korte parbo
app.listen(31313, () => {
    // ei listen complete howar por..karon server listening ekta
    // system process tarpor ei function ta call hobe
    console.log(
        `
        ------------------------------------------------------------------------------------------
        📢📈listening on http://localhost:31313   📌⚡   application created by :- Baraka SoftNix
        Coder                  : Mohammad Sheakh.. fb: https://www.facebook.com/mohammadsheakh.mern/
        Application name       : Application Object
        Project Starting Date  :
        Project Finishing Date :
        
        Project Received by    : 
        ----------------------------------------------Start------------------------------------------
        `
    );
}); // ebar eta 31313 port e listen korbe
// and ek e shathe ekhane ekta callback function diye dite parbo
