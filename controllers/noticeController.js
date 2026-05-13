const db = require('../config/db');


// 공지 목록
exports.noticeList = (req, res) => {

    const sql = `
    SELECT n.*, u.nickName
    FROM notices n
    JOIN users u
    ON n.user_id = u.user_id
    ORDER BY n.created_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) throw err;

        res.render('notice/notice', {
            notices: result
        });
    });
};


// 공지 상세
exports.noticeDetail = (req, res) => {

    const notice_id = req.params.id;

    const sql = `
    SELECT n.*, u.nickName
    FROM notices n
    JOIN users u
    ON n.user_id = u.user_id
    WHERE n.notice_id = ?
    `;

    db.query(sql, [notice_id], (err, result) => {

        if (err) throw err;

        res.render('notice/noticeDetail', {
            notice: result[0]
        });
    });
};


// 공지 작성 페이지
exports.noticeWritePage = (req, res) => {

    if (!req.session.user) {
        return res.send('로그인 후 이용하세요.');
    }

    if (req.session.user.role !== 'admin') {
        return res.send('관리자만 작성 가능합니다.');
    }

    res.render('notice/noticeWrite');
};


// 공지 작성 처리
exports.noticeWrite = (req, res) => {

    if (!req.session.user) {
        return res.send('로그인 후 이용하세요.');
    }

    if (req.session.user.role !== 'admin') {
        return res.send('관리자만 작성 가능합니다.');
    }

    const { title, content } = req.body;

    // 수정된 부분
    const user_id = req.session.user.user_id;

    const sql = `
    INSERT INTO notices
    (title, content, user_id)
    VALUES (?, ?, ?)
    `;

    db.query(sql, [title, content, user_id], (err) => {

        if (err) throw err;

        res.redirect('/notice');
    });
};


// 수정 페이지
exports.noticeEditPage = (req, res) => {

    const notice_id = req.params.id;

    const sql = `
    SELECT *
    FROM notices
    WHERE notice_id = ?
    `;

    db.query(sql, [notice_id], (err, result) => {

        if (err) throw err;

        res.render('notice/noticeEdit', {
            notice: result[0]
        });
    });
};


// 수정 처리
exports.noticeEdit = (req, res) => {

    const notice_id = req.params.id;

    const { title, content } = req.body;

    const sql = `
    UPDATE notices
    SET title = ?, content = ?
    WHERE notice_id = ?
    `;

    db.query(sql, [title, content, notice_id], (err) => {

        if (err) throw err;

        res.redirect('/notice/' + notice_id);
    });
};


// 삭제
exports.noticeDelete = (req, res) => {

    const notice_id = req.params.id;

    const sql = `
    DELETE FROM notices
    WHERE notice_id = ?
    `;

    db.query(sql, [notice_id], (err) => {

        if (err) throw err;

        res.redirect('/notice');
    });
};