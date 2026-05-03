const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

router.get('/', postController.getMain);

router.get('/write', auth.isLogin, postController.getWrite);
router.post('/write', auth.isLogin, postController.postWrite);

router.get('/post/:id', postController.getDetail);

router.get('/edit/:id', auth.isLogin, postController.getEdit);
router.post('/edit/:id', auth.isLogin, postController.postEdit);

router.get('/delete/:id', auth.isLogin, postController.deletePost);

module.exports = router;