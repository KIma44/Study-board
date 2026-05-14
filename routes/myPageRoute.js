const express = require('express');

const router = express.Router();

const mypageController = require('../controllers/mypageController');

// 마이페이지
router.get('/myPage', mypageController.getMyPage);

module.exports = router;