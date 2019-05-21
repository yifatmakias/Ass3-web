var DButilsAzure = require('./DButils');

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