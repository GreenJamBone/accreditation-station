const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

const constants = require('../constants');
const UserModel = require("../models/model.user");
const { User, validate } = require('../models/model.user-reg');
const mongodb = require('mongodb');
const mongo = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

ObjectId = mongodb.ObjectID, 
require('dotenv/config');

router.post('/', auth, async (req, res) => {

    // Check if this user already exisits
    // const theID = ObjectId(req.params.id);
    const theID = ObjectId(req.body.id);
    mongoose.connect(constants.constants.db_url + '/' + constants.constants.db_name);
    try {
        let user = await User.findOne({ _id: theID });
        if (user) {          
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            
            if (validPassword) {
                res.status(200).send({status: "E", message: "Please do not use your existing password"});
            } else {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);;
                await user.save();
                res.status(200).send({status: "S", message: "Password Updated"});
            }
        } else {
            // Insert the new user if they do not exist yet
            return res.status(400).send("That user doesn't exisit!");
        }
    } catch {
        return res.status(400).send({status: "E", message: "There has been an error updating this password."});
    }
    
});

module.exports = router;



// router.post('/update', auth, async (req, res, next) =>
// {
// 	const data = req.body;
//     const userId = req.body._id;
//     const email = req.body.email;

//     /* validation failed */
//     if(!(vres === true))
//     {
//         let errors = {}, item;
//         for(const index in vres)
//         {
//             item = vres[index];
//             errors[item.field] = item.message;
//         }
        
//         throw {
//             name: "ValidationError",
//             message: errors
//         };
//     }
    
//     mongo.connect(constants.constants.db_url, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//         }, (err, client) => {
//         if (err) {
//             client.close();
//         console.error(err)
//         return
//         }
//         const db = client.db('accreditation-station');
//         const collection = db.collection('users');

//         let id = ObjectId(userId);
//         const query = {_id:id};
//         const salt = await bcrypt.genSalt(10);
//         let thePass = await bcrypt.hash(user.password, salt);
//         const data = {
//             $set: {password: thePass}
//         };
//         collection.updateOne(query, data, {upsert: true}, (err, result) => {
//             if (err) {
//                 console.log("ERROR");
//                 console.log(err);
//                 return res.status(400).json({ error: err, status: "E"});
//             } else {
//                 let resultObj = {
//                     status: "S",
//                     statusMessage: "Successfully updated password",
//                     matchedCount: result.matchedCount,
//                     modifiedCount: result.modifiedCount,
//                     userInfo: result
//                 }
//                 return res.status(200).json(resultObj);
//             }
//         });     




        
//     });    
// });
// module.exports = router;