const express = require('express');
const router = express.Router();

const noticeController = require('../controllers/noticeController');

router.get('/', noticeController.noticeList);

router.get('/write', noticeController.noticeWritePage);

router.post('/write', noticeController.noticeWrite);

router.get('/:id', noticeController.noticeDetail);

router.get('/edit/:id', noticeController.noticeEditPage);

router.post('/edit/:id', noticeController.noticeEdit);

router.get('/delete/:id', noticeController.noticeDelete);

module.exports = router;