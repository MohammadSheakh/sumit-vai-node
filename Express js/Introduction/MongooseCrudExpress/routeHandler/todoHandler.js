const express = require("express");
const mongoose = require("mongoose");
const checkLogin = require("../middlewares/checkLogin");

const router = express.Router();
// karon oi pash theke jehetu use bolechi .. tai ekta
// particuler router ekhan theke export korbo .. and
// shei router ta ashole amader index.js er todoHandler hobe

const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);
const todoSchema = require("../schemas/todoSchema");
// Model jehetu banabo Schema ta ke use kore .. tai prothom e Schema ta ke niye ashte hobe
// ebar amra Model banabo .. jei model ta amra ei vitorer shomosto jaygay amra use korbo
const Todo = new mongoose.model("Todo", todoSchema); // karon amra jeta banabo .. sheta class hobe arki // jehetu model banabo
// mongoose.model() mainly ekta class return kore ...  jar karone amra new dicchi
// 1st parameter model er nam .. singular .. first letter capital .. eta hoile jeta hobe .. she ashole collection / db er table
// banabe Todos nam e .. Todo collection tar nam theke dibe todos..
// 2nd parameter e jabe .. kon Schema ta ke amra follow korbo
// Summery :- prothom e ekta Schema banabo .. tarpor shei Schema er upor base kore ekta Model banabo .. jeno ei Model er maddhome
// amra object mapping korte pari .. eta kei bola hoy object data model/mapping
// tahole ekhon amra todo ekta object pabo .. shei todo object dia onek kaj korte parbo

//GET ALL THE TODOS
router.get("/", checkLogin, (req, res) => {
    // (req, res) middleware e jaowar age checkLogin nam e arekta middleware set kore dilam .. ei route e hit korte
    // hoile authentication token valid houwa lagbe ..
    // status jegular active shei data gula dibe .. jekono condition deowa jabe

    //---------------------------------------------------------------
    console.log(req.username); // eta checkLogin.js theke ashse ..      .......................................
    //---------------------------------------------------------------
    /*
    // ei part er code thik ase .. shob data dekhar jonno ei code 
    Todo.find({ status: "active" }, (err, data) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error",
            });
        } else {
            // tar mane data successfully insert hoyeche
            res.status(200).json({
                // ekhane amra ekta array pabo ... karon onek gula todo hobe
                result: data,
                message: "success",
            });
        }
    });
    */
    // ekhon amra method chaining er maddhome kichu validation add kore dibo .. kon kon field amra dekhte chai na sheta bole dibo ..
    Todo.find({ status: "inactive" })
        .populate("user", "name username -_id") // jehetu relational db system. tai kon jinish er aro bistarito jante chan .. shetao bole deowa jabe ..
        // relation jehetu ase .. user table er shob information chole ashbe ..shob data chole ashse .. 2nd parameter e bole deowa
        // jabe .. kon kon data chai // minus dia likhle shei data gula dekhabe na
        .select({
            // na dekhte chaile 0 .. bakigula dekhte chai .. automatic 1 .. abar 1 boleo deowa jabe
            _id: 0,
            __v: 0, // version
            date: 0,
        })
        .limit(6) // koyta data dorkar shetar limit
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error",
                });
            } else {
                // tar mane data successfully insert hoyeche
                res.status(200).json({
                    // ekhane amra ekta array pabo ... karon onek gula todo hobe
                    result: data,
                    message: "success",
                });
            }
        });
    // .select .limit .exec ... egula hoilo ek ekta query helper
});

// GET ACTIVE TODOS --------------------------------- Instance Method ----------------
router.get("/active-async-await", async (req, res) => {
    const todo = new Todo(); // Document ke baniye nite hobe .. Model ke dia ..
    const data = await todo.findActive(); // shei Document ke dia e instance method ke call korte hobe
    // findActive() jei find function ta return kore .. sheta kintu ekta Ascyncronous function .. mane findActive() hote ektu
    // shomoy lagbe .. mane ei jinish ta ekta promise return kore .. promise return korle amake taile wait korte hobe .. await
    // jehetu ekhane await use korechi .. tahole obosshoi ei function ta async hote hobe ..
    // try catch use korlam na .. dhore nilam .. kono error hobe na ..
    res.status(200).json({
        data,
    });
    // todoSchema.js theke // status inactive kore dile ekta datao dekhabe na
});

