const express = require("express");
const app = express();
const session = require("express-session");
const tools = require("./tools.js");

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
    
    let result = await tools.checkUsername(username);
    let hashedPwd = "";
    console.dir(result); //displays the values of the object
    
    if (result.length > 0) {
        hashedPwd = result[0].password;
    }
    
    let passwordMatch = await tools.checkPassword(password, hashedPwd);
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
app.get("/myAccount", tools.isAuthenticated, function(req, res) {
    res.render("account.ejs");
})

//logout route
app.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/");
});

//listener
app.listen("8080", "127.0.0.1", function(){
   console.log("Running express server..."); 
});