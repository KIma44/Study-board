const db = require('../config/db');

// 메인 (조회)
exports.getMain = (req, res) => {
    db.query('SELECT * FROM posts', (err, results) => {
        if (err) throw err;

        res.render('index', { posts: results });
    });
};

// 글 작성 페이지
exports.getWrite = (req, res) => {
    res.render('write');
};

// 글 저장
exports.postWrite = (req, res) => {
    const { title, content } = req.body;

    const sql = 'INSERT INTO posts (title, content, date) VALUES (?, ?, NOW())';

    db.query(sql, [title, content], (err) => {
        if (err) throw err;

        res.redirect('/');
    });
};

// 삭제
exports.deletePost = (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM posts WHERE post_id = ?', [id], (err) => {
        if (err) throw err;

        res.redirect('/');
    });
};

// 수정 페이지
exports.getEdit = (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM posts WHERE post_id = ?', [id], (err, results) => {
        if (err) throw err;

        res.render('edit', { post: results[0] });
    });
};

// 수정 처리
exports.postEdit = (req, res) => {
        console.log('수정 요청 들어옴'); // 🔥 추가
    
    const id = req.params.id;
    const { title, content } = req.body;

    const sql = 'UPDATE posts SET title = ?, content = ? WHERE post_id = ?';

    db.query(sql, [title, content, id], (err) => {
        if (err) throw err;

        res.redirect('/');
    });
};