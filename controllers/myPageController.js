const db = require('../config/db');

// 마이페이지
exports.getMyPage = (req, res) => {

    // JWT 로그인 체크
    if (!req.user) {
        return res.redirect('/login');
    }

    console.log(req.user);

    const user = req.user;
    const userId = user.user_id;

    if (!userId) {
        return res.send('유저 정보 없음');
    }

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

        posts.forEach(post => {

    if (post.type === 'free') {

        post.url = '/post/' + post.id;

    } else if (post.type === 'study') {

        post.url = '/study/detail/' + post.id;
    }

});

        const freeCount =
            posts.filter(post => post.type === 'free').length;

        const studyCount =
            posts.filter(post => post.type === 'study').length;

        const todoCountSql = `
SELECT COUNT(*) AS count
FROM todos
WHERE user_id = ?
`;

db.query(todoCountSql, [userId], (err, todoResult) => {

    if (err) throw err;

    const todoCount = todoResult[0].count;

    db.query(
    `
    SELECT *
    FROM todos
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 5
    `,
    [userId],
    (err, todos) => {

        if (err) throw err;

        todos.forEach(todo => {
            todo.url = '/todo';
        });

        res.render('my/myPage', {
            user,
            posts,
            freeCount,
            studyCount,
            todoCount,
            todos,
            loginUser: req.user
        });

    }
);
});
}); 
}; 