const express = require('express');
const router = express.Router();

const mypageController = require('../controllers/mypageController');

router.get('/', mypageController.mypage);

module.exports = router;