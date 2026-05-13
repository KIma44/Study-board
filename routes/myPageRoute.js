const express = require('express');
const router = express.Router();

const mypageController = require('../controllers/mypageController');

router.get('/myPage', mypageController.myPage);



module.exports = router;