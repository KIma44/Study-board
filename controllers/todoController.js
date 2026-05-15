const db = require('../config/db');

// 특정 공부 TODO
exports.getTodo = (req, res) => {

    const study_log_id = req.params.id;
    const userId = req.session.user?.user_id;

    // 로그인 체크
    if (!userId) {
        return res.redirect('/login?error=login');
    }

    // 공부 제목 가져오기
    const studySql = `
        SELECT title
        FROM study_logs
        WHERE study_log_id = ?
    `;

    // TODO 가져오기
    const todoSql = `
        SELECT *
        FROM todos
        WHERE study_log_id = ?
        AND user_id = ?
        ORDER BY todo_id DESC
    `;

    db.query(studySql, [study_log_id], (err, studyResult) => {

        if (err) {
            console.log(err);
            return res.send("DB 오류");
        }

        db.query(todoSql, [study_log_id, userId], (err, todos) => {

            if (err) {
                console.log(err);
                return res.send("DB 오류");
            }

            res.render('todo/todo', {
                todos,
                study_log_id,
                studyTitle: studyResult[0]?.title || '제목 없음'
            });

        });

    });

};


// 전체 TODO
exports.getAllTodo = (req, res) => {

    const userId = req.session.user?.user_id;

    // 로그인 체크
    if (!userId) {
        return res.redirect('/login?error=login');
    }

    const sql = `
        SELECT
            t.todo_id,
            t.content,
            t.is_completed,
            t.created_at,
            t.updated_at,
            s.title AS study_title
        FROM todos t
        LEFT JOIN study_logs s
        ON t.study_log_id = s.study_log_id
        WHERE t.user_id = ?
        ORDER BY t.todo_id DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("DB 오류");
        }

        res.render('todo/todo', {
            todos: result,
            study_log_id: null,
            studyTitle: '전체 TODO'
        });

    });

};


// TODO 추가
exports.addTodo = (req, res) => {

    const { content, study_log_id } = req.body;

    const userId = req.session.user?.user_id;

    // 로그인 체크
    if (!userId) {
        return res.redirect('/login?error=login');
    }

    const sql = `
        INSERT INTO todos 
        (
            content,
            user_id,
            study_log_id,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, NOW(), NOW())
    `;

    db.query(
        sql,
        [content, userId, study_log_id || null],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("DB 오류");
            }

            res.redirect(req.get('Referer'));
        }
    );
};


// 체크 토글
exports.toggleTodo = (req, res) => {

    const id = req.params.id;

    const userId = req.session.user?.user_id;

    // 로그인 체크
    if (!userId) {
        return res.redirect('/login?error=login');
    }

    const sql = `
        UPDATE todos
        SET 
            is_completed = NOT is_completed,
            updated_at = NOW()
        WHERE todo_id = ?
        AND user_id = ?
    `;

    db.query(sql, [id, userId], (err) => {

        if (err) {
            console.log(err);
            return res.send("DB 오류");
        }

        res.redirect(req.get('Referer'));
    });

};


// 삭제
exports.deleteTodo = (req, res) => {

    const id = req.params.id;

    const userId = req.session.user?.user_id;

    // 로그인 체크
    if (!userId) {
        return res.redirect('/login?error=login');
    }

    const sql = `
        DELETE FROM todos
        WHERE todo_id = ?
        AND user_id = ?
    `;

    db.query(sql, [id, userId], (err) => {

        if (err) {
            console.log(err);
            return res.send("DB 오류");
        }

        res.redirect(req.get('Referer'));
    });

};


// 수정
exports.updateTodo = (req, res) => {

    const id = req.params.id;

    const { content } = req.body;

    const userId = req.session.user?.user_id;

    // 로그인 체크
    if (!userId) {
        return res.redirect('/login?error=login');
    }

    const sql = `
        UPDATE todos
        SET 
            content = ?,
            updated_at = NOW()
        WHERE todo_id = ?
        AND user_id = ?
    `;

    db.query(sql, [content, id, userId], (err) => {

        if (err) {
            console.log(err);
            return res.send("DB 오류");
        }

        res.redirect(req.get('Referer'));
    });

};