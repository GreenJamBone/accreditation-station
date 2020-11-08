var express = require('express');
var router = express.Router();
const fs = require('fs');
const process = require('process'); 

const constants = require('../constants');
const AssignmentModel = require("../models/model.assignment");
const mongodb = require('mongodb');
const mongo = require('mongodb').MongoClient;

ObjectId = mongodb.ObjectID, 
require('dotenv/config');

let Validator = require('fastest-validator');
let assignmentValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let namePattern = /([A-Za-z\-\’])*/;

/* assignment validator shema */
const assignmentVSchema = {
	title: { type: "string", min: 1, max: 100},
	department: { type: "string", min: 1, max: 5 },
	course_number: { type: "string", max: 5 },
    section: { type: "string", min: 1, max: 3 },
    semester: { type: "string", min: 1, max: 3},
    year: { type: "string", min: 1, max: 5},
    description: { type: "string"},
    category: { type: "string"},
    fulfilled_requirements: { type: "array"},
    assignment_document: {type: "string"},
    student_documents: { type: "array"},
};


/* GET assignment listing. */
router.get('/allAssignments', async function(req, res, next) {
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
        const collection = db.collection('assignments')
        
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
                        statusMessage: "Successfully returned all assignments",
                        assignments: result
                    }
                    client.close();
                    return res.status(200).json(resultObj);
                } else {
                    resultObj = {
                        status: "I",
                        statusMessage: "No assignments Returned",
                        assignments: result
                    }
                    client.close();
                    return res.status (100).json(resultObj);
                }
                
            }
        });     
    });    	
});

/* adds a new assignment to the list */
router.post('/create', async (req, res, next) => {
    
	let data = req.body;
    data.filepath = 'assignments/' + data.year + '/' + data.semester + '/' + data.department + data.course_number + data.section + '/' + data.assignment + '/';
    var vres = assignmentValidator.validate(data, assignmentVSchema);
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
    let assignment = new AssignmentModel(data.title, data.department, data.course_number, data.section, data.semester, data.year, data.description, data.category, data.fulfilled_requirements, data.assignment_document, data.student_documents);
    
    const savedata = { fieldname: 'file',
        originalname: data.filename,
        encoding: 'base64',
        mimetype: data.type,
        buffer: data.file,
        size: data.filesize 
    };

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
        const collection = db.collection('assignments')
        
        collection.insertOne(assignment, (err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                client.close();
                return res.status(400).json({ error: err});
            } else {
                let resultObj = {
                    status: "S",
                    statusMessage: "Successfully added assignment to database.",
                    insertedCount: result.insertedCount,
                    insertedId: result.insertedId,
                    assignmentInfo: assignment
                }
                client.close();
                return res.status(200).json(resultObj);
            }
        });     
    });    	
});

/* updates the assignment by uid */
router.post('/update', async (req, res, next) =>
{
	const data = req.body;
    const assignmentId = req.body._id;
    var vres = assignmentValidator.validate(data, assignmentVSchema);
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
    let assignment = new AssignmentModel(data.title, data.department, data.course, data.course_number, data.section, data.semester, data.year, data.description, data.category, data.fulfilled_requirements, data.assignment_document, data.student_documents);

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
        const collection = db.collection('assignments');

        let id = ObjectId(assignmentId);
        const query = {_id:id};
        const data = {
            $set: assignment
        };
        collection.updateOne(query, data, {upsert: true}, (err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                return res.status(400).json({ error: err, status: "E"});
            } else {
                let resultObj = {
                    status: "S",
                    statusMessage: "Successfully updated assignment",
                    matchedCount: result.matchedCount,
                    modifiedCount: result.modifiedCount,
                    assignmentInfo: assignment
                }
                return res.status(200).json(resultObj);
            }
        });     
    });    
});
    
/* removes the assignment from the assignment list by uid */
router.post('/remove', async (req, res, next) =>
{
    const data = req.body;
    const assignmentId = req.body._id;
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
        const collection = db.collection('assignments');
        
        let id = ObjectId(assignmentId);
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
                    statusMessage: "Successfully removed assignment",
                    deletedCOunt: result.matchedCount,
                    assignmentInfo: assignmentId
                }
                return res.status(200).json(resultObj);
            }
        });     
    });    

});   

module.exports = router;