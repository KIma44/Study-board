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
            id: user.user_id,
            email: user.email,
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