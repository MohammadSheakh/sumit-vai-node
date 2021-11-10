const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

const UPLOADS_FOLDER = "./uploads/";
// form er multipart data ke process / parse korar jonno express amader ke arekta package diyeche ..
// shetar nam hocche multer

// ekhon user ra jei file gula upload korbe .. shegular upore restriction dibo ekhon  .. file er field er nam ta
// koto boro hobe .. erokom onek kichu limits er moddhe bole deowa jay

//define the storage
const storage = multer.diskStorage({
    // ekta option ei diskStorage ta receive kore .. object akare..
    destination: (req, file, cb) => {
        // jei request ta ashse .. file er detailed info .. cb => callback .. shob kaj kore .. ei callback er
        // ta ke ashole callback deowar shomoy amake bole dite hobe amar folder ta ashole ki ? mane kon folder e
        // data save korte chai
        cb(null, UPLOADS_FOLDER); // null mane kono error nai .. ekhane kintu true false deowa jabe na ..
        // she ekhane expect kore ..folder er path ..
    },
    filename: (req, file, cb) => {
        // eta keo ekta function hishebe amra treat korte pari ..
        // ekhane finally callback hishebe jei file er nam ta amra generate korbo .. shete diye dibo
        // she to oi filename ta use korbe .. storage korar shomoy
        const fileExt = path.extname(file.originalname); // file er extention ta alada hoye gelo
        const fileName =
            file.originalname
                .replace(fileExt, "")
                .toLowerCase()
                .split(" ")
                .join("-") +
            "-" +
            Date.now();
        cb(null, fileName + fileExt);
    },
});

// prepare the final multer upload object
var upload = multer({
    //dest: UPLOADS_FOLDER, // jehetu amra file name manupulate kora shikhsi .. tai eta use korbo na
    storage: storage,
    limits: {
        fileSize: 1000000, // byte calculation 1000 * 1000 // 1MB er boro file ashole ekhane upload korte parbo na
    },
    fileFilter: (req, file, cb) => {
        // jei request ta ashse .. file er detailed info .. cb => callback .. shob kaj kore .. ei callback er
        // maddhome janay diben je .. tumi ta ke allow korbe ki korbe na .. mane file ta ke arki
        //console.log("File Information => ", file); // fieldname, originalname, encoding, mimetype
        // callback dei nai mane .. ekhono kintu file upload hoy nai ..
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true); // callback ta error back pattern follow kore .. true mane file is allowed to upload
            // ar null mane kono error nai ..
        } else {
            //cb(null, false);
            // specific kono error dite chaile null er jaygay
            cb(new Error("Only .jpg, .png or .jpeg format allowed !"), false); // sure na .. false may be lage na
        }
    },
}); // ei function ta parameter hishebe ekta object ney .. and tar moddhe amra bivinno option bolte pari
// shobcheye basic option hocche ..ami kon folder e upload korte chai..dest -> destination -> ei folder e file upload korte hobe
// ei je upload ta amra peyechi .. eta ashole ekta middleware amader ke return korbe ..

//multiple file upload korar jonno upload.single er jaygay upload.array use korte hobe..field name, how many file
//app.post("/", upload.array("avatar", 3), (req, res) => {
app.post(
    "/",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "gallery", maxCount: 2 },
    ]),
    (req, res) => {
        // parameter hocche html er form er input theke neowa file er nam ta ..
        // etao kintu ekta middleware//ekhane ashar age amra multer er middleware ta use korbo..multer onek gula middleware provide
        // kore..tar moddhe ekta hocche dot single method..eta call korle..ekta single file upload korar jonno ekta middleware pabo
        // upload.single("avatar")..middleware er kaj hocche multipart data ta ke parse korte parbe..tarpore she khujbe avatar nam e
        // je amar jei file ta ache..shei file ta amake upload korte hobe ..
        res.send("What's up Good people !");
        //console.log(req.file)// single file
        console.log(req.files);
    }
);

// nijer moto kore error handle korte chaile ...
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send("There was an upload error ! :( ");
        } else {
            res.status(500).send(err.message);
        }
    } else {
        res.send("Success ! ");
    }
});

app.listen(313, () => {
    console.log("listening on http://localhost:313");
});
