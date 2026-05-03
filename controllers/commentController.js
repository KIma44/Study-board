const db = require('../config/db');

// 댓글 작성
exports.addComment = (req, res) => {

    // 로그인 체크
    if (!req.session.user) {
        return res.send("<script>alert('로그인 필요'); location.href='/login';</script>");
    }

    const userId = req.session.user.id;
    const postId = req.body.post_id;
    const content = req.body.content;

    // 댓글 빈 값 체크
    if (!content || content.trim() === '') {
        return res.send("<script>alert('댓글을 입력하세요'); history.back();</script>");
    }

    // 게시글 작성자 조회
    const sql = "SELECT user_id FROM posts WHERE post_id = ?";

    db.query(sql, [postId], (err, result) => {
        if (err) throw err;

        const postOwner = result[0].user_id;

        //  자기 글 체크
        if (Number(userId) === Number(postOwner)) {
            return res.send("<script>alert('자신의 글에는 댓글을 달 수 없습니다.'); history.back();</script>");
        }

        // 댓글 등록
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

// 댓글 수정 페이지 가져오기
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

// 댓글 수정 처리
exports.postEditComment = (req, res) => {

    const commentId = req.params.id;
    const content = req.body.content;
    const userId = req.session.user.id;

    const sql = "SELECT * FROM comments WHERE comment_id = ?";

    db.query(sql, [commentId], (err, result) => {
        if (err) throw err;

        const comment = result[0];

        // 🔥 본인 체크
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
}

// 댓글 삭제
exports.deleteComment = (req, res) => {

    const commentId = req.params.id;
    const userId = req.session.user.id;

    const sql = "SELECT * FROM comments WHERE comment_id = ?";

    db.query(sql, [commentId], (err, result) => {
        if (err) throw err;

        const comment = result[0];

        //  본인 댓글 체크
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