const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', postController.getMain);

// write
router.get('/write', verifyToken, postController.getWrite);
router.post('/write', verifyToken, postController.createPost);

router.get('/edit/:id', verifyToken, postController.getEditPost);
router.post('/edit/:id', verifyToken, postController.updatePost);

router.get('/delete/:id', verifyToken, postController.deletePost);

router.get('/:id', postController.getPostDetail);

module.exports = router;