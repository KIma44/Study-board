const db = require('../config/db');

// 저장
exports.createStudyLog = (req, res) => {

    // 로그인 체크
    if (!req.session.user) {
        return res.send("로그인 후 이용하세요");
    }

    const { title, content, study_time, category } = req.body;

    // 수정 완료
    const user_id = req.session.user.user_id;

    const sql = `
        INSERT INTO study_logs 
        (user_id, title, content, study_time, category, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    db.query(
        sql,
        [user_id, title, content, study_time, category],
        (err) => {

            if (err) throw err;

            res.redirect('/study');
        }
    );
};

// 목록 조회
exports.getStudyLogs = (req, res) => {

    const sql = `
        SELECT study_logs.*, users.nickName
        FROM study_logs
        JOIN users 
        ON study_logs.user_id = users.user_id
        ORDER BY study_log_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) throw err;

        res.render('study/study', {
            logs: results,
            session: req.session
        });
    });
};

// 삭제
exports.deleteStudyLog = (req, res) => {

    const id = req.params.id;

    // 로그인 체크
    if (!req.session.user) {
        return res.send("로그인 필요");
    }

    const user = req.session.user;

    const sql = `
        SELECT *
        FROM study_logs
        WHERE study_log_id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) throw err;

        const log = result[0];

        if (!log) {
            return res.send("글 없음");
        }

        // 수정 완료
        if (
            user.user_id !== log.user_id &&
            user.role !== 'admin'
        ) {
            return res.send("권한 없음");
        }

        db.query(
            "DELETE FROM study_logs WHERE study_log_id = ?",
            [id],
            (err) => {

                if (err) throw err;

                res.redirect('/study');
            }
        );
    });
};

// 수정 페이지
exports.getEditPage = (req, res) => {

    if (!req.session.user) {
        return res.send("로그인 필요");
    }

    const id = req.params.id;

    db.query(
        "SELECT * FROM study_logs WHERE study_log_id = ?",
        [id],
        (err, result) => {

            if (err) throw err;

            const log = result[0];

            if (!log) {
                return res.send("글 없음");
            }

            // 권한 체크
            if (
                req.session.user.user_id !== log.user_id &&
                req.session.user.role !== 'admin'
            ) {
                return res.send("권한 없음");
            }

            res.render('study/studyEdit', {
                log
            });
        }
    );
};

// 수정 처리
exports.updateStudyLog = (req, res) => {

    if (!req.session.user) {
        return res.send("로그인 필요");
    }

    const id = req.params.id;

    const {
        title,
        content,
        study_time,
        category
    } = req.body;

    // 먼저 게시글 조회
    db.query(
        "SELECT * FROM study_logs WHERE study_log_id = ?",
        [id],
        (err, result) => {

            if (err) throw err;

            const log = result[0];

            if (!log) {
                return res.send("글 없음");
            }

            // 권한 체크
            if (
                req.session.user.user_id !== log.user_id &&
                req.session.user.role !== 'admin'
            ) {
                return res.send("권한 없음");
            }

            db.query(
                `
                UPDATE study_logs 
                SET 
                    title = ?,
                    content = ?,
                    study_time = ?,
                    category = ?,
                    updated_at = NOW()
                WHERE study_log_id = ?
                `,
                [
                    title,
                    content,
                    study_time,
                    category,
                    id
                ],
                (err) => {

                    if (err) throw err;

                    res.redirect('/study');
                }
            );
        }
    );
};

// 상세 보기
exports.getDetail = (req, res) => {

    const id = req.params.id;

    // 수정 완료
    const userId = req.session.user?.user_id;

    if (!userId) {
        return res.send("로그인 필요");
    }

    const sql = `
        SELECT *
        FROM study_logs
        WHERE study_log_id = ?
        AND user_id = ?
    `;

    db.query(sql, [id, userId], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("DB 오류");
        }

        if (result.length === 0) {
            return res.send("본인 게시글만 접근 가능합니다.");
        }

        // TODO 조회
        const todoSql = `
            SELECT *
            FROM todos
            WHERE study_log_id = ?
            AND user_id = ?
            ORDER BY todo_id DESC
        `;

        db.query(todoSql, [id, userId], (todoErr, todos) => {

            if (todoErr) {
                console.log(todoErr);
                return res.send("TODO DB 오류");
            }

            res.render('study/studyDetail', {
                post: result[0],
                todos: todos
            });
        });
    });
};