const express = require('express');
const router = express.Router();

const mypageController = require('../controllers/mypageController');

const upload = require('../middlewares/upload');

router.get('/myPage', mypageController.myPage);

router.post(
    '/profile/update',
    upload.single('profile'),
    mypageController.updateProfile
);

router.post('/myPage/update', mypageController.updateUser);

module.exports = router;