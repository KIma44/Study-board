const db = require('../config/db');


// 게시글 목록 + 검색 + 페이지
exports.getMain = (req, res) => {

    const type = req.query.type || 'all';
    const keyword = req.query.keyword || '';

    const currentPage = parseInt(req.query.page) || 1;

    const pageSize = 10;
    const offset = (currentPage - 1) * pageSize;

    let whereSql = '';
    let values = [];

    // 검색
    if (keyword) {

        if (type === 'title') {

            whereSql =
            `WHERE p.title LIKE ?`;

            values.push(`%${keyword}%`);

        }

        else if (type === 'writer') {

            whereSql =
            `WHERE u.nickName LIKE ?`;

            values.push(`%${keyword}%`);

        }

        else {

            whereSql =
            `
            WHERE
            p.title LIKE ?
            OR u.nickName LIKE ?
            `;

            values.push(
                `%${keyword}%`,
                `%${keyword}%`
            );

        }

    }

    // 게시글 개수
    const countSql = `
        SELECT COUNT(*) AS total
        FROM posts p
        JOIN users u
        ON p.user_id=u.user_id
        ${whereSql}
    `;

    db.query(countSql, values, (err, countResult) => {

        if (err) throw err;

        const totalCount =
            countResult[0].total;

        const totalPages =
            Math.ceil(totalCount / pageSize);

        // 게시글 가져오기
        const postSql = `
            SELECT p.*,u.nickName
            FROM posts p
            JOIN users u
            ON p.user_id=u.user_id
            ${whereSql}
            ORDER BY p.post_id DESC
            LIMIT ? OFFSET ?
        `;

        db.query(
            postSql,
            [...values, pageSize, offset],
            (err, results) => {

                if (err) throw err;

                res.render(
                    'index',
                    {
                        posts: results,
                        loginUser: req.user || null,

                        type,
                        keyword,

                        currentPage,
                        totalPages
                    }
                );

            }
        );

    });

};

// 글 작성 페이지
exports.getWrite=(req,res)=>{

    res.render('write');

};


// 글 작성 처리
exports.createPost = (req, res) => {

    // 로그인 체크
    if (!req.user) {
        return res.redirect('/login');
    }

    const userId = req.user.user_id;

    const { title, content } = req.body;

    // 입력값 체크
    if (!title || !content) {
        return res.send(
            "<script>alert('빈 값 있음');history.back();</script>"
        );
    }

    const sql = `
        INSERT INTO posts
        (
            user_id,
            title,
            content
        )
        VALUES (?, ?, ?)
    `;

    db.query(sql, [userId, title, content], (err) => {

        if (err) throw err;

        res.redirect('/post'); // ← 여기가 더 자연스러움
    });
};


// 게시글 상세
exports.getPostDetail = (req, res) => {

    const postId = req.params.id;

    // 조회수 증가
    db.query(
        `
        UPDATE posts
        SET views = views + 1
        WHERE post_id = ?
        `,
        [postId],
        (err) => {

            if (err) throw err;

            const postSql = `
                SELECT p.*, u.nickName
                FROM posts p
                JOIN users u
                ON p.user_id = u.user_id
                WHERE p.post_id = ?
            `;

            const commentSql = `
                SELECT c.*, u.nickName
                FROM comments c
                JOIN users u
                ON c.user_id = u.user_id
                WHERE c.post_id = ?
                ORDER BY c.comment_id DESC
            `;

            db.query(postSql, [postId], (err, postResult) => {

                if (err) throw err;

                if (postResult.length === 0) {
                    return res.send("게시글 없음");
                }

                db.query(commentSql, [postId], (err, commentResult) => {

                    if (err) throw err;

                    res.render(
                        'detail',
                        {
                            post: postResult[0],
                            comments: commentResult,
                            loginUser: req.user || null
                        }
                    );

                });

            });

        }
    );

};

// 수정 페이지
exports.getEditPost=(req,res)=>{

    const postId =
        req.params.id;

    db.query(
        `
        SELECT *
        FROM posts
        WHERE post_id=?
        `,
        [postId],
        (err,result)=>{

            if(err) throw err;

            if(
                result[0].user_id
                !==
                req.user.user_id
            ){

                return res.send(
                    "<script>alert('권한 없음');history.back();</script>"
                );

            }

            res.render(
                'edit',
                {
                    post:result[0]
                }
            );

        }
    );

};


// 수정 처리

exports.updatePost=(req,res)=>{

    const postId =
        req.params.id;

    const {
        title,
        content
    } = req.body;

    const sql=`
        UPDATE posts
        SET
        title=?,
        content=?
        WHERE post_id=?
    `;

    db.query(
        sql,
        [
            title,
            content,
            postId
        ],
        (err)=>{

            if(err) throw err;

            res.redirect(
                '/post/'+postId
            );

        }
    );

};


// 삭제 처리

exports.deletePost = (req, res) => {

    const postId = req.params.id;

    db.query(
        `
        SELECT user_id
        FROM posts
        WHERE post_id=?
        `,
        [postId],
        (err, result) => {

            if (err) throw err;

            // 게시글 없을 때
            if (result.length === 0) {
                return res.send("<script>alert('게시글 없음');history.back();</script>");
            }

            // 관리자면 무조건 허용
            if (req.user.role === 'admin') {

                return db.query(
                    `
                    DELETE
                    FROM posts
                    WHERE post_id=?
                    `,
                    [postId],
                    (err) => {

                        if (err) throw err;

                        res.redirect('/');
                    }
                );
            }

            // 일반 유저는 본인 글만 삭제 가능
            if (result[0].user_id !== req.user.user_id) {
                return res.send("<script>alert('권한 없음');history.back();</script>");
            }

            db.query(
                `
                DELETE
                FROM posts
                WHERE post_id=?
                `,
                [postId],
                (err) => {

                    if (err) throw err;

                    res.redirect('/');
                }
            );
        }
    );
};