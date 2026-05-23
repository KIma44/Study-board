const db = require('../config/db');


// =====================
// 로그인 페이지
// =====================
exports.getLogin = (req, res) => {

    res.render('user/login');

};


// =====================
// 회원가입 페이지
// =====================
exports.getRegister = (req, res) => {

    res.render('user/register');

};


// =====================
// 프로필 페이지
// =====================
exports.getProfile = (req, res) => {

    if (!req.user) {
        return res.redirect('/login');
    }

    const sql = `
        SELECT *
        FROM users
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [req.user.user_id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send('DB 오류');
            }

            if (result.length === 0) {
                return res.send('사용자 없음');
            }

            res.render(
                'user/profile',
                {
                    user: result[0]
                }
            );

        }
    );

};


// =====================
// 프로필 이미지 수정
// =====================
const jwt = require('jsonwebtoken');

exports.updateProfile = (req, res) => {

    const userId = req.user.user_id;
    const image = '/uploads/' + req.file.filename;

    const sql = `
        UPDATE users
        SET profile_image = ?
        WHERE user_id = ?
    `;

    db.query(sql, [image, userId], (err) => {

        if (err) throw err;

        // 중요: 기존 JWT 기반 + 새 이미지 반영
        const newToken = jwt.sign(
            {
                user_id: req.user.user_id,
                email: req.user.email,
                nickName: req.user.nickName,
                role: req.user.role,
                profile_image: image   // 여기 바뀐 값
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 쿠키 갱신
        res.cookie('token', newToken, {
            httpOnly: true
        });

        // 바로 공부게시판으로 이동
        res.redirect('/study');
    });
};


// =====================
// 회원정보 수정
// =====================
exports.updateUser = (req, res) => {

    if (!req.user) {
        return res.redirect('/login');
    }

    const {
        nickName
    } = req.body;

    const sql = `
        UPDATE users
        SET nickName = ?
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [
            nickName,
            req.user.user_id
        ],
        (err) => {

            if (err) {
                console.log(err);
                return res.send('수정 실패');
            }

            res.redirect(
                '/profile/' +
                req.user.user_id
            );

        }
    );

};