var express = require('express');
var router = express.Router();
var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');
var parse = require('csv-parse').parse;
var mysql= require('mysql');
var connection = require("../database/index").connection;

/* GET home page. */
router.get('/', function(request, response, next) {

    /* Code to fetch data from URL starts */
    let p1 = new Promise ((resolve, reject) => {
        let finalData = "";
        https.get("https://jsonplaceholder.typicode.com/comments",(req, res) => {
            req.on('data', (data) => {
                finalData += data;
            });
    
            req.on('end', async () => {
                finalData = JSON.parse(finalData);

                let result = await insertData(finalData);

                if (!result.status || result.status !== "success") {
                    reject(result);
                } else {
                    resolve("success");
                }
            });
    
            req.on('error', (err) => {
                reject(err);
            })
        });
    }); 
     /* Code to fetch data from URL ends */

     /* Code to fetch data from csv starts */
    let p2 = new Promise ((resolve, reject) => {
        let writer = fs.createWriteStream('csvdata.csv');

        http.get("http://cfte.mbwebportal.com/deepak/csvdata.csv",(req, res) => {
            req.on('data', (data) => {
                writer.write(data);
            });
    
            req.on('end', () => {
                let finalData = [];
                let headers = [];
                fs.createReadStream("csvdata.csv")
                    .pipe(parse({ delimiter: ",", from_line: 1 }))
                    .on("data", async function (row) {
                        if (headers.length == 0) {
                            headers = row;
                        } else {
                            let data = [{
                                name: "",
                                email: "",
                                body: ""
                            }];

                            for (let i = 0; i < headers.length; i++) {
                                if (headers[i] == "name") {
                                     data[0].name = row[i];
                                }
                                if (headers[i] == "email") {
                                    data[0].email = row[i];
                                }
                                if (headers[i] == "body") {
                                    data[0].body = row[i];
                                }
                            }

                            let result = await insertData(data);

                            if (!result.status || result.status !== "success") {
                                reject(result);
                            }
                        }
                    })
                    .on("end", () =>{
                        fs.unlink("csvdata.csv");
                        resolve("Success");
                    })
                    .on("error", function (err) {
                        console.error("Error:", err); 
                        reject(err);
                    });
            });
    
            req.on('error', (err) => {
                reject(err);
            });
        });
    }); 
     /* Code to fetch data from csv ends */

      /* Code to fetch data from big csv starts */
    let p3 = new Promise ((resolve, reject) => {
        let writer = fs.createWriteStream('csvdata.csv');

        http.get("http://cfte.mbwebportal.com/deepak/bigcsvdata.csv",(req, res) => {
            req.on('data', (data) => {
                writer.write(data);
            });
    
            req.on('end', () => {
                let finalData = [];
                let headers = [];
                fs.createReadStream("bigcsvdata.csv")
                    .pipe(parse({ delimiter: ",", from_line: 1 }))
                    .on("data", async function (row) {
                        if (headers.length == 0) {
                            headers = row;
                        } else {
                            let data = [{
                                name: "",
                                email: "",
                                body: ""
                            }];

                            for (let i = 0; i < headers.length; i++) {
                                if (headers[i] == "name") {
                                     data[0].name = row[i];
                                }
                                if (headers[i] == "email") {
                                    data[0].email = row[i];
                                }
                                if (headers[i] == "body") {
                                    data[0].body = row[i];
                                }
                            }

                            let result = await insertData(data);

                            if (!result.status || result.status !== "success") {
                                reject(result);
                            }
                        }
                    })
                    .on("end", () =>{
                        fs.unlink("bigcsvdata.csv");
                        resolve("Success");
                    })
                    .on("error", function (err) {
                        console.error("Error:", err); 
                        reject(err);
                    });
            });
    
            req.on('error', (err) => {
                reject(err);
            });
        });
    }); 
    /* Code to fetch data from big csv end */

    /* calling all promises parallaly */
    Promise.allSettled([p1, p2, p3]).then((result) => {
        response.send(result);
    }).catch((err) => {
        response.send(err);
    });
});

async function insertData(data) {
    for (let d of data) {
        connection.query(`INSERT INTO comments (name, email, body) VALUES ('${d.name}', '${d.email}', '${d.body}')`, function(err, result, fields) {
            if (err) {
                return err;
            }
        });
    }

    return { status: "success" };
}



module.exports = router;
