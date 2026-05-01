const mysql = require('mysql2');

// DB 연결
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1q2w3e4r', // MySql 비번
    database: 'study'
});

db.connect((err) => {
    if (err) {
        console.log('DB 연결 실패:', err);
    } else {
        console.log('DB 연결 성공');
    }
});

module.exports = db;