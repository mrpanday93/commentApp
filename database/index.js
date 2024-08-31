var mysql= require('mysql');

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comment_app"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

module.exports =  {connection: connection};