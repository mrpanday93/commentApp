var express = require('express');
var router = express.Router();

const connection = require("../database/index").connection;

/* GET home page. */
router.post('/', function(req, res, next) {
    let query = `SELECT * FROM comments`;

    let where = '';

    let limit = '';

    if (req.body.name || req.body.email || req.body.body) {
        where += ' WHERE ';
        
        if (req.body.name) {
            where += ` name LIKE '%${req.body.name}%' `;
        }

        if (req.body.email) {
            where += ` email LIKE '%${req.body.email}%' `;
        }

        if (req.body.body) {
            where += ` body LIKE '%${req.body.body}%' `;
        }
    }

    if (req.body.limit) {
        limit = ` LIMIT ${req.body.limit}`;
        
        if (req.body.page) {
            let offset = req.body.limit * (req.body.page - 1);
    
            limit += ` offset ${offset}`;
        }
    }


    connection.query(query+where+limit, (err, result)=> {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })

});

module.exports = router;
