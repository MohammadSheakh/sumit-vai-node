// amader shomosto routes gula ekhane thakbe .. trimmed part use kore amra route handling kori ..
// trimmed part ta jehetu analysis korte hobe .. trimmed part er moddhe thakbe .. / er pore jei part ase arki
// /about ba /portal .. jetai hok .. shei part ta analysis kore amader decesion nite hobe je amader ke kon
// handler function ta call korte hobe
// taile amra check korbo .. trim part ta jeta .. sheta amar routes object er moddhe ase kina ..
// jodi exist kore .. tahole corresponding handler ta call kore dibe .. otherwise ekta not found handler call korbe

// TODO:   dependencies-section
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { checkHandler } = require("./handlers/routeHandlers/checkHandler");

const routes = {
    // sample url e hit korle .. sampleHandler function ta call hobe
    sample: sampleHandler,
    user: userHandler,
    //check Discord Project part - 3
    token: tokenHandler, // project part - 4
    check: checkHandler,
};
// sample route e jokhon kono incoming request ashe .. tokhon sample handler function ta call hoy
module.exports = routes;
// routes nam e ekta object export kore dibo .. ei object ta amader shomosto route gula ke hold korbe ..
// sample nam e ekta route create korlam .. sample mane trimmed part ta arki ..  right side e rakhtesi kon
// function ke she call korbe ..
// mane .. sample url e hit korle .. kon function ke she call korbe .. shei function tar nam .. ei mapping ta ekhane
// rakhsi . je .. omuk route omuk function ke call korbe ..

// ei function gula ke rakhar jonno.. ami ekta handlers nam e ekta folder create korchi .. shekhane
// routes handlers shoho .. aro bivinno handlers rakhbo ..
