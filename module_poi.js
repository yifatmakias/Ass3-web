var DButilsAzure = require('./DButils');

function getRandom(array) {
    var index = Math.floor(Math.random() * array.length);
    if (array.length === 0) {
        return;
    }
    return array.splice(index, 1)[0];
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

async function isPOISaved(user_name, poi_id) {
    try {
        const poi = await DButilsAzure.execQuery("SELECT * FROM users_favorites_poi WHERE user_name = '" + user_name +  "' AND poi_id = " + poi_id)
        if (Object.keys(poi).length > 0) {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        console.log(error)
    }
}

async function saveFavoriteList(user_name, poi_list) {
    try {
        await DButilsAzure.execQuery("DELETE FROM users_favorites_poi WHERE user_name = '" + user_name +  "'")
        for (var i=0; i < Object.keys(poi_list).length; i++) {
            addSavedPOI(user_name, poi_list[i])
        }
        return("insert successfully");
    } catch (error) {
        console.log(error)
    }
}

module.exports.getRandomPOI = getRandomPOI;
module.exports.getRecomendedPOI = getRecomendedPOI;
module.exports.addSavedPOI = addSavedPOI;
module.exports.deleteSavedPOI = deleteSavedPOI;
module.exports.getSavedPOI = getSavedPOI;
module.exports.getPOIByCategory = getPOIByCategory;
module.exports.getPOIByName = getPOIByName;
module.exports.addPOIReview = addPOIReview;
module.exports.getPOIDetails = getPOIDetails;
module.exports.getSavedListSize = getSavedListSize;
module.exports.isPOISaved = isPOISaved;
module.exports.saveFavoriteList = saveFavoriteList;

