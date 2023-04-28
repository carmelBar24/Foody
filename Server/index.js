const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3001
var database = require('./database.js');

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


//Route that handles login logic
app.post('/login', async (req, res) => {
    let userNotExist=0;
    userNotExist= await database.checkUserInDataBase(req.body.username,req.body.password);
    if(userNotExist===1)
    {
        logErr="User Name/Password wrong!";
        console.log("not good");
        res.redirect("back");
        //res.redirect('back');
    }
    else{
        console.log("------> User exists")
        let reqPath = path.join(__dirname, '../')
        reqPath = path.join(reqPath, "Front/home_page.html")
        user = req.body.username;
        res.sendFile(reqPath);
    }
})

//Route that handles signup logic
app.post('/signup', async (req, res) =>{
    let UserDuplicate = 0;
    UserDuplicate = await database.insertUserToDataBase(req.body.username,req.body.email, req.body['user_mail'], req.body.password);
    console.log(UserDuplicate);
    if (UserDuplicate === 1) {
      /*  message = "User Name already exist!";*/
        console.log("error");
        res.redirect("back");
        } else {
        console.log ("--------> Created new User")
        res.sendStatus(201)
        let reqPath = path.join(__dirname, '../')
        reqPath=path.join(reqPath,"Front/login_page.html")
        res.sendFile(reqPath);
        }
})

app.get('/loginError',(req,res)=>{
    console.log("hello");
    res.json({error:logErr});
})


//Start your server on a specified port
app.listen(port, ()=>{
    console.log(`Server is runing on port ${port}`);
})

