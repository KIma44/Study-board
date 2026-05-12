const db = require('../config/db');

exports.myPage = (req, res) => {

    console.log(req.session.user);

    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.id;

    const sql = `
        SELECT *
        FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) throw err;

        console.log(result);

        res.render('my/myPage', {
            user: result[0]
        });
    });
};

exports.updateProfile = (req, res) => {

    console.log(req.session.user);

    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.id;

    const profilePath = '/uploads/' + req.file.filename;

    const sql = `
        UPDATE users
        SET profile_image = ?
        WHERE user_id = ?
    `;

    db.query(sql, [profilePath, userId], (err, result) => {

        if (err) throw err;

        console.log(result);

        req.session.user.profile_image = profilePath;

        res.redirect('/myPage');
    });
};

exports.updateUser = (req, res) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.id;

    const { email, nickName } = req.body;

    const sql = `
        UPDATE users
        SET email = ?, nickName = ?
        WHERE user_id = ?
    `;

    db.query(sql, [email, nickName, userId], (err) => {

        if (err) throw err;

        req.session.user.email = email;
        req.session.user.nickName = nickName;

        res.redirect('/myPage');
    });
};