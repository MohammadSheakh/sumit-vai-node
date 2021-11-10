const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const router = express.Router();
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema); // karon amra jeta banabo .. sheta class hobe arki // jehetu model banabo

//SIGNUP
router.post("/signup", async (req, res) => {
    // signup er jonno jehetu user kichu information dibe .. definately sheta amra POST method e receive korbo
    // kivabe ekta user amra database e insert korte pari
    // mongoose use korar karon hocche amra amader database er ekta schema design korte parbo
    // like amader database er design ta kemon hobe .. sheta ami mongo db ke enforce korte parbo
    // so first e amra amader db er ekta schema banabo .. db er ekta particular table/collection e amra user
    // nam e ekta collection create korbo .. and shei collection er moddhe user gula thakbe
    // shei user collection er chehara ta / schema ta kemon hobe .. sheta amra first e define korbo
    // schemas nam e ekta folder nicchi .. tar moddhe userSchema.js nam e ekta file nicchi
    // amra amader shob database ke evabe shundor kore schema design kore rakhte pari .. jeno ..
    // mongoose eta ke respect kore .. and jokhon kono data ashbe .. tokhon Schema ta ke validate kore .. she data ta ke
    // validate kore database e insert korbe
    // request jokhon hobe .. tokhon request er body te ekta todo object ashbe ..sheta dekhte userSchema er moto hobe

    // req.body te user password o dibe .. eta ke hash kore nite hobe .. tai direct request er body ami ekhane pass
    // kore dibo na.. tar jaygay ei body ta amra create korbo ..

    // password ta ke age hash kore nite hobe ..
    // async await er jonno try catch block use korchi
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(200).json({
            message: "Signup was successful",
        });
    } catch (err) {
        res.status(500).json({
            message: "Signup was not successful",
        });
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        // username database e ase kina check kortesi
        const user = await User.find({ username: req.body.username }); // array return kore
        if (user && user.length > 0) {
            // ebar amake check korte hobe password thik ase kina
            // user theke password pabo kintu text akare .. kintu database e save ase hash ...
            const isValidpassword = await bcrypt.compare(
                req.body.password,
                user[0].password
            );
            if (isValidpassword) {
                // user ke ekta Authentication token dibo .. // generate token
                const token = jwt.sign(
                    {
                        username: user[0].username,
                        userId: user[0]._id,
                    },
                    process.env.JWT_SECRET, // eta ke evabe access kora jabe na .. arekta middleware use korte hobe
                    // middleware dotenv use korte hobe index.js e
                    // ekhon ekhane amra onek option add korte pari
                    { expiresIn: "1h" } // ei token ta 1hr er jonno valid .. er pore invalid hoye jabe ..
                );
                // token generate kora shesh .. ekhon amra response diye dite pari
                res.status(200).json({
                    access_token: token,
                    message: "Login Successful !",
                });
            } else {
                res.status(401).json({
                    error: "Authentication Failed",
                });
            }
        } else {
            // unauthenticated status code
            res.status(401).json({
                error: "Authentication Failed",
            });
        }
    } catch (err) {
        res.status(401).json({
            error: "Authentication Failed",
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(200).json({
            message: "Signup was successful",
        });
    } catch (err) {
        res.status(500).json({
            message: "Signup was not successful",
        });
    }
});

// GET ALL USERS
router.get("/all", async (req, res) => {
    try {
        const users = await User.find({
            status: "active",
        }).populate("todos");

        res.status(500).json({
            data: users,
            message: "Success",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "There was an error on the server side",
        });
    }
});
module.exports = router;
