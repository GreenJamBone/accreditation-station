var express = require('express');
var router = express.Router();
const fs = require('fs');
const process = require('process'); 

const constants = require('../constants');
const DocumentModel = require("../models/model.document");
const mongodb = require('mongodb');
const mongo = require('mongodb').MongoClient;

ObjectId = mongodb.ObjectID, 
require('dotenv/config');

let Validator = require('fastest-validator');
let documentValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let namePattern = /([A-Za-z\-\’])*/;

/* document validator shema */
const documentVSchema = {
	name: { type: "string", min: 1, max: 100, pattern: namePattern },
	department: { type: "string", min: 1, max: 5 },
	course_number: { type: "string", max: 5 },
    section: { type: "string", min: 1, max: 3 },
    semester: { type: "string", min: 1, max: 3},
    year: { type: "string", min: 1, max: 5},
    type: { type: "string"},
    creation_date: { type: "string" },
    modified_date: { type: "string" },
    rating: { type: "string" },
    filepath: { type: "string"},
    filename: { type: "string" }
};

/* GET document listing. */
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

/* adds a new document to the list */
router.post('/create', async (req, res, next) => {
    
	let data = req.body;
    data.creation_date = (new Date()).toDateString();
    data.modified_date = data.creation_date;
    data.filepath = 'documents/' + data.year + '/' + data.semester + '/' + data.department + data.course_number + data.section + '/' + data.assignment + '/';
    var vres = documentValidator.validate(data, documentVSchema);
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
    let document = new DocumentModel(data.name, data.department, data.course_number, data.section, data.semester, data.year, data.type, data.rating, data.creation_date, data.modified_date, data.filepath, data.filename);
    
    const savedata = { fieldname: 'file',
        originalname: data.filename,
        encoding: 'base64',
        mimetype: data.type,
        buffer: data.file,
        size: data.filesize 
    };

    process.chdir('C:/MonmouthUniversity/thesis');
    createDirectoryAndSave(data, savedata);
    process.chdir('C:/MonmouthUniversity/thesis');

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
        
        collection.insertOne(document, (err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                client.close();
                return res.status(400).json({ error: err});
            } else {
                let resultObj = {
                    status: "S",
                    statusMessage: "Successfully added document to database.",
                    insertedCount: result.insertedCount,
                    insertedId: result.insertedId,
                    documentInfo: document
                }
                client.close();
                return res.status(200).json(resultObj);
            }
        });     
    });    	
});
    
/* removes the document from the document list by uid */
router.post('/remove', async (req, res, next) =>
{
    const data = req.body;
    const documentId = req.body._id;
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
        
        let id = ObjectId(documentId);
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
                    statusMessage: "Successfully removed document",
                    deletedCOunt: result.matchedCount,
                    documentInfo: documentId
                }
                return res.status(200).json(resultObj);
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