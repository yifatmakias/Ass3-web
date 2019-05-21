var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var DButilsAzure = require('./DButils');
var jwt = require("jsonwebtoken");
var module_user = require('./module_user');
var module_poi = require('./module_poi');

app.use(bodyParser.json());

var port = 3000;
secret = "yifatandmoran";
options = {expiresIn: "1d"};

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

async function validateToken(req, token) {
    try {
        // no token
        if (!token) return "no token";
        // verify token
        try {
            const decoded = jwt.verify(token, secret);
            req.decoded = decoded;
            return "token ok"
        } catch (exception) {
            console.log(exception);
            return "invalid token"
        }
    } catch (error) {
        console.log(error)
    }
}

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
    module_user.getUser(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/isUserExist/:user_name", (req, res) => {
    module_user.isUserExist(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getRandomPOI/:min_rank", (req, res) => {
    const token = req.header("X-auth-token")
    validateToken(req, token)
    .then(function(result){
        if (result === "token ok") {
            module_poi.getRandomPOI(req.params.min_rank)
            .then(function(result){
                res.send(result)
            })
            .catch(function(err){
                console.log(err)
                res.send(err)
            })
        }
        else if (result === "no token") {
            res.status(401).send("No token provided");
        }
        else {
            res.status(400).send("Invalid token");
        }
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getRecomendedPOI/:user_name", (req, res) => {
    module_poi.getRecomendedPOI(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getSavedPOI/:user_name", (req, res) => {
    module_poi.getSavedPOI(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getPOIByCategory/:category", (req, res) => {
    module_poi.getPOIByCategory(req.params.category)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getPOIByName/:name", (req, res) => {
    module_poi.getPOIByName(req.params.name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getPOIDetails/:poi_id", (req, res) => {
    module_poi.getPOIDetails(req.params.poi_id)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getSavedListSize/:user_name", (req, res) => {
    module_poi.getSavedListSize(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/isPOISaved/:user_name/:poi_id", (req, res) => {
    module_poi.isPOISaved(req.params.user_name, req.params.poi_id)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/insert/user', function(req, res){
    module_user.addUser(req.body)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/restorePassword', function(req, res){
    module_user.restorePassword(req.body.user_name, req.body.question, req.body.answer)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/insertSavedPOI', function(req, res){
    module_poi.addSavedPOI(req.body.user_name, req.body.poi_id)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/insertPOIReview', function(req, res){
    module_poi.addPOIReview(req.body)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/saveFavoriteList', function(req, res){
    module_poi.saveFavoriteList(req.body.user_name, req.body.poi_list)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/login', function(req, res){
    module_user.login(req.body.user_name, req.body.password)
    .then(function(result){
        if (result == true) {
            const token = jwt.sign(req.body, secret, options);
            res.send(token);
        }
        else {
            res.send("No such user");
        }
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.delete('/delete/:user_name', function(req, res){
    module_user.deleteUser(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.delete('/deleteSavedPOI/:user_name/:poi_id', function(req, res){
    module_poi.deleteSavedPOI(req.params.user_name, req.params.poi_id)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})
