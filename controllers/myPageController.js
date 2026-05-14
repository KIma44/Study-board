const db = require('../config/db');

// 마이페이지
exports.getMyPage = (req, res) => {

    // 로그인 체크
    if (!req.session.user) {
        return res.redirect('/login');
    }

    console.log(req.session.user);

    // 유저 정보
    const user = req.session.user;

    // users 테이블 PK
    const userId = user.user_id;

    if (!userId) {
        return res.send('유저 정보 없음');
    }

    // 가입일 없으면 기본값 처리
    if (!user.created_at) {
        user.created_at = null;
    }

    // 자유게시판 + 공부게시판 조회
    const sql = `
    SELECT
        post_id AS id,
        title,
        created_at,
        'free' AS type
    FROM posts
    WHERE user_id = ?

    UNION ALL

    SELECT
        study_log_id AS id,
        title,
        created_at,
        'study' AS type
    FROM study_logs
    WHERE user_id = ?

    ORDER BY created_at DESC
    `;

    db.query(sql, [userId, userId], (err, posts) => {

        if (err) throw err;

        // 게시글 URL 생성
        posts.forEach(post => {

            if (post.type === 'free') {

                post.url = '/post/' + post.id;

            } else {

                post.url = '/study/' + post.id;

            }

        });

        // 자유게시판 개수
        const freeCount =
            posts.filter(post =>
                post.type === 'free'
            ).length;

        // 공부게시판 개수
        const studyCount =
            posts.filter(post =>
                post.type === 'study'
            ).length;

        // TODO 개수 조회
        const todoSql = `
        SELECT COUNT(*) AS count
        FROM todos
        WHERE user_id = ?
        `;

        db.query(todoSql, [userId], (err, todoResult) => {

            if (err) throw err;

            const todoCount =
                todoResult[0].count;

            // 최종 렌더링
            res.render('my/myPage', {

                user,

                posts,

                freeCount,

                studyCount,

                todoCount

            });

        });

    });

};