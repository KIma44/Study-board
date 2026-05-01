const express = require('express');
const router = express.Router();

// 댓글 작성
router.post('/', (req, res) => {
  res.json('댓글 생성');
});

// 댓글 조회
router.get('/post/:postId', (req, res) => {
  res.json('댓글 목록');
});

// 댓글 삭제
router.delete('/:id', (req, res) => {
  res.json('댓글 삭제');
});

module.exports = router;