// user collection create korar jonno userSchema
// amra ei userSchema er upor base kore user Sign Up er bebostha korbo
const mongoose = require("mongoose");
// jehetu schema banate hobe mongoose er through te .. tai amake mongoose ta niye ashte hobe

// mongoose jevabe connect korar shomoy amra jevabe mongoose.connect use korechilam ekta method er maddhome
// schema bananor shomoy o mongoose amader ke mongoose.schema nam e ekta method dia diyeche
const userSchema = mongoose.Schema({
    // user table er prothom field amra dibo name .. etar bivinno jinish pati amra dite pari
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
    },
    //enum: ['active', 'inactive'] duita option theke jekono ekta hobe .. onno kichu dile error dibe
    todos: [
        // ei field ta ashole ekta object na .. ei field ta ashole ekta array
        // ei array er moddhe ek ekta property hobe ek ekta object
        {
            type: mongoose.Types.ObjectId,
            ref: "Todo",
        },
    ],
});
// ekhon ei userSchema er upor base kore user Sign Up er bebostha korbo

// er moddhe amra ekta object dibo .. ei object er moddhei amader database er schema ta thakbe
// mongoose use korar karone ei shubidha ta amra pacchi .. mongo db te erokom kono schema validation nai
// oita no-sql database .. ja data diben .. tai nibe .. so etar kaj hocche .. eta amake enforce korbe
// amar ekta validation majhkhane boshacche .. ekhon jeta hobe mongoose er shathe jehetu ami connect korechi
// mongo db theke jokhon insert hote jabe . tokhon ashole mongoose er maddhome jabe and mongoose korbe ki
// ei schema ta je validate korbe .. jei data ta ami dicchi .. shei data ta .. ei schema er shathe match
// kore kina .. jodi match na kore .. tahole she data ta mongo db ke dibei na ..

// amra amader shob database ke evabe shundor kore schema design kore rakhte pari .. jeno ..
// mongoose eta ke respect kore .. and jokhon kono data ashbe .. tokhon Schema ta ke validate kore .. she data ta ke
// validate kore database e insert korbe

// ei je amra Schema ta amra use korechi .. niyom hocche Schema ta ke amake ekhon implement korte hobe ..
// jokhon amar post data ashbe .. jokhon amar data ashbe request theke .. tokhon shei data ta ke Schema er moddhe dia .. ghuriye
// ante hobe ... jeno she Schema ta ke respect kore .. sheta kivabe korbo ? niyom ta hocche Schema er maddhome amra ekta model
// banabo ..

// mongoose hocche ekta object data model.. amra Schema ta ke use kore prothom e ekta Model banabo .. shei Model er maddhome
// amra mongoose er bivinno method and property use kore amra .. data Insert, update, delete .. shob kichu korte parbo

module.exports = userSchema;
