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

app.use("/private", (req, res,next) => {
	const token = req.header("x-auth-token");
	// no token
	if (!token) res.status(401).send("Access denied. No token provided.");
	// verify token
	try {
		const decoded = jwt.verify(token, secret);
		req.decoded = decoded;
		next(); //move on to the actual function
	} catch (exception) {
		res.status(400).send("Invalid token.");
	}
});

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
    module_poi.getRandomPOI(req.params.min_rank)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/private/getRecomendedPOI", (req, res) => {
    module_poi.getRecomendedPOI(req.decoded.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/private/getSavedPOI", (req, res) => {
    module_poi.getSavedPOI(req.decoded.user_name)
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

app.get("/private/getSavedListSize", (req, res) => {
    module_poi.getSavedListSize(req.decoded.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/private/isPOISaved/:poi_id", (req, res) => {
    module_poi.isPOISaved(req.decoded.user_name, req.params.poi_id)
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

app.post('/private/insertSavedPOI', function(req, res){
    module_poi.addSavedPOI(req.decoded.user_name, req.body.poi_id)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/private/insertPOIReview', function(req, res){
    module_poi.addPOIReview(req.body)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/private/saveFavoriteList', function(req, res){
    module_poi.saveFavoriteList(req.decoded.user_name, req.body.poi_list)
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
            var payload = {user_name: req.body.user_name};
            const token = jwt.sign(payload, secret, options);
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

app.delete('/private/deleteSavedPOI/:poi_id', function(req, res){
    module_poi.deleteSavedPOI(req.decoded.user_name, req.params.poi_id)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})


