const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

app.set("view engine", "ejs");

//setting parameters to use sessions
app.use(session({
secret: "top secret!",
resave: true,
saveUninitialized: true
}));

//allows Express to parse the parameters sent in the form using POST
app.use(express.urlencoded({extended: true}));

//routes
//root route
app.get("/", function(req, res){
   // res.send("Login form will go here!");
   res.render("index.ejs");
});

//POST root route
app.post("/", async function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    //console.log("Username:" + username);
    //console.log("password:" + password);
    //res.send("This is the root route using POST!");
    
    let result = await checkUsername(username);
    let hashedPwd = "";
    console.dir(result); //displays the values of the object
    
    if (result.length > 0) {
        hashedPwd = result[0].password;
    }
    
    let passwordMatch = await checkPassword(password, hashedPwd);
    console.log("passwordMatch: " + passwordMatch);
    
    if(result  && passwordMatch) {  //(user/password) values stored in db are "admin/secret" and "test/testing"
        req.session.authenticated = true;
        res.render("welcome.ejs");
    } else {
        res.render("index.ejs", {"loginError":true});
        //passing loginError from route to view index.ejs
    }
});

//previous session authentication method before adding middleware function
/*app.get("/myAccount", function(req, res){
    if(req.session.authenticated) {
        res.render("account.ejs"); 
    } else {
        res.redirect("/");
    }
});*/

//password-protected myAccount route
app.get("/myAccount", isAuthenticated, function(req, res) {
    res.render("account.ejs");
})

//logout route
app.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/");
});

//MySQL database connection 
function createDBConnection() {
    var conn = mysql.createConnection({
        host: "cst336db.space", //not localhost since this is Professor's server
        user: "cst336_dbUser007",
        password: "qbqxba",
        database: "cst336_db007"
    });
    return conn;
}

//middleware function for session authentication to apply to all password-protected pages
function isAuthenticated(req, res, next) {
    if(!req.session.authenticated) {
        res.redirect("/");
    } else {
        next();
    }
}

/*
Checks whether the username exists in the database.
If found, returns corresponding record.
@param {string} username
@return {array of objects}
*/
function checkUsername(username) {
    let sql = "SELECT * FROM users WHERE username = ?";
    return new Promise( function(resolve, reject){
        let conn = createDBConnection();
        conn.connect(function(err){
            if (err) throw err;
            conn.query(sql, [username], function(err, rows, fields) {
                if (err) throw err;
                console.log("Rows found: " + rows.length);
                resolve(rows);
            });//query
        });//connect
    });//promise
}

/*
Checks the bcrypt value of the password submitted
@param {string} password
@return {boolean} true if password sub mitted is equal to bcrypt-hashed value, false otherwise.
*/
function checkPassword(password, hashedValue) {
    return new Promise( function(resolve, reject) {
        bcrypt.compare(password, hashedValue, function(err, result) {
            console.log("Result: " + result);
            resolve(result);
        });
    });
}

//listener
app.listen("8080", "127.0.0.1", function(){
   console.log("Running express server..."); 
});