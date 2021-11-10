const outside = (req, res) => {
    // req and res accept kore .. ei function ta
    console.log("1⭕", req.body);
    console.log("1️⃣", req.app.locals.title);

    res.send("This is from outside GET Request..");
};

module.exports = outside;
