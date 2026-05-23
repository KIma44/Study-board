const express = require('express');
const router = express.Router();

const todoController = require('../controllers/todoController');
const { verifyToken } = require('../middleware/authMiddleware');


// ========================
// 📌 전체 TODO
// ========================
router.get('/', verifyToken, todoController.getAllTodo);


// ========================
// 📌 특정 TODO
// ========================
router.get('/:id', verifyToken, todoController.getTodo);


// ========================
// 📌 TODO 추가
// ========================
router.post('/add', verifyToken, todoController.addTodo);


// ========================
// 📌 TODO 완료 토글
// ========================
router.post('/toggle/:id', verifyToken, todoController.toggleTodo);


// ========================
// 📌 TODO 삭제
// ========================
router.post('/delete/:id', verifyToken, todoController.deleteTodo);


// ========================
// 📌 TODO 수정
// ========================
router.post('/update/:id', verifyToken, todoController.updateTodo);


module.exports = router;