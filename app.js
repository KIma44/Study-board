const mysql = require('mysql2');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// =========================
// JWT 전역 사용자 세팅
// =========================
app.use((req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        res.locals.loginUser = null;
        return next();
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
                    req.user = null;
                    res.locals.loginUser = null;
                    return next();
                }

                req.user = result[0];         // 🔥 최신 DB 값
                res.locals.loginUser = result[0];

                next();
            }
        );

    } catch (err) {

        req.user = null;
        res.locals.loginUser = null;
        next();
    }
});


// =========================
// static
// =========================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/notice')));
app.use(express.static(path.join(__dirname, 'public/my')));
app.use(express.static(path.join(__dirname, 'public/study')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// =========================
// 메인 페이지 → 공부게시판 이동
// =========================
app.get('/', (req, res) => {
    res.redirect('/study');
});


// =========================
// routes
// =========================

// 로그인 / 회원가입
app.use('/', require('./routes/authRoute'));
app.use('/', require('./routes/userRoute'));

// 게시판
app.use('/post', require('./routes/postRoute'));
app.use('/study', require('./routes/studyRoute'));
app.use('/todo', require('./routes/todoRoute'));
app.use('/notice', require('./routes/noticeRoute'));
app.use('/', require('./routes/commentRoute'));
app.use('/', require('./routes/myPageRoute'));


// =========================
// DB
// =========================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1q2w3e4r',
    database: 'study'
});

db.connect((err) => {

    if (err) {
        console.log('DB 연결 실패:', err);
    } else {
        console.log('DB 연결 성공');
    }

});


// =========================
// View Engine
// =========================
app.set('view engine', 'ejs');


// =========================
// 서버 실행
// =========================
app.listen(3000, () => {
    console.log('서버 실행: http://localhost:3000');
});