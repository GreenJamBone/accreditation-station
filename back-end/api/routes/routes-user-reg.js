const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/model.user-reg');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const constants = require('../constants');


router.post('/', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if this user already exisits

    mongoose.connect(constants.constants.db_url + '/' + constants.constants.db_name);
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).send('That user already exisits!');
        } else {
            // Insert the new user if they do not exist yet
            user = new User(_.pick(req.body, ['first_name', 'last_name', 'email', 'password', 'roles']));
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
            const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'));
            res.header('x-auth-token', token).send(_.pick(user, ['_id', 'first_name', 'last_name', 'email', 'roles']));
        }
    } catch {
        return res.status(400).send({status: "E", message: "There has been an error adding this user."});
    }
    
});

module.exports = router;