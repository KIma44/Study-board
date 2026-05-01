const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 라우터 연결
const postRouter = require('./routes/post');
app.use('/', postRouter);

app.listen(3000, () => {
    console.log('서버 실행');
});