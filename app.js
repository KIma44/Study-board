const mysql = require('mysql2');
const express = require('express');
const session = require('express-session'); 

const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

//  세션 먼저 등록
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

//  EJS에서 session 사용 가능하게
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// 라우터
const userRoutes = require('./routes/userRoute');
app.use('/', userRoutes);

const postRoutes = require('./routes/postRoute');
app.use('/', postRoutes);

const commentRoutes = require('./routes/commentRoute');
app.use('/', commentRoutes);

// DB 연결
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1q2w3e4r',
    database: 'study'
});

db.connect((err) => {
    if (err) {
        console.error('DB 연결 실패:', err);
    } else {
        console.log('DB 연결 성공');
    }
});

app.set('view engine', 'ejs');


app.listen(3000, () => {
    console.log('서버 실행');
});