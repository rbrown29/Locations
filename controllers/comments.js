const express = require('express');
const router = express.Router();
const Comment = require('../models/comments.js');

router.get('/', (req,res) => {
    Comment.find({},(err, allComments) => {
        res.json(allComments);
    });
});

//.....New Comment.......//
router.post('/', (req,res) => {
    Comment.create(req.body, (error, newComment) => {
        res.json(newComment);
    });
});

module.exports = router;
