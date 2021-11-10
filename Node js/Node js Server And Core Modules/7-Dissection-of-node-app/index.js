/*
 * Title        : Basic Node app example
 * Description  : Simple node application that print random quotes per second interval.
 * Author       : Mohammad Bin Ab. Jalil Sheakh
 * Date         : ---21
 * facebook id  : https://www.facebook.com/chill.mohammad/
 * Git Hub      : https://github.com/MohammadSheakh
 * Mail         : mohammad.sheakh@gmail.com
 * Phone Number : 01790-583345, 0151-8419801
 */

// Dependencies                                                          // shob import ekhane likhte hoy ..
// -------------------------------- kon kon module ami baire theke niye ashsi .. shegula ekhane likhte hoy ..
const mathLibrary = require("./lib/math");
const quotesLibrary = require("./lib/quotes");

// App object - Module scaffolding / Structure / kathamo (কাঠামো)
const app = {};

// Configuration                     // jei jinish gula next e change hote pare ..shei jinish gula ekhane rakhte hoy
app.config = {
    timeBetweenQuotes: 1000,
};
//..                                               // ekhane kichu function er declaration ase ..
// Function that prints a random quote
app.printAQuote = function printAQuote() {
    // Get all the quotes
    const allQuotes = quotesLibrary.allQuotes();

    // Get the length of the quotes
    const numberOfQuotes = allQuotes.length;

    // Pick a random number between 1 and the number of quotes
    const randomNumber = mathLibrary.getRandomNumber(1, numberOfQuotes);

    // Get the quote at that position in the array (minus one)
    const selectedQuote = allQuotes[randomNumber - 1];

    // Print the quote to the console
    console.log(selectedQuote);
};

// Function that loops indefinitely, calling the printAQuote function as it goes
app.indefiniteLoop = function indefiniteLoop() {
    // Create the interval, using the config variable defined above
    setInterval(app.printAQuote, app.config.timeBetweenQuotes);
};

//                                                      // Function er invocation
// Invoke the loop
app.indefiniteLoop();
