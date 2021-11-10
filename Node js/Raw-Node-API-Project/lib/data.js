/* Title :
 * Description :
 * Author : Mohammad Bin Ab. Jalil Sheakh-----------------📞 0151-8419801, 01790-583345
 * Updated Date : 4-9-21 (Please update the error date also)
 * facebook id : https://www.facebook.com/chill.mohammad/ 🌐 Git Hub : https://github.com/MohammadSheakh
 * Mail : mohammad.sheakh@gmail.com
 */

// file system e data read kora o write korar kaj ta ami ei file e korbo ..
//dependencies
const fs = require("fs"); //file system
const path = require("path"); // kon path e file save korbo
// module scaffolding
const lib = {}; // finally eta export kore dibo arki

// amra ekhon kon directory te achi .. sheta jante hobe age .. __dirname // current
// base directory of the data folder
lib.basedir = path.join(__dirname, "/../.data/"); // path create korar jonno path.join function use kori
//             ek dhap pichone gia data folder. eta hocche amar base directory jekhane ami data save korbo

// write data to file
// ami ekta library function create korte chacchi .. jeta te ami kon folder e file rakhte chai ..
// file er name , data .. ei 3 ta jinish diye dile .. she amar data ta oi corresponding file e write kore dibe
// lib.basedir mane holo.. .data er vitor porjonto path .. erpor + dir mane aro kono folder create korte chay kina ..
// erpor / er pore + file mane kon json file create korte chay .. shei file er nam ..,  erpor dite hobe file ta kon mood / flag
// e open korte chai .. (wx) : existing file thakle error dey..  shob shomoy new new file open kore data write / save korbe
// finally ekta callback function lagbe ..
// Shob kichu thik thak hoye gele .. callback ta call  hobe

lib.create = function (dir, file, data, callback) {
    //file write korte hole .. age .. file  open korte hoy
    fs.open(
        `${lib.basedir + dir}/ ${file} .json`,
        "wx",
        (errr, fileDescriptor) => {
            //callback function er belay amra shob shomoy..error back pattern follow kori..shuru tei error thakbe..tarpor thake result
            // success er result ta arki .. successful hole fileDescriptor dey amader..
            if (!errr && fileDescriptor) {
                // error jodi na hoy .. and fileDescriptor ta thake .. tahole ami successful arki
                // successfull hole .. she successfully file ta open korte pereche .. we are ready to write
                // amra jei data gula pai .. shegula ke amader 'utf-8' encoding kore nite hoy ..
                // jei data ta ashse (parameter e data ashse) .. first e eta ke amra string e convert korbo .. karon object
                // hishebe data ta ashse .. karon data ta ke amra .json file e save korbo .. data ta ke amader json string e amader
                // ke convert kore nite hobe .. valid JavaScript object pathale kintu hobe na ..
                // object hishebe ashleo JSON file e JSON String hishebe dhukate hobe.. valid JavaScript Dhukale hobe na
                const stringData = JSON.stringify(data); // data ta ke String create kore nilam
                // write data to file and then close it
                fs.writeFile(fileDescriptor, stringData, (error) => {
                    // error back pattern er ekta callback function ..
                    // jodi error hoy tahole she error dibe
                    if (!error) {
                        // mane successfully data file e write korte pereche ..
                        fs.close(fileDescriptor, (err) => {
                            if (!err) {
                                callback(false); // false pathiye dilam .. karon error hobe na
                            } else {
                                // ar error hole .. error ta diye dicchi ekhane
                                callback(
                                    "There was a problem while closing the file ! 💥4-9❌58🚫❗1🛑📛",
                                    err
                                );
                            }
                        }); // reference dia file system ta close kore dilam ..
                        // er o ekta callback ase ..  shetao error back pattern
                    } else {
                        callback(
                            "Find Error to write to the new file 💥4-9❌65🚫❗2🛑📛",
                            error
                        );
                    }
                }); // file open korlam .. she amake successfully file open korte parle in return she
                // ekta object diye dilo fileDescriptor .. pass kore dile she reference korte parbe ..
                // 2nd parameter hishebe dite hobe .. kon data ami write korte chai ..
            } else {
                // otherwise error hobe
                callback(
                    "Could not create new file, it may already exists 💥4-9❌74🚫❗3🛑📛",
                    errr
                ); // callback function er maddhomei ekta error diye dibo arki
            }
        }
    );
};

