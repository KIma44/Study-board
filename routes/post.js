const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

router.get('/', postController.getMain);
router.get('/write', postController.getWrite);
router.post('/write', postController.postWrite);

router.get('/edit/:id', postController.getEdit);
router.post('/edit/:id', postController.postEdit);
router.get('/delete/:id', postController.deletePost);

module.exports = router;