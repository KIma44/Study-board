const db = require('../config/db');

// 메인 (조회)
exports.getMain = (req, res) => {
    const sql = `
        SELECT posts.*, users.nickName 
        FROM posts 
        JOIN users ON posts.user_id = users.user_id
        ORDER BY post_id DESC
    `;

    db.query(sql, (err, results) => {
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

    // 로그인 안 했을 때 방지
    if (!req.session.user) {
        return res.send('로그인 필요');
    }

    const userId = req.session.user.id;

    const sql = 'INSERT INTO posts (title, content, date, user_id) VALUES (?, ?, NOW(), ?)';

    db.query(sql, [title, content, userId], (err) => {
        if (err) throw err;

        res.redirect('/');
    });
};

// 삭제
exports.deletePost = (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM posts WHERE post_id = ?', [id], (err, results) => {
        if (err) throw err;

        const post = results[0];
        const user = req.session.user;

        // 관리자 OR 작성자만 가능
        if (user.role !== 'admin' && user.id !== post.user_id) {
            return res.send('권한 없음');
        }

        db.query('DELETE FROM posts WHERE post_id = ?', [id], (err) => {
            if (err) throw err;

            res.redirect('/');
        });
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
        console.log('수정 요청 들어옴'); 
    
    const id = req.params.id;
    const { title, content } = req.body;

    const sql = 'UPDATE posts SET title = ?, content = ? WHERE post_id = ?';

    db.query(sql, [title, content, id], (err) => {
        if (err) throw err;

        res.redirect('/');
    });
};

// 상세 조회 
exports.getDetail = (req, res) => {
    const id = req.params.id;

    console.log('접속한 글 ID:', id);

    db.query(
        'UPDATE posts SET views = views + 1 WHERE post_id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error('조회수 증가 실패:', err);
                throw err;
            }

            console.log('조회수 증가 성공:', result);

            const sql = `
                SELECT posts.*, users.nickName 
                FROM posts 
                JOIN users ON posts.user_id = users.user_id
                WHERE posts.post_id = ?
            `;

            db.query(sql, [id], (err, results) => {
                if (err) throw err;

                res.render('detail', { post: results[0] });
            });
        }
    );
};