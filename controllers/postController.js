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
                    SELECT
                        posts.*,
                        users.user_id,
                        users.nickName,
                        users.profile_image

                    FROM posts

                    JOIN users
                    ON posts.user_id = users.user_id

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
    const userId = req.session.user?.user_id; 
    if (!userId) { return res.redirect('/login?error=login'); 

    } 
    res.render('write'); 
};

// ✅ 글 작성
exports.postWrite = (req, res) => {
    const { title, content } = req.body;

    if (!req.session.user) {
        ```js id="7l14wj"
if (!req.session.user) {
    return res.redirect('/login?error=login');
}
```

    }

    // 유효성 검사
    if (!isValid(title) || !isValid(content)) {
        return res.send('제목과 내용을 입력하세요');
    }

    const userId = req.session.user.user_id;
    
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

    const userId = req.session.user?.user_id;

    if (!userId) {
        return res.redirect('/login?error=login');
    }

    const id = req.params.id;

    db.query('SELECT * FROM posts WHERE post_id = ?', [id], (err, results) => {

        if (err) throw err;

        res.render('edit', {
            post: results[0]
        });

    });

};


//  수정 처리 (권한 + 유효성 포함)
exports.postEdit = (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;

    if (!req.session.user) {
 
    if (!req.session.user) {
        return res.redirect('/login?error=login');
    }


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
    const postId = req.params.id;

    const postSql = `
        SELECT posts.*, users.nickName
        FROM posts
        JOIN users ON posts.user_id = users.user_id
        WHERE post_id = ?
    `;

    const commentSql = `
        SELECT comments.*, users.nickName
        FROM comments
        JOIN users ON comments.user_id = users.user_id
        WHERE post_id = ?
        ORDER BY comment_id DESC
    `;

    db.query(postSql, [postId], (err, postResult) => {
        if (err) throw err;

        db.query(commentSql, [postId], (err, commentResult) => {
            if (err) throw err;

            res.render('detail', {
                post: postResult[0],
                comments: commentResult 
            });
        });
    });
};