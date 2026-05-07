const db = require('../config/db');

// TODO 목록 (특정 글)
exports.getTodo = (req, res) => {
    const id = req.params.id;
    const userId = req.session.user?.id;

    if (!userId) return res.send("로그인 필요");

    const sql = `
    SELECT * FROM todos 
    WHERE study_log_id = ? 
    AND user_id = ?
    ORDER BY todo_id DESC
    `;

    db.query(sql, [id, userId], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("DB 오류");
        }

        res.render('todo/todo', {
            todos: result,
            study_log_id: id
        });
    });
};

// 전체 TODO
exports.getAllTodo = (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) return res.send("로그인 필요");

    const sql = `
        SELECT 
            todo_id,
            content,
            is_completed,
            created_at,
            updated_at
        FROM todos
        WHERE user_id = ?
        ORDER BY todo_id DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("DB 오류");
        }

        res.render('todo/todo', {
            todos: result,
            study_log_id: null
        });
    });
};

// 추가
exports.addTodo = (req, res) => {
    const { content, study_log_id } = req.body;
    const userId = req.session.user?.id;

    if (!userId) return res.send("로그인 필요");

    const sql = `
        INSERT INTO todos (content, user_id, study_log_id)
        VALUES (?, ?, ?)
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

// 체크
exports.toggleTodo = (req, res) => {
    const id = req.params.id;
    const userId = req.session.user?.id;

    if (!userId) return res.send("로그인 필요");

    const sql = `
        UPDATE todos 
        SET is_completed = NOT is_completed
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
    const userId = req.session.user?.id;

    if (!userId) return res.send("로그인 필요");

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
    const userId = req.session.user?.id;

    if (!userId) return res.send("로그인 필요");

    const sql = `
        UPDATE todos 
        SET content = ?, updated_at = NOW()
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