var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');

var port = 3000;
var user = new Object();
user = {"user_name": 'moran', "password": '12345', "first_name": 'moran', "last_name": 'shimshila', "city": 'beer sheva', "country": 'israel', "email": 'moran@gmail.com', "question": 'what is your dog name', "answer": 'panda'} ;

async function getUser(user_name) {
    try {console.log("SELECT * FROM users WHERE user_name = '" +user_name +"'");
        const u = await DButilsAzure.execQuery("SELECT * FROM users WHERE user_name = '" +user_name +"'")
        return u;
    } catch (error) {
        console.log(error)
    }
}

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

app.get('/select', function(req, res){
    DButilsAzure.execQuery("SELECT * FROM users")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/select/:user_name", (req, res) => {
    getUser(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})


app.post('/insert/user', function(req, res){
    DButilsAzure.execQuery("INSERT INTO [dbo].[users] VALUES ('" + user.user_name +  "', '" + user.password +  "', '" + user.first_name +  "', '" + user.last_name +  "', '" + user.city +  "', '" + user.country +  "', '" + user.email +  "', '" + user.question +  "', '" + user.answer +  "')")
    .then(function(result){
        res.status(201).send("insert successfully")
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})