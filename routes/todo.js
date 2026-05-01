const express = require('express');
const router = express.Router(); 

router.post('/', (req, res) => {
  res.json('todo 생성');
});

router.get('/', (req, res) => {
  res.json('todo 목록');
});

module.exports = router; 