const jwt = require('jsonwebtoken');
const config = require('config');
const { User, validate } = require('../models/model.user-reg');
const express = require('express');
const mongoose = require('mongoose');

const consts = require('../constants');

const auth = async(req, res, next)=>{
    try {
      let token = req.headers['x-access-token'];
      if (token) {
        const decode = jwt.verify(token, config.get('PrivateKey'));

        req.token = token        
        next()

       } else {  
         // cookie not found redirect to login 
         return res.status(400).json({ error: "No Cookie", redirect: consts.constants.ui_domain + '/login'});
      
        }
    }
    catch(err) {
       console.log('FAILURE IN AUTH MIDDLEWARE');
       console.log(err);
       return res.status(400).json({ error: "Error in auth middleware try", redirect: consts.constants.ui_domain + '/login'});
   }
}
module.exports = auth;