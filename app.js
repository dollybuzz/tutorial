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
app.post("/", function(req, res){
    let username = req.body.username;
    let password = req.body.passwordl
    res.send("This is the root route using POST!");
});

//listener
app.listen("8080", "127.0.0.1", function(){
   console.log("Running express server..."); 
});