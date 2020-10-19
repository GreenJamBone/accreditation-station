var express = require('express');
var router = express.Router();

const constants = require('../constants');
const CourseModel = require("../models/model.course");
const mongodb = require('mongodb');
const mongo = require('mongodb').MongoClient;

ObjectId = mongodb.ObjectID, 
require('dotenv/config');

let Validator = require('fastest-validator');
let courseValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let namePattern = /([A-Za-z\-\’])*/;

/* course validator shema */
const courseVSchema = {
	name: { type: "string", min: 1, max: 100, pattern: namePattern },
	department: { type: "string", min: 1, max: 5 },
	course_number: { type: "string", max: 5 },
    section: { type: "string", min: 1, max: 3 },
    semester: { type: "string", min: 1, max: 3},
    year: { type: "string", min: 1, max: 5},
    filepath: { type: "string"},
    type: { type: "string"},
    creation_date: { type: "string" },
    modified_date: { type: "string" },
    rating: { type: "string" }
};

/* GET course listing. */
router.get('/allDocuments', async function(req, res, next) {
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
        const collection = db.collection('documents')
        
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
                        statusMessage: "Successfully returned all documents",
                        documents: result
                    }
                    client.close();
                    return res.status(200).json(resultObj);
                } else {
                    resultObj = {
                        status: "I",
                        statusMessage: "No documents Returned",
                        documents: result
                    }
                    client.close();
                    return res.status (100).json(resultObj);
                }
                
            }
        });     
    });    	
});

/* adds a new course to the list */
router.post('/create', async (req, res, next) => {
	const data = req.body;

    var vres = courseValidator.validate(data, courseVSchema);
    /* validation failed */
    if(!(vres === true))
    {
        let errors = {}, item;
        for(const index in vres)
        {
            item = vres[index];
            errors[item.field] = item.message;
        }
        console.log(errors);
        throw {
            name: "ValidationError",
            message: errors
        };
    }
    let course = new CourseModel(data.name, data.department, data.course_number, data.section, data.semester, data.year, data.description, data.instructor, data.preceded_by, data.succeeded_by, data.audit_requirements);
    
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
        const collection = db.collection('documents')
        
        collection.insertOne(course, (err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                client.close();
                return res.status(400).json({ error: err});
            } else {
                let resultObj = {
                    status: "S",
                    statusMessage: "Successfully added course to database.",
                    insertedCount: result.insertedCount,
                    insertedId: result.insertedId,
                    courseInfo: course
                }
                client.close();
                return res.status(200).json(resultObj);
            }
        });     
    });    	
});
    
/* updates the course by uid */
router.post('/update', async (req, res, next) =>
{
	const data = req.body;
    const courseId = req.body._id;
    var vres = courseValidator.validate(data, courseVSchema);
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
    let course = new CourseModel(data.name, data.department, data.course_number, data.section, data.semester, data.year, data.description, data.instructor, data.preceded_by, data.succeeded_by, data.audit_requirements);

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
        const collection = db.collection('documents');

        let id = ObjectId(courseId);
        const query = {_id:id};
        const data = {
            $set: course
        };
        collection.updateOne(query, data, {upsert: true}, (err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                return res.status(400).json({ error: err, status: "E"});
            } else {
                let resultObj = {
                    status: "S",
                    statusMessage: "Successfully updated course",
                    matchedCount: result.matchedCount,
                    modifiedCount: result.modifiedCount,
                    courseInfo: course
                }
                return res.status(200).json(resultObj);
            }
        });     
    });    
});

/* removes the course from the course list by uid */
router.post('/remove', async (req, res, next) =>
{
    const data = req.body;
    const courseId = req.body._id;
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
        const collection = db.collection('documents');
        
        let id = ObjectId(courseId);
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
                    statusMessage: "Successfully removed course",
                    deletedCOunt: result.matchedCount,
                    courseInfo: courseId
                }
                return res.status(200).json(resultObj);
            }
        });     
    });    

});

module.exports = router;