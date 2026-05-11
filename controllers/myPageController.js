const db = require('../config/db');

exports.mypage = (req, res) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.id;

    const sql = `
        SELECT user_id, email, nickName, created_at, role
        FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) throw err;

        res.render('my/myPage', {
            user: result[0]
        });
    });
};