const jwt = require("jsonwebtoken");
const checkLogin = (req, res, next) => {
    // ei middleware ta jei jei route er age thakbe .. shei route gula te access korte chaile obosshoi
    // user ke logged in thakte hobe .. mane auth token valid hote hobe .. auth token ashbe request er header e

    // route gula ke protect korte hobe
    const { authorization } = req.headers; // headers er moddhe token pathabe
    try {
        const token = authorization.split(" ")[1]; // karon Bearer er pore token thake ... 1 no. index e

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // jei authorization token ta .. shetar moddhe
        // data ase .. sheta age decode kore ber kore niye ashte hobe .. environment variable theke JWT_SECRET
        // code pathiye token ta verify kore data ta decoded variable er moddhe niye dilam
        const { username, userId } = decoded; // decoded er vitor theke token er data ber kore nilam
        req.username = username; // data gula request er moddhe assign kore dilam .. pore kaje lagte pare ..
        req.userId = userId;

        //  if (!token) throw new ExpressError(400, "Token not found");
        // jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        //     if (error) throw new ExpressError(400, "Invalid Token");
        //     req.credentials = decoded;
        // });

        next(); // next middleware er kase send kore dilam...
    } catch (err) {
        // console.log("😀 checkLogin.js > checkLogin > catch >>", err);
        next("Authentication failure !"); // ekta error send kore dilam
        // eta express er error handler er kase chole jabe .. amra nijera ekta custom error handler banale
        // sheta diye amra eta ke dhorte parbo ..
    }
};

module.exports = checkLogin;

/*
{
    
    "username":"mohammad",
    "password":"509812**"
}

 */
