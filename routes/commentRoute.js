const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

const auth = require('../middleware/auth');

// 댓글 작성
router.post('/comment', commentController.addComment);

// 댓글 수정
router.get('/comment/edit/:id', auth.isLogin, commentController.getEditComment);
router.post('/comment/edit/:id', auth.isLogin, commentController.postEditComment);

// 댓글 삭제
router.get('/comment/delete/:id', auth.isLogin, commentController.deleteComment);


module.exports = router;