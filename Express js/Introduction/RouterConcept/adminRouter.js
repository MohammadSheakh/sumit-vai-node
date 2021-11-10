const express = require("express");

const adminRouter = express.Router(); // express.Router() amake ekta router instance dibe .. notun ekta router object dibe

adminRouter.get("/", (req, res) => {
    res.send("Dashboard");
});

adminRouter.get("/login", (req, res) => {
    res.send("Login");
});

module.exports = adminRouter;
