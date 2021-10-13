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
        console.log(token);
        const decode = jwt.verify(token, config.get('PrivateKey'))
        
        mongoose.connect(consts.constants.db_url + '/' + consts.constants.db_name);

        const user = await Users.find({_id:decode._id,'tokens.token':token})

        if (!user) {
           return res.status(400).json({ error: "No User", redirect: consts.constants.ui_domain + '/login'});
        } else {
            req.token = token
            req.user = user
            
            next()
        }
        
       }else{
         // cookie not found redirect to login 
         return res.status(400).json({ error: "No Cookie", redirect: consts.constants.ui_domain + '/login'});
      }
   }
    catch {
       console.log('FAILURE IN AUTH MIDDLEWARE');
       return res.status(400).json({ error: "Error in auth middleware try", redirect: consts.constants.ui_domain + '/login'});
   }
}
module.exports = auth;