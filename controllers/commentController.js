const db = require('../config/db');

// 댓글 작성
exports.addComment = (req, res) => {

    const userId = req.user.user_id; // 🔥 변경
    const postId = req.body.post_id;
    const content = req.body.content;

    if (!content || content.trim() === '') {
        return res.send("<script>alert('댓글을 입력하세요'); history.back();</script>");
    }

    const sql = "SELECT user_id FROM posts WHERE post_id = ?";

    db.query(sql, [postId], (err, result) => {
        if (err) throw err;

        const postOwner = result[0].user_id;

        if (Number(userId) === Number(postOwner)) {
            return res.send("<script>alert('자신의 글에는 댓글을 달 수 없습니다.'); history.back();</script>");
        }

        const insertSql = `
            INSERT INTO comments (post_id, user_id, content)
            VALUES (?, ?, ?)
        `;

        db.query(insertSql, [postId, userId, content], (err) => {
            if (err) throw err;
            res.redirect(`/post/${postId}`);
        });
    });
};

// 댓글 수정 페이지
exports.getEditComment = (req, res) => {

    const commentId = req.params.id;

    db.query(
        "SELECT * FROM comments WHERE comment_id = ?",
        [commentId],
        (err, result) => {
            if (err) throw err;

            res.render('commentEdit', {
                comment: result[0]
            });
        }
    );
};

// 댓글 수정
exports.postEditComment = (req, res) => {

    const commentId = req.params.id;
    const content = req.body.content;
    const userId = req.user.user_id; // 🔥 변경

    const sql = "SELECT * FROM comments WHERE comment_id = ?";

    db.query(sql, [commentId], (err, result) => {
        if (err) throw err;

        const comment = result[0];

        if (Number(comment.user_id) !== Number(userId)) {
            return res.send("<script>alert('권한 없음'); history.back();</script>");
        }

        const updateSql = `
            UPDATE comments 
            SET content = ?
            WHERE comment_id = ?
        `;

        db.query(updateSql, [content, commentId], (err) => {
            if (err) throw err;
            res.redirect(`/post/${comment.post_id}`);
        });
    });
};

// 댓글 삭제
exports.deleteComment = (req, res) => {

    const commentId = req.params.id;
    const userId = req.user.user_id; // 🔥 변경

    const sql = "SELECT * FROM comments WHERE comment_id = ?";

    db.query(sql, [commentId], (err, result) => {
        if (err) throw err;

        const comment = result[0];

        if (Number(comment.user_id) !== Number(userId)) {
            return res.send("<script>alert('권한 없음'); history.back();</script>");
        }

        const deleteSql = "DELETE FROM comments WHERE comment_id = ?";

        db.query(deleteSql, [commentId], (err) => {
            if (err) throw err;
            res.redirect(`/post/${comment.post_id}`);
        });
    });
};