// ekhon amra data read niye kaj korbo ..  🚦🔴No problem ... New Segment🔵🔰    read data form file
lib.read = (dir, file, callback) => {
    // kon directory er kon file theke data read korte chai .. sheta bole dite hobe ...
    // last e status (read kora hoise ki hoy nai ..) eta check korar jonnoi callback .. jeta kaj hoye gele call hoy
    fs.readFile(`${lib.basedir + dir}/ ${file} .json`, "utf8", (err, data) => {
        // finally error back pattern er callback function .. jeta janabe amader data read kora gese ki jay nai..
        // kon file theke read korbo , kon encoding e read korbo ..
        // ager bar e fileDescriptor peyechilam .. ebar jehetu read korchi .. she amake data ta dibe ..
        // ebar to reference proyojon nai .. ejonno sheta dibe na .. karon oi ta niye ami kichu korbo na ..
        callback(err, data);
    });
};

// update existing file  🚦🔴No problem ... New Segment🔵🔰    update data form file
lib.update = (dir, file, data, callback) => {
    // file update korte chaile .. amader ke data read o korte hobe .. abar write o korte hobe ..
    // file open for writing
    fs.open(
        `${lib.basedir + dir}/ ${file} .json`,
        "r+",
        (err, FileDescriptor) => {
            // flag r+ : Open file for reading and writing. An exception occurs if the file does not exist.
            // she amader ekta reference dibe .. sheta ke ami pore refer kore kaj korte parbo \
            if (!err && FileDescriptor) {
                // jodi amar error na hoy ar fileDescriptor ta jodi pai .. tahole ami .. successful
                // error na hole convert the data to string
                const stringData = JSON.stringify(data); // data ta ke String create kore nilam
                // ekhon file jehetu update korte chai .. taile age file er previous data delete korte hobe ..
                // tarpor new data insert korte hobe
                fs.ftruncate(FileDescriptor, (err) => {
                    // reference ta use kore ftruncate call korle file khali hobe
                    // she successfully ftruncate korte parle amader ke ekta callback dibe
                    // successfully khali korte parle error dibe na .. ar jodi khali korte na pare taile error dibe..
                    if (!err) {
                        // tar mane ami successful
                        // write to the file and close it ..
                        fs.writeFile(FileDescriptor, stringData, (err) => {
                            if (!err) {
                                // tar mane file e write kora gese .. ekhon ami file close korbo
                                fs.close(FileDescriptor, (err) => {
                                    if (!err) {
                                        // error na hole amra false return kori
                                        callback(false);
                                    } else {
                                        callback(
                                            "Error happend on closing time"
                                        );
                                    }
                                });
                            } else {
                                callback("Error writing to file");
                            }
                        });
                    } else {
                        callback("Error Truncating File !");
                    }
                });
            } else {
                // amra ekta error dibo
                console.log("Error Updating Data ! File May not exist", err);
            }
        }
    );
};

// Delete Existing File
lib.delete = (dir, file, callback) => {
    // unlink file
    fs.unlink(`${lib.basedir + dir}/ ${file} .json`, (err) => {
        if (!err) {
            callback(false); // sucessfully delete korte pereche
        } else {
            callback("Error in Deleting File");
        }
    });
};

// list all the items in a directory // folder er shob file name paowar jonno ei system
lib.list = (dir, callback) => {
    fs.readdir(`${lib.basedir + dir}/`, (err, fileNames) => {
        if (!err && fileNames && fileNames.length > 0) {
            // karon minimum ekta file petei hobe amake
            let trimmedFileNames = []; // karon amader file Name ta hoilei hobe .. tar shathe .json ta lagbe na
            // amader file name gulai chilo checkID
            fileNames.forEach((fileName) => {
                trimmedFileNames.push(fileName.replace(".json", "")); // .json jeta pabo .. sheta ke amra blank diye
                // replace kore dibo ..
            });
            callback(false, trimmedFileNames); // kono error nai .. ejonno false
        } else {
            callback("Error Reading directory");
        }
    });
};

module.exports = lib;
