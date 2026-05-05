const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const studyController = require('../controllers/studyController');

router.get('/study', studyController.getStudyLogs);
router.post('/study', studyController.createStudyLog);
router.get('/study/delete/:id', studyController.deleteStudyLog);

router.get('/study/edit/:id', studyController.getEditPage);
router.post('/study/edit/:id', studyController.updateStudyLog);

module.exports = router;