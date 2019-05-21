var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var DButilsAzure = require('./DButils');

app.use(bodyParser.json());

var port = 3000;

function getRandom(array) {
    var index = Math.floor(Math.random() * array.length);
    if (array.length === 0) {
        return;
    }
    return array.splice(index, 1)[0];
}

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

async function getUser(user_name) {
    try {
        const user = await DButilsAzure.execQuery("SELECT * FROM users WHERE user_name = '" +user_name +"'")
        return user;
    } catch (error) {
        console.log(error)
    }
}

async function isUserExist(user_name) {
    try {
        const user = await DButilsAzure.execQuery("SELECT * FROM users WHERE user_name = '" +user_name +"'")
        if (Object.keys(user).length == 0) {
            return false;
        }
        else {
            return true;
        }
    } catch (error) {
        console.log(error)
    }
}

async function addUser(user) {
    try {
        await DButilsAzure.execQuery("INSERT INTO users VALUES ('" + user.user_name +  "', '" + user.password +  "', '" + user.first_name +  "', '" + user.last_name +  "', '" + user.city +  "', '" + user.country +  "', '" + user.email +  "', '" + user.question +  "', '" + user.answer +  "')")
        for (var i=0; i<Object.keys(user.category_interest).length; i++) {
            await DButilsAzure.execQuery("INSERT INTO users_category_interest VALUES ('" + user.user_name + "' ," + "'" + user.category_interest[i] + "')")
        }
        return("insert successfully");
    } catch (error) {
        console.log(error)
    }
}

async function deleteUser(user_name) {
    try {
        await DButilsAzure.execQuery("DELETE FROM users WHERE user_name = '" + user_name +  "'")
        await DButilsAzure.execQuery("DELETE FROM users_category_interest WHERE user_name = '" + user_name +  "'")
        return("deleted successfully")
    } catch (error) {
        console.log(error)
    }
}

async function restorePassword(user_name, question, answer) {
    try {
        const user = await DButilsAzure.execQuery("SELECT * FROM users WHERE user_name = '" + user_name +  "' AND question= '" + question + "' AND answer = '" + answer + "'")
        if (Object.keys(user).length == 1) {
            return (user[0].password);
        }
    } catch (error) {
        console.log(error)
    }
}

async function getRandomPOI(min_rank) {
    try {
        const poi_list = await DButilsAzure.execQuery("SELECT * FROM points_of_interest WHERE poi_rank > '" + min_rank +  "'")
        if (Object.keys(poi_list).length <= 3) {
            return (poi_list);
        }
        else {
            var poi_random = [];
            poi_random.push(getRandom(poi_list));
            poi_random.push(getRandom(poi_list));
            poi_random.push(getRandom(poi_list));
            return(poi_random);
        }
    } catch (error) {
        console.log(error)
    }
}

async function getRecomendedPOI(user_name) {
    try {
        const category_interest_list = await DButilsAzure.execQuery("SELECT TOP 2 category_interest FROM users_category_interest WHERE user_name = '" + user_name +  "'")
        if (Object.keys(category_interest_list).length < 2) {
            return;
        }
        else {
            var rec_poi_list = [];
            console.log("SELECT * FROM points_of_interest WHERE poi_category = '" + category_interest_list[0].category_interest +  "' AND poi_rank > 2")
            const poi_res1 = await DButilsAzure.execQuery("SELECT * FROM points_of_interest WHERE poi_category = '" + category_interest_list[0].category_interest +  "' AND poi_rank > 2")
            const poi_res2 = await DButilsAzure.execQuery("SELECT * FROM points_of_interest WHERE poi_category = '" + category_interest_list[1].category_interest +  "' AND poi_rank > 2")
            if (Object.keys(poi_res1).length > 0) {
                rec_poi_list.push(poi_res1[0]);
            }
            if (Object.keys(poi_res2).length > 0) {
                rec_poi_list.push(poi_res2[0]);
            }
            return(rec_poi_list);
        }
    } catch (error) {
        console.log(error)
    }
}

async function addSavedPOI(user_name, poi_id) {
    try {
        await DButilsAzure.execQuery("INSERT INTO users_favorites_poi VALUES ('" + user_name +  "', '" + poi_id +  "')")
        return("insert successfully")
    } catch (error) {
        console.log(error)
    }
}

