var DButilsAzure = require('./DButils');
var fs = require("fs");
var parseString = require("xml2js").parseString;
var jsonContries;
var category_interest = ["shopping", "resturant", "sport", "museum"];


async function parseCountries() {
    fs.readFile("countries.xml", "utf-8", function(err, data) {
        if (err) console.log(err);
        // we log out the readFile results
        //console.log(data);
        // we then pass the data to our method here
        parseString(data, function(err, result) {
          if (err) console.log(err);
          // here we log the results of our xml string conversion
          jsonContries = result;
        });
      });
}

async function getCountries() {
    parseCountries();
    return jsonContries;
}

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
        var isvalidCountry = false;
        var isvalidCategory = false;
        let checker = (arr, target) => target.every(v => arr.includes(v));

        for (var i=0; i < Object.keys(jsonContries.Countries.Country).length; i++) {
            if (user.country === jsonContries.Countries.Country[i].Name[0]) {
                isvalidCountry = true;
            }
        }
        if (Object.keys(user.category_interest).length >= 2) {
            if (checker(category_interest, user.category_interest) === true) {
                isvalidCategory = true;
            }       
        }
        if (isvalidCountry === true && isvalidCategory === true) {
            await DButilsAzure.execQuery("INSERT INTO users VALUES ('" + user.user_name +  "', '" + user.password +  "', '" + user.first_name +  "', '" + user.last_name +  "', '" + user.city +  "', '" + user.country +  "', '" + user.email +  "', '" + user.question1 +  "', '" + user.answer1 + "', '" + user.question2 +  "', '" + user.answer2 + "')")
            for (var i=0; i<Object.keys(user.category_interest).length; i++) {
                await DButilsAzure.execQuery("INSERT INTO users_category_interest VALUES ('" + user.user_name + "' ," + "'" + user.category_interest[i] + "')")
            }
            return("insert successfully");
        }
        else if (isvalidCategory === true){
            return("country not valid");
        }
        else if (isvalidCountry === true) {
            return("categories not valid");
        }
        else {
            return("country and categories not valid");
        }
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
        const user = await DButilsAzure.execQuery("SELECT * FROM users WHERE user_name = '" + user_name +  "' AND ((question1= '" + question + "' AND answer1 = '" + answer + "') OR (question2= '" + question + "' AND answer2 = '" + answer + "'))")
        if (Object.keys(user).length == 1) {
            return (user[0].password);
        }
    } catch (error) {
        console.log(error)
    }
}


async function login(user_name, password) {
    try {
        const user = await DButilsAzure.execQuery("SELECT * FROM users WHERE user_name = '" +user_name +"' AND password = '" + password + "'")
        if (Object.keys(user).length > 0) {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports.getUser = getUser;
module.exports.isUserExist = isUserExist;
module.exports.addUser = addUser;
module.exports.deleteUser = deleteUser;
module.exports.restorePassword = restorePassword;
module.exports.login = login;
module.exports.parseCountries = parseCountries;
module.exports.getCountries = getCountries;