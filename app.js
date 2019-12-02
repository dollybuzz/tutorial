const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

app.set("view egine", "ejs");

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

//root post route
app.post("/", async function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    //console.log("Username:" + username);
    //console.log("password:" + password);
    //res.send("This is the root route using POST!");
    let hashedPwd = "$2a$10$06ofFgXJ9wysAOzQh0D0..RcDp1w/urY3qhO6VuUJL2c6tzAJPfj6";
    
    let passwordMatch = await checkPassword(password, hashedPwd);
    console.log("passwordMatch: " + passwordMatch);
    
    if(username == "admin" && password == "secret") {
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

//middleware function for session authentication to apply to all password-protected pages
function isAuthenticated(req, res, next) {
    if(!req.session.authenticated) {
        res.redirect("/");
    } else {
        next();
    }
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