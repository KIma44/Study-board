const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');


// multer
const storage = multer.diskStorage({

    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },

    filename:(req,file,cb)=>{
        cb(
            null,
            Date.now()+
            path.extname(file.originalname)
        );
    }

});

const upload=multer({
    storage
});


// 로그인 페이지
router.get(
    '/login',
    userController.getLogin
);

// 로그인 처리
router.post(
    '/login',
    authController.login
);


// 회원가입 페이지
router.get(
    '/register',
    userController.getRegister
);

// 회원가입 처리
router.post(
    '/register',
    authController.register
);


// 로그아웃
router.get('/logout',(req,res)=>{

    res.clearCookie('token');

    res.redirect('/login');

});


// 프로필
router.get(
    '/profile/:id',
    verifyToken,
    userController.getProfile
);


// 프로필 이미지 변경
router.post(
    '/profile/update',
    verifyToken,
    upload.single('profile'),
    userController.updateProfile
);


// 회원정보 수정
router.post(
    '/profile/user/update',
    verifyToken,
    userController.updateUser
);

module.exports=router;