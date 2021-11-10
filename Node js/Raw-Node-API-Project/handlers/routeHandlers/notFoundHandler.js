// sampleHandler er motoi

// TODO:   dependencies-section
// TODO:  app object - module scaffolding (blank object) // eita te attach kore .. function gula export kora jay
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    console.log("not Found  is checked !");
    callback(404, {
        message: "Your Requested URL was not found !",
    });
};

module.exports = handler;
