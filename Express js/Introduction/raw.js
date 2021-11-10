const http = require("http");

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.write("This is Home Page");
        res.end(); // response ta send hoye gelo
    } else if (req.url === "about" && req.method === "GET") {
        res.write("This is About Page");
        res.end(); // response ta send hoye gelo
    } else {
        res.write("This is not found");
        res.end(); // response ta send hoye gelo
    }
});
server.listen(313);
console.log("listening on http://localhost:313");

// etar besh kichu shomossha ase ....
// 1. manually server create korte hoy
// 2.
