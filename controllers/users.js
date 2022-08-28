const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');

router.get('/', (req, res)=>{
    User.find({}, (err, foundUsers)=>{
        res.json(foundUsers);
    });
});

router.post('/', (req, res)=>{
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    console.log("create");
    User.create(req.body, (err, createdUser)=>{
        req.session.currentUser = createdUser
        res.status(201).json({
            status:201,
            message: "user created"
        });
    });
});

module.exports = router;
