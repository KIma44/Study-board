const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const userController = require('../controllers/userController');


// multer 설정
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }

});

const upload = multer({
    storage: storage
});


router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

router.get('/register', userController.getRegister);
router.post('/register', userController.postRegister);

router.get('/logout', userController.logout);


// 프로필 페이지
router.get('/profile/:id', userController.getProfile);


// 프로필 이미지 수정
router.post(
    '/profile/update',
    upload.single('profile'),
    userController.updateProfile
);


// 회원정보 수정
router.post(
    '/profile/user/update',
    userController.updateUser
);

module.exports = router;