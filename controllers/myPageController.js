const db = require('../config/db');

exports.myPage = (req, res) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.user_id;

    const sql = `
        SELECT *
        FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) throw err;

        if (result.length === 0) {
            return res.send('유저 없음');
        }

        res.render('my/myPage', {
            user: result[0]
        });
    });
};