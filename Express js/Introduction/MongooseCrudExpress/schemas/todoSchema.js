const mongoose = require("mongoose");
// jehetu schema banate hobe mongoose er through te .. tai amake mongoose ta niye ashte hobe

// mongoose jevabe connect korar shomoy amra jevabe mongoose.connect use korechilam ekta method er maddhome
// schema bananor shomoy o mongoose amader ke mongoose.schema nam e ekta method dia diyeche
const todoSchema = mongoose.Schema({
    // todo table er prothom field amra dibo title .. etar bivinno jinish pati amra dite pari
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ["active", "inactive"],
    },
    //enum: ['active', 'inactive'] duita option theke jekono ekta hobe .. onno kichu dile error dibe
    date: {
        type: Date,
        default: Date.now,
    },
    // date jodi keo na dey .. taile default hishebe current date assign kore felbe
    user: {
        // er moddhe amra user er id ta rakhbo
        type: mongoose.Types.ObjectId,
        ref: "User", // kar reference e dicchi .. kon model er reference e dicchi.. amra User Model er reference e dicchi
        // reference amra bole dicchi jeno she connection stablish korte pare .. ki connection stablish korche .. sheta amra ektu
        // porei dekhbo ..
    },
}); // er moddhe amra ekta object dibo .. ei object er moddhei amader database er schema ta thakbe
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

// --------------------------------------------- Instance Method ----------------
todoSchema.methods = {
    //jehetu todoSchema ta hocche Schema Class er ekta instance .. tai amra chaile Schema Class er kichu method
    // add korte pari  .. mongoose.Schema Class  .. er moddhe ekta object amra pabo .. tar vitore ..
    // mane ei object er jei property gula amra dibo .. shei property gula hocche ek ekta custom instance method functions .
    findActive: function () {
        // jei todo gular Status Active .. shegula khujbo .. shegula return korbe ..
        // ultimately mongo er query korte gele mongoose er built in query gulai use kore customize kore nibo
        return mongoose.model("Todo").find({ status: "active" }); // status inactive kore dile ekta datao dekhabe na
    },
    findActiveCallback: function (cb) {
        // cb -> callback
        return mongoose.model("Todo").find({ status: "active" }, cb);
    },
};

// --------------------------------- ---------------------Static Method ----------------
todoSchema.statics = {
    findByJS: function () {
        return this.find({ title: /js/i }); // REGEX shikhte hobe .. must .. Regular Expression ..
        // 34:34 ekhan theke video start mongoose er
        // age pore jinish thakte pare .. majhkhane js thakbe
    },
};

// --------------------------------- ---------------------Query Helper ----------------
todoSchema.query = {
    byLanguage: function (language) {
        return this.find({ title: new RegExp(language, "i") }); // REGEX shikhte hobe .. must .. Regular Expression ..
    },
};

module.exports = todoSchema;
