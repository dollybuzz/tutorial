const mysql = require("mysql");
const bcrypt = require("bcrypt");

//line 37 requires module.exports.- to call the function, not tools.-

module.exports = { 

//MySQL database connection 
createDBConnection: function() {
    var conn = mysql.createConnection({
        host: "cst336db.space", //not localhost since this is Professor's server
        user: "cst336_dbUser007",
        password: "qbqxba",
        database: "cst336_db007"
    });
    return conn;
},

//middleware function for session authentication to apply to all password-protected pages
isAuthenticated: function(req, res, next) {
    if(!req.session.authenticated) {
        res.redirect("/");
    } else {
        next();
    }
},

/*
Checks whether the username exists in the database.
If found, returns corresponding record.
@param {string} username
@return {array of objects}
*/
checkUsername: function(username) {
    let sql = "SELECT * FROM users WHERE username = ?";
    return new Promise( function(resolve, reject){
        let conn = module.exports.createDBConnection();
        conn.connect(function(err){
            if (err) throw err;
            conn.query(sql, [username], function(err, rows, fields) {
                if (err) throw err;
                console.log("Rows found: " + rows.length);
                resolve(rows);
            });//query
        });//connect
    });//promise
},

/*
Checks the bcrypt value of the password submitted
@param {string} password
@return {boolean} true if password sub mitted is equal to bcrypt-hashed value, false otherwise.
*/
checkPassword: function(password, hashedValue) {
    return new Promise( function(resolve, reject) {
        bcrypt.compare(password, hashedValue, function(err, result) {
            console.log("Result: " + result);
            resolve(result);
        });
    });
}
    
}