const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// 공부 기록 생성
router.post('/', auth, (req, res) => {
  console.log(req.user); // 👈 여기서 사용자 정보 확인 가능
  res.json('공부 기록 생성');
});
// 전체 조회
router.get('/', (req, res) => {});

// 상세 조회
router.get('/:id', (req, res) => {});

// 수정
router.put('/:id', (req, res) => {});

// 삭제
router.delete('/:id', (req, res) => {});

module.exports = router;