// same jinish .. callback use korlam
router.get("/active-callback", (req, res) => {
    const todo = new Todo();
    todo.findActiveCallback((err, data) => {
        res.status(200).json({
            data,
        });
    });
});

// --------------------------------- Static Method ----------------
router.get("/js", async (req, res) => {
    const data = await Todo.findByJS(); //call korbe Todo..model ta..static method houay Class e call korte pare..instance lage na
    res.status(200).json({
        data,
    });
});

// --------------------------------- Query Helper ----------------
router.get("/language", async (req, res) => {
    const data = await Todo.find().byLanguage("js"); //ekhane by language tai holo amader banano custom query helper
    res.status(200).json({
        data,
    });
});

//GET A TODO BY ID
router.get("/:id", (req, res) => {
    // id ta ke route parameter hishebe receive korte hobe
    // tar pore amra take handle korbo
    Todo.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error",
            });
        } else {
            // tar mane data successfully insert hoyeche
            res.status(200).json({
                result: data,
                message: "success",
            });
        }
    });
});

//POST A TODO -- callback way
/*
router.post("/", checkLogin, (req, res) => {
    // kivabe ekta todo amra database e insert korte pari
    // mongoose use korar karon hocche amra amader database er ekta schema design korte parbo
    // like amader database er design ta kemon hobe .. sheta ami mongo db ke enforce korte parbo
    // so first e amra amader db er ekta schema banabo .. db er ekta particular table/collection e amra todo
    // nam e ekta collection create korbo .. and shei collection er moddhe todo gula thakbe
    // shei todo collection er chehara ta / schema ta kemon hobe .. sheta amra first e define korbo
    // schemas nam e ekta folder nicchi .. tar moddhe todoSchema.js nam e ekta file nicchi
    // amra amader shob database ke evabe shundor kore schema design kore rakhte pari .. jeno ..
    // mongoose eta ke respect kore .. and jokhon kono data ashbe .. tokhon Schema ta ke validate kore .. she data ta ke
    // validate kore database e insert korbe
    // request jokhon hobe .. tokhon request er body te ekta todo object ashbe ..sheta dekhte todoSchema er moto hobe

    // ekhon request er body amra jegula pacchi .. sheta charao amader ekhon save korte hobe .. kon user Todo
    // ta post korse ..
    const newTodo = new Todo(req.body); // jeta ami pabo .. ei Todo ta hocche Model er Todo // Model er nam ta
    // req.body er moddhe Todo er object ta ase ..
    newTodo.save((err) => {
        // .save() ta hocche ekta instance method
        if (err) {
            res.status(500).json({
                error: "There was a server side error",
            });
        } else {
            // tar mane data successfully insert hoyeche
            res.status(200).json({
                message: "Todo was inserted successfully",
            });
        }
    }); // etao ekta 😀asyncronous function.. karon database e dhukano ekta asyncronous jinish .. eta call kore dilei save hoye jabe
});
*/

//POST A TODO -- asyncronous way ... code ektu kom lekha lagbe .. code ektu guchano hobe ..
router.post("/", checkLogin, async (req, res) => {
    // ekhon request er body amra jegula pacchi .. sheta charao amader user er id tao ekhon save korte hobe ..
    //  kon user Todo ta post korse ..
    const newTodo = new Todo({
        // distructure kore req.body er shob kichu niye ashsi .. and tar shathe shathe
        ...req.body,
        user: req.userId, // userId tao add kore dilam ..
    }); // jeta ami pabo .. ei Todo ta hocche Model er Todo // Model er nam ta
    // req.body er moddhe Todo er object ta ase ..
    try {
        const todo = await newTodo.save(); // jeta save hoilo .. sheta abar return o kore dey amra jani ..
        // ekhon amader user lagbe .. userSchema niye ashte hobe ei file e ..
        await User.updateOne(
            {
                _id: req.userId,
                // kon ta upate korte hobe
            },
            {
                // ki data diye update korbo .. but ei bekkha ta sure na ..
                $push: {
                    // 19 : 50
                    todos: todo._id,
                },
            }
        );

        // tar mane data successfully insert hoyeche
        res.status(200).json({
            message: "Todo was inserted successfully",
        });
    } catch (err) {
        console.log("😪--todoHandler > router.post / catch err -> ");
        res.status(500).json({
            error: "There was a server side error",
        });
    }
    // etao ekta 😀asyncronous function.. karon database e dhukano ekta asyncronous jinish .. eta call kore dilei save hoye jabe
});

