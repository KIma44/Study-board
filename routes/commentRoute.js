const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');


// ========================
// 📌 댓글 작성
// ========================
router.post('/comment', verifyToken, commentController.addComment);


// ========================
// 📌 댓글 수정 페이지
// ========================
router.get(
    '/comment/edit/:id',
    verifyToken,
    commentController.getEditComment
);


// ========================
// 📌 댓글 수정 처리
// ========================
router.post(
    '/comment/edit/:id',
    verifyToken,
    commentController.postEditComment
);


// ========================
// 📌 댓글 삭제
// ========================
router.get(
    '/comment/delete/:id',
    verifyToken,
    commentController.deleteComment
);

module.exports = router;