var express = require('express');
var router = express.Router();
const fs = require('fs');
const process = require('process'); 

const constants = require('../constants');
const DocumentModel = require("../models/model.document");
const mongodb = require('mongodb');
const mongo = require('mongodb').MongoClient;

const auth = require('../middleware/auth');

ObjectId = mongodb.ObjectID, 
require('dotenv/config');

let Validator = require('fastest-validator');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
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
    filename: { type: "string" }
};

/* GET document listing. */
router.get('/allDocuments', auth, async function(req, res, next) {
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

router.get('/getDocument/:id', auth, async function(req, res, next) {
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
        const collection = db.collection('documents')
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
                        statusMessage: "Successfully returned document",
                        documents: result
                    }
                    client.close();
                    return res.status(200).json(resultObj);
                } else {
                    resultObj = {
                        status: "I",
                        statusMessage: "No document Returned",
                        documents: result
                    }
                    client.close();
                    return res.status (100).json(resultObj);
                }
                
            }
        });     
    });    	
});

router.post('/getMultipleDocs/', auth, async function(req, res, next) {
    let theReq = req.body;
    let theDocs = theReq.theDocs;
    let docsArray = [];
    for (let d = 0; d < theDocs.length; d++) {
        docsArray.push(ObjectId(theDocs[d]));
    }
    console.log(docsArray);
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

        collection.find({_id: {$in: docsArray}}).toArray((err, result) => {
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
                        statusMessage: "Successfully returned document",
                        documents: result
                    }
                    client.close();
                    return res.status(200).json(resultObj);
                } else {
                    resultObj = {
                        status: "I",
                        statusMessage: "No document Returned",
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
router.post('/create', auth, async (req, res, next) => {
    let rootDir = 'C:/MonmouthUniversity/thesis';
    let payload = [];
    let theReq = req.body;
    let data = theReq.documents;
       
    for (let i = 0; i < data.length; i++) {
        let singleDoc = data[i];
        
        singleDoc.creation_date = (new Date()).toDateString();
        singleDoc.modified_date = singleDoc.creation_date;

        // let saveDir = 'self-study/';
        
        // singleDoc.filepath = saveDir + singleDoc.year + '/';

        let document = new DocumentModel(singleDoc.name, singleDoc.type, singleDoc.creation_date, singleDoc.modified_date, singleDoc.filename, singleDoc.year, singleDoc.department, singleDoc.program, singleDoc.chapter_section, singleDoc.file, singleDoc.filesize);
 
        payload.push(document);
        console.log(payload);
        // const savedata = { fieldname: 'file',
        //     originalname: singleDoc.filename,
        //     encoding: 'base64',
        //     mimetype: singleDoc.type,
        //     buffer: singleDoc.file,
        //     size: singleDoc.filesize 
        // };

        // process.chdir(rootDir);
        // createDirectoryAndSave(singleDoc, savedata);
        // process.chdir(rootDir);
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
        const collection = db.collection('documents')
        
        collection.insertMany(payload, (err, result) => {
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
                    documentInfo: payload
                }
                client.close();
                return res.status(200).json(resultObj);
            }
        });     
    });    	
});

/* udpates a new document to the list */
router.post('/update', auth, async (req, res, next) => {
    let rootDir = 'C:/MonmouthUniversity/thesis';

    let data = req.body;
    const documentId = data._id;

    data.modified_date = (new Date()).toDateString();

    // let saveDir = 'self-study/';

    let document = new DocumentModel(data.name, data.type, data.creation_date, data.modified_date, data.filename, data.year, data.department, data.program, data.chapter_section, data.file, data.filesize);


    // const savedata = { fieldname: 'file',
    //     originalname: data.filename,
    //     encoding: 'base64',
    //     mimetype: data.type,
    //     buffer: data.file,
    //     size: data.filesize 
    // };

    // process.chdir(rootDir);
    // createDirectoryAndSave(data, savedata);
    // process.chdir(rootDir);
    
    
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

        let id = ObjectId(documentId);
        const query = {_id:id};
        const data = {
            $set: document
        };
        collection.updateOne(query, data, {upsert: true}, (err, result) => {
            if (err) {
                console.log("ERROR");
                console.log(err);
                client.close();
                return res.status(400).json({ error: err});
            } else {
                let resultObj = {
                    status: "S",
                    statusMessage: "Successfully updated document.",
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
router.post('/remove', auth, async (req, res, next) =>
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