async function deleteSavedPOI(user_name, poi_id) {
    try {
        console.log("DELETE FROM users_favorites_poi WHERE user_name = '" + user_name +  "' AND poi_id = '" + poi_id + "'")
        await DButilsAzure.execQuery("DELETE FROM users_favorites_poi WHERE user_name = '" + user_name +  "' AND poi_id = '" + poi_id + "'")
        return("deleted successfully")
    } catch (error) {
        console.log(error)
    }
}

async function getSavedPOI(user_name) {
    try {
        const poi_id_list = await DButilsAzure.execQuery("SELECT poi_id FROM users_favorites_poi WHERE user_name = '" + user_name +  "'")
        var poi_list = [];
        for (var i=0; i < Object.keys(poi_id_list).length; i++) {
            const poi = await DButilsAzure.execQuery("SELECT * FROM points_of_interest WHERE poi_id = " + poi_id_list[i].poi_id);
            if (Object.keys(poi).length > 0) {
                poi_list.push(poi[0])
            }
        }
        return poi_list;
    } catch (error) {
        console.log(error)
    }
}

async function getPOIByCategory(category) {
    try {
        const poi_list = await DButilsAzure.execQuery("SELECT * FROM points_of_interest WHERE poi_category = '" + category +  "'")
        return poi_list;
    } catch (error) {
        console.log(error)
    }
}

async function getPOIByName(name) {
    try {
        const poi_list = await DButilsAzure.execQuery("SELECT * FROM points_of_interest WHERE poi_name = '" + name +  "'")
        return poi_list;
    } catch (error) {
        console.log(error)
    }
}

async function addPOIReview(review) {
    try {
        await DButilsAzure.execQuery("INSERT INTO reviews (user_name, poi_id, review_rank, review_description) VALUES ('" + review.user_name +  "', " + review.poi_id +  ", " + review.rank +  ", '" + review.description +  "')")
        await DButilsAzure.execQuery("UPDATE points_of_interest SET num_of_reviews = num_of_reviews + 1 WHERE poi_id = " + review.poi_id)
        return("insert successfully");
    } catch (error) {
        console.log(error)
    }
}

async function getPOIDetails(poi_id) {
    try {
        var result_list = []
        const poi_list = await DButilsAzure.execQuery("SELECT * FROM points_of_interest WHERE poi_id = " + poi_id)
        result_list.push(poi_list)
        const reviews_list = await DButilsAzure.execQuery("SELECT TOP 2 * FROM reviews WHERE poi_id = " + poi_id + "ORDER BY review_date DESC")
        result_list.push(reviews_list)
        await DButilsAzure.execQuery("UPDATE points_of_interest SET num_of_viewers = num_of_viewers + 1 WHERE poi_id = " + poi_id)
        return result_list
    } catch (error) {
        console.log(error)
    }
}

async function getSavedListSize(user_name) {
    try {
        const poi_list_size = await DButilsAzure.execQuery("SELECT count(*) AS list_size FROM users_favorites_poi WHERE user_name = '" + user_name +  "'")
        return poi_list_size;
    } catch (error) {
        console.log(error)
    }
}

async function login(user_name, password) {
    try {
        const u = await DButilsAzure.execQuery("SELECT * FROM users WHERE user_name = '" +user_name +"' AND password = '" + password + "'")
        return u;
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
    getUser(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/isUserExist/:user_name", (req, res) => {
    isUserExist(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getRandomPOI/:min_rank", (req, res) => {
    getRandomPOI(req.params.min_rank)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getRecomendedPOI/:user_name", (req, res) => {
    getRecomendedPOI(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getSavedPOI/:user_name", (req, res) => {
    getSavedPOI(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getPOIByCategory/:category", (req, res) => {
    getPOIByCategory(req.params.category)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getPOIByName/:name", (req, res) => {
    getPOIByName(req.params.name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getPOIDetails/:poi_id", (req, res) => {
    getPOIDetails(req.params.poi_id)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.get("/getSavedListSize/:user_name", (req, res) => {
    getSavedListSize(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/insert/user', function(req, res){
    addUser(req.body)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/restorePassword', function(req, res){
    restorePassword(req.body.user_name, req.body.question, req.body.answer)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/insertSavedPOI', function(req, res){
    addSavedPOI(req.body.user_name, req.body.poi_id)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.post('/insertPOIReview', function(req, res){
    addPOIReview(req.body)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.delete('/delete/:user_name', function(req, res){
    deleteUser(req.params.user_name)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

app.delete('/deleteSavedPOI/:user_name/:poi_id', function(req, res){
    deleteSavedPOI(req.params.user_name, req.params.poi_id)
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})
