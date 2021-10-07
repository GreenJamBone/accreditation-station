var express = require('express');
var router = express.Router();

const constants = require('../constants');
const RequirementModel = require("../models/model.requirement");
const mongodb = require('mongodb');
const mongo = require('mongodb').MongoClient;

ObjectId = mongodb.ObjectID, 
require('dotenv/config');

let Validator = require('fastest-validator');
let requirementValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let namePattern = /([A-Za-z\-\’])*/;

/* user validator shema */
const requirementVSchema = {
	name: { type: "string", min: 1, max: 50, pattern: namePattern },
	type: { type: "string", min: 1, max: 50, pattern: namePattern },
	description: { type: "string", max: 300 }
};

/* GET requirement listing. */
router.get('/allRequirements', async function(req, res, next) {
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
        const collection = db.collection('audit_reqs')
        
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
                        statusMessage: "Successfully returned all requirements",
                        requirements: result
                    }
                    client.close();
                    return res.status(200).json(resultObj);
                } else {
                    resultObj = {
                        status: "I",
                        statusMessage: "No Requirements Returned",
                        requirements: result
                    }
                    client.close();
                    return res.status (100).json(resultObj);
                }
                
            }
        });     
    });    	
});

/* adds a new requirement to the list */
router.post('/create', async (req, res, next) => {
	const data = req.body;

    var vres = requirementValidator.validate(data, requirementVSchema);
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
    let requirement = new RequirementModel(data.name, data.type, data.description);

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
        const collection = db.collection('audit_reqs')
        
        collection.insertOne(requirement, (err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                client.close();
                return res.status(400).json({ error: err});
            } else {
                let resultObj = {
                    status: "S",
                    statusMessage: "Successfully added requirement to database.",
                    insertedCount: result.insertedCount,
                    insertedId: result.insertedId,
                    requirementInfo: requirement
                }
                client.close();
                return res.status(200).json(resultObj);
            }
        });     
    });    	
});

/* retrieves a user by uid -- NOT CURRENTLY USED*/
// router.get('get/:id', async (req, res, next) =>
// {
// 	try
// 	{
// 		const user = await UserService.retrieve(req.params.id);

// 		return res.json({ user: user });
// 	}
// 	catch(err)
// 	{
// 		// unexpected error
// 		return next(err);
// 	}
// });

/* updates the user by uid */
router.post('/update', async (req, res, next) =>
{
	const data = req.body;
    const requirementId = req.body._id;
    var vres = requirementValidator.validate(data, requirementVSchema);
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
    let requirement = new RequirementModel(data.first_name, data.last_name, data.email, data.title, data.roles);

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
        const collection = db.collection('audit_reqs');

        let id = ObjectId(requirementId);
        const query = {_id:id};
        const data = {
            $set: requirement
        };
        collection.updateOne(query, data, {upsert: true}, (err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                return res.status(400).json({ error: err, status: "E"});
            } else {
                let resultObj = {
                    status: "S",
                    statusMessage: "Successfully updated requirement",
                    matchedCount: result.matchedCount,
                    modifiedCount: result.modifiedCount,
                    requirementInfo: requirement
                }
                return res.status(200).json(resultObj);
            }
        });     
    });    
});

/* removes the requirement from the requirement list by uid */
router.post('/remove', async (req, res, next) =>
{
    const data = req.body;
    const requirementId = req.body._id;
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
        const collection = db.collection('audit_reqs');
        
        let id = ObjectId(requirementId);
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
                    statusMessage: "Successfully removed requirement",
                    deletedCOunt: result.matchedCount,
                    requirementInfo: requirementId
                }
                return res.status(200).json(resultObj);
            }
        });     
    });    

});

module.exports = router;