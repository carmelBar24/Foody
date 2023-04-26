const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3001

//TODO:move to other file
let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '4364',
    database: 'foodblog'
});

const path=require('path');

const paths=[
    "/home_page.html","/about_page.html","/recipes_page.html","/dessert.html","/login_page.html","/lunch.html","/morning.html",
    "/recipes1.html","/recipes2.html","/recipes3.html","/recipes4.html","/recipes5.html","/recipes6.html","/recipes7.html",
    "/search_page.html","/sign_page.html","/error.html"];

//TODO:check this
var user="";
var logErr="";
const bcrypt = require('bcrypt');


app.use( bodyParser.json() );       // to support JSON-encoded bodies

//TODO:check mobile
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true}));
app.use(cors())
app.use("/css",  express.static(__dirname + '/public/css'));
app.use("/js",  express.static(__dirname + '/public/js'));
app.use("/photos",  express.static(__dirname + '/public/photos'));
app.use("/css",  express.static(__dirname + '/public/mobile'));

//home_page
app.get('/', (req, res)=>{
    let reqPath = path.join(__dirname, '../')
    reqPath=path.join(reqPath,"Front/home_page.html")
    res.sendFile(reqPath);
});

paths.forEach(function (current) {
    app.get(current, (req, res)=>{
        let reqPath = path.join(__dirname, '../')
        reqPath = path.join(reqPath,"Front");
        if(current==="/recipes_page.html"||current==="/search_page.html")
        {
            //TODO:change to email
            if(user==="")
            {
                reqPath=path.join(reqPath,"/error.html");
                res.sendFile(reqPath);
            }
            else{
                reqPath=path.join(reqPath,current);
                res.sendFile(reqPath);
            }
        }
        else{
            reqPath=path.join(reqPath,current);
            res.sendFile(reqPath);
        }
    });
})

//TODO:check routs

//Route that handles login logic
app.post('/login', (req, res) =>{
    connection.connect(function(err) {
        if (err) {
            return console.error('error: ' + err.message);
        }
        console.log('Connected to the MySQL server.');
    });
    const userName=req.body.username;
    const password=req.body.password;
    const sqlSearch = "SELECT * FROM users WHERE userName = ? and password = ?"
    const search_query = connection.format(sqlSearch,[userName,password]);
    connection.query (search_query, async (err, result) => {
        if (err) throw err
        else {
            console.log("------> Search Results")
            console.log(result.length)
            if (result.length != 0) {
                console.log("------> User exists")
                let reqPath = path.join(__dirname, '../')
                reqPath = path.join(reqPath, "Front/home_page.html")
                user = userName;
                res.sendFile(reqPath);
            }
            else {
                logErr="Wrong password/user! try again";
                res.redirect("back");
            }
        }
    });
    connection.end(function(err) {
        if (err) {
            return console.log('error:' + err.message);
        }
        console.log('Close the database connection.');
    })
})

//Route that handles signup logic
app.post('/signup', (req, res) =>{
    connection.connect(function(err) {
        if (err) {
            return console.error('error: ' + err.message);
        }
        console.log('Connected to the MySQL server.');
    });
    const userName=req.body.username;
    const fullName=req.body.fullname;
    const password=req.body.password;
    const email=req.body.email;
    const sqlInsert = "INSERT INTO users VALUES (?,?,?,?)";
    const insert_query = connection.format(sqlInsert,[password,userName,fullName,email]);
    connection.query (insert_query, (err, result)=> {
        if (err) throw (err)
        console.log ("--------> Created new User")
        res.sendStatus(201)
    });
    let reqPath = path.join(__dirname, '../')
    reqPath=path.join(reqPath,"Front/login_page.html")
    res.sendFile(reqPath);

    connection.end(function(err) {
        if (err) {
            return console.log('error:' + err.message);
        }
        console.log('Close the database connection.');
    });
})

//Route that return userName to display
app.get('/test',(req,res)=>{
    res.json({name:user});
})
app.get('/loginError',(req,res)=>{
    console.log("hello");
    res.json({error:logErr});
})


//Start your server on a specified port
app.listen(port, ()=>{
    console.log(`Server is runing on port ${port}`);
})

