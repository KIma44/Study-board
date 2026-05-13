const db = require('../config/db');

// 로그인 페이지
exports.getLogin = (req, res) => {
    res.render('login');
};

// 로그인 처리
exports.postLogin = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.send('이메일 없음');
        }

        const user = results[0];

        if (user.password !== password) {
            return res.send('비밀번호 틀림');
        }

        req.session.user = {
            user_id: user.user_id,
            email: user.email,
            nickName: user.nickName,
            profile_image: user.profile_image,
            role: user.role
        };

        res.redirect('/');
    });
};

// 회원가입 페이지
exports.getRegister = (req, res) => {
    res.render('register');
};

// 회원가입 처리
exports.postRegister = (req, res) => {
    const { email, password, nickName } = req.body;

    const sql = 'INSERT INTO users (email, password, nickName) VALUES (?, ?, ?)';

    db.query(sql, [email, password, nickName], (err) => {
        if (err) throw err;

        res.redirect('/login');
    });
};

// 로그아웃
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

exports.getProfile = (req, res) => {

    const userId = req.params.id;

    const sql = `
        SELECT *
        FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) throw err;

        if (results.length === 0) {
            return res.send('유저 없음');
        }

        res.render('user/profile', {
            user: results[0]
        });

    });
};

exports.updateProfile = (req, res) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.user_id;
    
    if (!req.file) {
        return res.redirect('/profile/' + userId);
    }

    const profilePath = '/uploads/' + req.file.filename;

    const sql = `
        UPDATE users
        SET profile_image = ?
        WHERE user_id = ?
    `;

    db.query(sql, [profilePath, userId], (err) => {

        if (err) throw err;

        req.session.user.profile_image = profilePath;

        res.redirect('/profile/' + userId);
    });
};

exports.updateUser = (req, res) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.user_id;

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

        res.redirect('/profile/' + userId);
    });
};