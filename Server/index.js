const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3001
var database = require('./database.js');

const path=require('path');


const paths=[
    "/home_page.html","/about_page.html","/recipes_page.html","/dessert.html","/login_page.html","/lunch.html","/morning.html",
    ,"/recipes2.html","/recipes3.html","/recipes4.html","/recipes5.html","/recipes6.html","/recipes7.html",
    ,"/recipes2.html","/recipes3.html","/recipes4.html","/recipes5.html","/recipes6.html","/recipes7.html",
    "/search_page.html","/sign_page.html","/error.html"];

//TODO:check this
var user="";
let errMessage="";
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

app.get('/recipes1.html', (req, res) => {
    const image = req.query.image;
    let reqPath = path.join(__dirname, '../')
    reqPath = path.join(reqPath,"Front");
    reqPath=path.join(reqPath,"/recipes1.html");
    console.log('../photos/'+image);
    res.sendFile(reqPath,{ image:"../photos/"+image});
});

paths.forEach(function (current) {
    app.get(current, (req, res)=>{
        let reqPath = path.join(__dirname, '../')
        reqPath = path.join(reqPath,"Front");
        if(current==="/recipes_page.html"||current==="/search_page.html")
        {
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

function validate(username,email,password,passwordConfirm) {
    let regularExpressionPass = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    let regularExpressionEmail = /\S+@\S+\.\S+/;
    let regularExpressionName=/^[a-zA-Z0-9_\.]+$/;
    let isPasswordMatch = password === passwordConfirm;
    let isEmailValid = regularExpressionEmail.test(email);
    let isPasswordValid = regularExpressionPass.test(password);
    let isUsernameValid = regularExpressionName.test(username);
    if (!isEmailValid) {
        return "The email address you entered is invalid. Please enter a valid email address and try again.";
    } else if (!isPasswordValid) {
        return "The password you entered does not meet our security requirements. Please choose a Stronger password";
    } else if (!isUsernameValid) {
        return "The username you entered is invalid. Please choose a different username that contains only alphanumeric characters, underscores, and periods and try again.";
    } else if (!isPasswordMatch) {
        return "Passwords does not match. Please enter the same password in both fields.";
    } else {
        return "success";
    }
}

//Route that handles login logic
app.post('/login', async (req, res) => {
    let userNotExist=0;
    userNotExist= await database.checkUserInDataBase(req.body.username,req.body.password);
    if(userNotExist===1)
    {
        errMessage="User Name/Password wrong!";
        res.redirect("back");
    }
    else{
        console.log("------> User exists")
        user = req.body.username;
        res.redirect("/");
    }
})

//Route that handles signup logic
app.post('/signup', async (req, res) => {
    let UserDuplicate = 0;
    let validPromise=new Promise((resolve, reject) => {
        let result=validate(req.body.username,req.body.email,req.body.password,req.body.passwordConfirm);
        if(result=="success")
        {
            resolve(true);
        }
        else{
            errMessage=result;
            resolve(false);
        }
    });
    let resultOfValidation = await validPromise;
    if (resultOfValidation==true)
    {
        UserDuplicate = await database.insertUserToDataBase(req.body.username, req.body.email, req.body.password);
        console.log(UserDuplicate);
        if (UserDuplicate === 1) {
            errMessage= "User Name already exist!";
            res.redirect("back");
        } else {
            console.log("--------> Created new User")
            res.redirect("/");
        }
    }
    else{
        res.redirect("back");
    }
})

app.get('/Error',(req,res)=>{
    res.json({error:errMessage});
})


//Start your server on a specified port
app.listen(port, ()=>{
    console.log(`Server is runing on port ${port}`);
})

