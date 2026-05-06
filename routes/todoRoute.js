const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// 전체
router.get('/', todoController.getAllTodo);

// 특정
router.get('/:id', todoController.getTodo);

// 추가
router.post('/add', todoController.addTodo);

// 체크
router.post('/toggle/:id', todoController.toggleTodo);

// 삭제
router.post('/delete/:id', todoController.deleteTodo);


// 수정
router.post('/update/:id', todoController.updateTodo);

module.exports = router;