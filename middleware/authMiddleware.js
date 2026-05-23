const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.verifyToken = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login'); // ✅ 차단
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        db.query(
            `SELECT user_id, nickName, profile_image, role 
             FROM users 
             WHERE user_id = ?`,
            [decoded.user_id],
            (err, result) => {

                if (err || result.length === 0) {
                    return res.redirect('/login');
                }

                req.user = result[0];
                next();
            }
        );

    } catch (err) {
        return res.redirect('/login');
    }
};


// 관리자 체크
exports.isAdmin = (req, res, next) => {

    if (!req.user || req.user.role !== 'admin') {
        return res.send("관리자만 접근 가능");
    }

    next();
};