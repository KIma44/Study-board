const express = require('express');
const router = express.Router();

const noticeController = require('../controllers/noticeController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');


// ========================
// 공지 목록
// ========================
router.get(
    '/',
    noticeController.noticeList
);


// ========================
// 공지 작성 페이지
// ========================
router.get(
    '/write',
    verifyToken,
    isAdmin,
    noticeController.noticeWritePage
);


// ========================
// 공지 작성
// ========================
router.post(
    '/write',
    verifyToken,
    isAdmin,
    noticeController.noticeWrite
);


// ========================
// 공지 수정 페이지
// ========================
router.get(
    '/edit/:id',
    verifyToken,
    isAdmin,
    noticeController.noticeEditPage
);


// ========================
// 공지 수정
// ========================
router.post(
    '/edit/:id',
    verifyToken,
    isAdmin,
    noticeController.noticeEdit
);


// ========================
// 공지 삭제
// ========================
router.get(
    '/delete/:id',
    verifyToken,
    isAdmin,
    noticeController.noticeDelete
);


// ========================
// 공지 상세
// 반드시 맨 아래
// ========================
router.get(
    '/:id',
    noticeController.noticeDetail
);

module.exports = router;