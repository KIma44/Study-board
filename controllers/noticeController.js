const db = require('../config/db');

exports.noticeList = (req, res) => {

    const sql = `
    SELECT n.*, u.nickName
    FROM notices n
    JOIN users u
    ON n.user_id = u.user_id
    ORDER BY n.created_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) throw err;

        res.render('notice/notice', {
            notices: result
        });
    });
};