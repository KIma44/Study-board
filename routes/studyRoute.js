const express = require('express');
const router = express.Router();

const studyController = require('../controllers/studyController');
const { verifyToken } = require('../middleware/authMiddleware');


// 공부 게시판 메인 (로그인 불필요)
router.get(
    '/',
    studyController.getStudyLogs
);


// 글 작성 페이지
router.get(
    '/write',
    verifyToken,
    studyController.getWritePage
);


// 글 작성 처리
router.post(
    '/write',
    verifyToken,
    studyController.createStudyLog
);


// 상세 보기
router.get(
    '/detail/:id',
    studyController.getDetail
);


// 수정 페이지
router.get(
    '/edit/:id',
    verifyToken,
    studyController.getEditPage
);


// 수정 처리
router.post(
    '/edit/:id',
    verifyToken,
    studyController.updateStudyLog
);


// 삭제
router.get(
    '/delete/:id',
    verifyToken,
    studyController.deleteStudyLog
);

module.exports = router;