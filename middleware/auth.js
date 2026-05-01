const jwt = require('jsonwebtoken');
const SECRET = 'mysecretkey';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: '토큰 없음' });
  }

  const token = authHeader.split(' ')[1]; // Bearer 토큰

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // 👈 중요
    next();
  } catch (err) {
    return res.status(401).json({ message: '토큰 유효하지 않음' });
  }
};