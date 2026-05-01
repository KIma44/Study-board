const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const SECRET = 'mysecretkey'; // 나중에 .env로 빼기

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // 여기선 테스트용 (나중에 DB 연결)
  if (email !== 'test@test.com' || password !== '1234') {
    return res.status(401).json({ message: '로그인 실패' });
  }

  const token = jwt.sign(
    { email: email },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

module.exports = router;