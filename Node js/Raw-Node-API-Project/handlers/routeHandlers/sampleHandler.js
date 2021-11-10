// TODO:   dependencies-section
// TODO:  app object - module scaffolding (blank object) // eita te attach kore .. function gula export kora jay
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    console.log("Sample is checked !");
    callback(200, {
        message: "This is Sample handler !",
    });
};

module.exports = handler;
