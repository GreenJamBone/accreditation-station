var express = require('express');
var router = express.Router();

const constants = require('../constants');
const UserModel = require("../models/model.user");
const mongodb = require('mongodb');
const mongo = require('mongodb').MongoClient;

ObjectId = mongodb.ObjectID, 
require('dotenv/config');

let Validator = require('fastest-validator');
let userValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let namePattern = /([A-Za-z\-\’])*/;

/* user validator shema */
const userVSchema = {
	first_name: { type: "string", min: 1, max: 50, pattern: namePattern },
	last_name: { type: "string", min: 1, max: 50, pattern: namePattern },
	email: { type: "email", max: 75 },
	title: { type: "string", min: 1, max: 50 },
	roles: { type: "array", min: 1, max: 50 } 
};

/* GET user listing. */
router.get('/allUsers', async function(req, res, next) {
	mongo.connect(constants.constants.db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }, (err, client) => {
        if (err) {
        console.error(err);
        client.close();
        return
        }
        const db = client.db('accreditation-station');
        const collection = db.collection('users')
        
        collection.find().toArray((err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                client.close();
                return res.status(400).json({ error: err});
            } else {
                console.log(result);
                let resultObj;
                if (result.length > 0) {
                    resultObj = {
                        status: "S",
                        statusMessage: "Successfully returned all users",
                        users: result
                    }
                    client.close();
                    return res.status(200).json(resultObj);
                } else {
                    resultObj = {
                        status: "I",
                        statusMessage: "No Users Returned",
                        users: result
                    }
                    client.close();
                    return res.status (100).json(resultObj);
                }
                
            }
        });     
    });    	
});

router.get('/getUser/:id', async function(req, res, next) {
    const data = ObjectId(req.params.id);
	mongo.connect(constants.constants.db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }, (err, client) => {
        if (err) {
        console.error(err);
        client.close();
        return
        }
        const db = client.db('accreditation-station');
        const collection = db.collection('users')
        console.log("ID");
        console.log(data);
        collection.find({_id:data}).toArray((err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                client.close();
                return res.status(400).json({ error: err});
            } else {
                
                let resultObj;
                if (result.length > 0) {
                    resultObj = {
                        status: "S",
                        statusMessage: "Successfully returned user",
                        users: result
                    }
                    client.close();
                    return res.status(200).json(resultObj);
                } else {
                    resultObj = {
                        status: "I",
                        statusMessage: "No User Returned",
                        users: result
                    }
                    client.close();
                    return res.status (100).json(resultObj);
                }
                
            }
        });     
    });    	
});


/* adds a new user to the list */
router.post('/create', async (req, res, next) => {
	const data = req.body;

    var vres = userValidator.validate(data, userVSchema);
    /* validation failed */
    if(!(vres === true))
    {
        let errors = {}, item;
        for(const index in vres)
        {
            item = vres[index];
            errors[item.field] = item.message;
        }
        
        throw {
            name: "ValidationError",
            message: errors
        };
    }
    let user = new UserModel(data.first_name, data.last_name, data.email, data.title, data.roles);

    mongo.connect(constants.constants.db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }, (err, client) => {
        if (err) {
        console.error(err)
        client.close();
        return
        }
        const db = client.db('accreditation-station');
        const collection = db.collection('users')
        
        collection.insertOne(user, (err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                client.close();
                return res.status(400).json({ error: err});
            } else {
                let resultObj = {
                    status: "S",
                    statusMessage: "Successfully added user to database.",
                    insertedCount: result.insertedCount,
                    insertedId: result.insertedId,
                    userInfo: user
                }
                client.close();
                return res.status(200).json(resultObj);
            }
        });     
    });    	
});
    
/* updates the user by uid */
router.post('/update', async (req, res, next) =>
{
	const data = req.body;
    const userId = req.body._id;
    var vres = userValidator.validate(data, userVSchema);
    /* validation failed */
    if(!(vres === true))
    {
        let errors = {}, item;
        for(const index in vres)
        {
            item = vres[index];
            errors[item.field] = item.message;
        }
        
        throw {
            name: "ValidationError",
            message: errors
        };
    }
    let user = new UserModel(data.first_name, data.last_name, data.email, data.title, data.roles);

    mongo.connect(constants.constants.db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }, (err, client) => {
        if (err) {
            client.close();
        console.error(err)
        return
        }
        const db = client.db('accreditation-station');
        const collection = db.collection('users');

        let id = ObjectId(userId);
        const query = {_id:id};
        const data = {
            $set: user
        };
        collection.updateOne(query, data, {upsert: true}, (err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                return res.status(400).json({ error: err, status: "E"});
            } else {
                let resultObj = {
                    status: "S",
                    statusMessage: "Successfully updated user",
                    matchedCount: result.matchedCount,
                    modifiedCount: result.modifiedCount,
                    userInfo: user
                }
                return res.status(200).json(resultObj);
            }
        });     
    });    
});

/* removes the user from the user list by uid */
router.post('/remove', async (req, res, next) =>
{
    const data = req.body;
    const userId = req.body._id;
   console.log(req.body);
    mongo.connect(constants.constants.db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }, (err, client) => {
        if (err) {
            client.close();
        console.error(err)
        return
        }
        const db = client.db('accreditation-station');
        const collection = db.collection('users');
        
        let id = ObjectId(userId);
        const query = {"_id":id};
        console.log(id);
        console.log(query);
        collection.deleteOne(query, (err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                return res.status(400).json({ error: err, status: "E"});
            } else {
                let resultObj = {
                    status: "S",
                    statusMessage: "Successfully removed user",
                    deletedCOunt: result.matchedCount,
                    userInfo: userId
                }
                return res.status(200).json(resultObj);
            }
        });     
    });    

});

module.exports = router;