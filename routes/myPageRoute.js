const express = require('express');
const router = express.Router();

const mypageController = require('../controllers/mypageController');
const { verifyToken } = require('../middleware/authMiddleware');


// ========================
// 📌 마이페이지
// ========================
router.get('/mypage', verifyToken, mypageController.getMyPage);

module.exports = router;