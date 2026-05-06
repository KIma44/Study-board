const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');

// 목록
router.get('/', studyController.getStudyLogs);

// 작성
router.post('/', studyController.createStudyLog);

// 삭제
router.get('/delete/:id', studyController.deleteStudyLog);

// 수정 페이지
router.get('/edit/:id', studyController.getEditPage);

// 수정 처리
router.post('/edit/:id', studyController.updateStudyLog);

// 상세
router.get('/detail/:id', studyController.getDetail);

module.exports = router;