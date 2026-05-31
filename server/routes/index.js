const express = require('express');
const router = express.Router();
const Post = require('../controllers/post'); // מייבא את הקונטרולר שפתחנו בשלב הקודם

router.get('/', Post.getPosts);

module.exports = router;