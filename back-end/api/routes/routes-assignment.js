var express = require('express');
var router = express.Router();
const fs = require('fs');
const process = require('process'); 
const auth = require('../middleware/auth');

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
	course: { type: "object"},
    description: { type: "string"},
    category: { type: "string"},
    fulfilled_requirements: { type: "array"},
    assignment_document: {type: "object"},
    student_documents: { type: "array"},
};


/* GET assignment listing. */
router.get('/allAssignments', auth, async function(req, res, next) {
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
                    return res.status(100).json(resultObj);
                }
                
            }
        });     
    });    	
});

router.get('/getAssignmentsByCourse/:id', auth, async function(req, res, next) {
    const data = req.params.id;
    console.log(data);
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
        console.log("ID");
        console.log(data);
        let query = {"course._id": data}
        collection.find(query).toArray((err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                client.close();
                return res.status(400).json({ error: err});
            } 
            if (result) {
                let resultObj;
                if (result.length > 0) {
                    resultObj = {
                        status: "S",
                        statusMessage: "Successfully returned assignments",
                        assignments: result
                    }
                    client.close();
                    return res.status(200).json(resultObj);
                } else {
                    resultObj = {
                        status: "I",
                        statusMessage: "This course doesn't have any assignments. Please add an assignment.",
                        assignments: result
                    }
                    client.close();
                    return res.status(200).json(resultObj);
                }
                 
            } 
        });     
    });    	
});

/* adds a new assignment to the list */
router.post('/create', auth, async (req, res, next) => {
    
	let data = req.body;
    let docdata = [];
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
    let assignment = new AssignmentModel(data.title, data.course, data.description, data.category, data.fulfilled_requirements, data.assignment_document, data.student_documents);
    let rootDir = 'C:/MonmouthUniversity/thesis';
    
    for (let i = 0; i<data.student_documents.length; i++) {
        docdata.push(data.student_documents[i]);
    }
    docdata.push(data.assignment_document);

    for (let i = 0; i < docdata.length; i++) {
        let singleDoc = docdata[i];
        let assignmentDir = data.title;
        assignmentDir = assignmentDir.split(" ").join("");

        singleDoc.creation_date = (new Date()).toDateString();
        singleDoc.modified_date = singleDoc.creation_date;

        let saveDir = 'assignments/';

        singleDoc.filepath = saveDir + data.course.year + '/' + data.course.semester + '/' + data.course.department + data.course.course_number + data.course.section + '/' + assignmentDir + '/';

        const savedata = { fieldname: 'file',
            originalname: singleDoc.filename,
            encoding: 'base64',
            mimetype: singleDoc.type,
            buffer: singleDoc.file,
            size: singleDoc.filesize 
        };

        process.chdir(rootDir);
        createDirectoryAndSave(singleDoc, savedata);
        process.chdir(rootDir);
    }

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
router.post('/update', auth, async (req, res, next) =>
{   
    let rootDir = 'C:/MonmouthUniversity/thesis';
	const data = req.body;
    const assignmentId = req.body._id;
    let docdata = [];
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
    let assignment = new AssignmentModel(data.title, data.course, data.description, data.category, data.fulfilled_requirements, data.assignment_document, data.student_documents);
    if (data.student_documents) {
        for (let i = 0; i < data.student_documents.length; i++) {
            docdata.push(data.student_documents[i]);
        }
    }
    if (data.assignment_document) {
        docdata.push(data.assignment_document);
    }
    
    for (let i = 0; i < docdata.length; i++) {
        let singleDoc = docdata[i];
        let assignment = data.title;
        assignment = assignment.split(" ").join("");

        singleDoc.creation_date = (new Date()).toDateString();
        singleDoc.modified_date = singleDoc.creation_date;

        let saveDir = 'assignments/';

        singleDoc.filepath = saveDir + data.course.year + '/' + data.course.semester + '/' + data.course.department + data.course.course_number + data.course.section + '/' + assignment + '/';

        const savedata = { fieldname: 'file',
            originalname: singleDoc.filename,
            encoding: 'base64',
            mimetype: singleDoc.type,
            buffer: singleDoc.file,
            size: singleDoc.filesize 
        };

        process.chdir(rootDir);
        createDirectoryAndSave(singleDoc, savedata);
        process.chdir(rootDir);
    }
    

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
router.post('/remove', auth, async (req, res, next) =>
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

router.get('/getAssignment/:id', auth, async function(req, res, next) {
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
        const collection = db.collection('assignments')
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
                        statusMessage: "Successfully returned assignment",
                        assignments: result
                    }
                    client.close();
                    return res.status(200).json(resultObj);
                } else {
                    resultObj = {
                        status: "I",
                        statusMessage: "No User Returned",
                        assignments: result
                    }
                    client.close();
                    return res.status (100).json(resultObj);
                }
                
            }
        });     
    });    	
});

function createDirectoryAndSave(theData, theSD) {
    
    if (!fs.existsSync(theData.filepath)) {
        fs.mkdirSync(theData.filepath, { recursive: true }, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log("New directory successfully created.")
            }
        });
        console.log('creating directory');
        createDirectoryAndSave(theData, theSD);
    } else {
        console.log('directory exists');
        process.chdir(theData.filepath);
        fs.writeFile(theData.filename, theSD, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    }
} 

module.exports = router;