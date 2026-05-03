const db = require('../config/db');

// ✅ 공통 유효성 검사 함수
function isValid(value) {
    return value && value.trim() !== '';
}

// 메인 (조회)
exports.getMain = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const type = req.query.type || 'all';
    const keyword = req.query.keyword || '';

    let where = '';
    let params = [];

    if (keyword) {
        if (type === 'title') {
            where = "WHERE posts.title LIKE ?";
            params.push(`%${keyword}%`);
        } else if (type === 'writer') {
            where = "WHERE users.nickName LIKE ?";
            params.push(`%${keyword}%`);
        } else {
            where = "WHERE posts.title LIKE ? OR users.nickName LIKE ?";
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
    }

    const countSql = `
        SELECT COUNT(*) AS total
        FROM posts
        JOIN users ON posts.user_id = users.user_id
        ${where}
    `;

    db.query(countSql, params, (err, countResult) => {
        if (err) throw err;

        const totalPosts = countResult[0].total;
        const totalPages = Math.ceil(totalPosts / limit);

        const sql = `
            SELECT posts.*, users.nickName
            FROM posts
            JOIN users ON posts.user_id = users.user_id
            ${where}
            ORDER BY post_id DESC
            LIMIT ? OFFSET ?
        `;

        db.query(sql, [...params, limit, offset], (err, results) => {
            if (err) throw err;

            res.render('index', {
                posts: results,
                currentPage: page,
                totalPages: totalPages,
                type,
                keyword
            });
        });
    });
};

// 글 작성 페이지
exports.getWrite = (req, res) => {
    res.render('write');
};

// ✅ 글 작성
exports.postWrite = (req, res) => {
    const { title, content } = req.body;

    if (!req.session.user) {
        return res.send('로그인 필요');
    }

    // ✅ 유효성 검사
    if (!isValid(title) || !isValid(content)) {
        return res.send('제목과 내용을 입력하세요');
    }

    const userId = req.session.user.id;

    const sql = 'INSERT INTO posts (title, content, user_id) VALUES (?, ?,  ?)';

    db.query(sql, [title.trim(), content.trim(), userId], (err) => {
        if (err) {
            console.error(err);
            return res.send('DB 오류');
        }

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

//  수정 처리 (권한 + 유효성 포함)
exports.postEdit = (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;

    if (!req.session.user) {
        return res.send('로그인 필요');
    }

    //  유효성 검사
    if (!isValid(title) || !isValid(content)) {
        return res.send('제목과 내용을 입력하세요');
    }

    //  작성자 or 관리자만 수정 가능
    db.query('SELECT * FROM posts WHERE post_id = ?', [id], (err, results) => {
        if (err) throw err;

        const post = results[0];
        const user = req.session.user;

        if (user.role !== 'admin' && user.id !== post.user_id) {
            return res.send('권한 없음');
        }

        const sql = 'UPDATE posts SET title = ?, content = ? WHERE post_id = ?';

        db.query(sql, [title.trim(), content.trim(), id], (err) => {
            if (err) {
                console.error(err);
                return res.send('DB 오류');
            }

            res.redirect('/');
        });
    });
};

// 상세 조회
exports.getDetail = (req, res) => {
    const id = req.params.id;

    db.query(
        'UPDATE posts SET views = views + 1 WHERE post_id = ?',
        [id],
        (err) => {
            if (err) throw err;

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