//POST MULTIPLE TODO
router.post("/all", (req, res) => {
    // eikhane amra expect korbo je amar request e ashbe hocche ekta array .. mane array of object..
    /**
     * jokhon amra single data insert korechilam .. tokhon amra newTodo call kore notun document object create kora hoyechilo
     * and tar pore shei newTodo.save() call kore .. shei data ta insert hoye gelo ..
     * kintu jokhon amra multiple document niye save korbo .. tokhon to ekta single document akare korte parbo na .. tokhon amake
     * shora shori .. Todo model er just ekta method call korlei hobe .. sheta hocche dot.insertMany()
     * jehetu asyncronous tai shuru te await dite hobe ..
     */
    Todo.insertMany(req.body, (err) => {
        //req.body mane full array ta arki .. amar jei array of object ta .. sheta arki .. mane ami jei data ta dhukate chacchi
        // shei data ta ekta array of object akare .. amader first parameter e dite hobe .. ami expect korsi sheta req.body
        // thekei ashbe ..
        if (err) {
            res.status(500).json({
                error: "There was a server side error",
            });
        } else {
            // tar mane data successfully insert hoyeche
            res.status(200).json({
                message: "Todos were inserted successfully",
            });
        }
    });
});

//PUT TODO
router.put("/:id", (req, res) => {
    // update korte hole amader ke ekta particular jinish update korte hobe
    // jei field gula dia filter korte chai .. khujte chai shegula {} er moddhe dia dite hobe
    // amra _id jei field ta .. sheta dia filter korte chacchi .. and shei _id field ta amar request e ashse hocche req.params.id
    // apni multiple field use koreo khujte paren .. jemon {title='Mohammad', status='active'}
    // first e ami dilam filter ta ki .. ki dia she khujbe .. ekhon 2nd parameter e dibo kon data dia update korbe ..
    // ekta object dite hobe .. shekhane $set nam e ekta property dite hobe .. sheita abar arekta object .. shei khane amra ekhon
    // jei jei jinish ta update korte hobe .. shegula bole dibo.. ki data update korte hobe  shetao request e ashte pare
    // kintu ekhon amra hardcode kore dicchi ..
    // 3rd parameter e ekta callback
    // updateMany ta documentation theke dekhe nite hobe
    Todo.updateOne(
        { _id: req.params.id },
        {
            $set: {
                title: "Sheakh",
                description: "This is Fake",
                status: "inactive",
            },
        },
        (err) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error",
                });
            } else {
                // tar mane data successfully insert hoyeche
                res.status(200).json({
                    message: "Todo was updated successfully",
                });
            }
        }
    );
});
/**
 * amra update kore kintu kono result pacchi na .. amra jodi chai .. amra jodi update kore .. updated document ta response e
 * pete chai .. const result =  await Todo.findByIdAndUpdate() .. 3rd parameter ... {} blank object .. er moddhe terminal er kotha
 * moto kaj korte hobe useFindAndModify: false, eta bole dite hobe .. ar update korar porer obstha dekhte chai new:true korte hobe
 * shobar shesh e result ta clg korlei dekhte pabo
 */

//DELETE TODO
router.delete("/:id", (req, res) => {
    // findByIdAndDelete use korle .. kon data delete hoise .. shei data ta pabo amra
    Todo.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error",
            });
        } else {
            // tar mane data successfully insert hoyeche
            res.status(200).json({
                message: "Todo was deleted successfully",
            });
        }
    });
});
module.exports = router;
