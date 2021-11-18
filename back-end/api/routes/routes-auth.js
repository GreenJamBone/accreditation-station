const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/model.user-reg');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const constants = require('../constants');

router.post('/', async (req, res) => {
    // First Validate The HTTP Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //  Now find the user by their email address
    mongoose.connect(constants.constants.db_url + '/' + constants.constants.db_name);
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Incorrect email.');
    }

    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Incorrect password.');
    }
    const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'));
    let options = {
        path:"/",
        sameSite:true,
        maxAge: 1000 * 60 * 60 * 1, // would expire after 1 hours
        httpOnly: true, // The cookie only accessible by the web server
    }
    
    res.cookie('x-access-token',token, options);
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'first_name', 'last_name', 'title', 'roles', 'email']));
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req);
}

module.exports = router; 