const db = require('../config/db');


// 공부 기록 작성
exports.createStudyLog = (req, res) => {

    const user_id = req.user.user_id;

    const {
        title,
        content,
        study_time,
        category,
        todo_content
    } = req.body;

    const sql = `
        INSERT INTO study_logs
        (user_id, title, content, study_time, category, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    db.query(sql, [user_id, title, content, study_time, category], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("DB 오류");
        }

        const studyLogId = result.insertId;

        // TODO 없으면 종료
        if (!todo_content || todo_content.trim() === '') {
            return res.redirect('/study');
        }

        const todoSql = `
            INSERT INTO todos
            (content, user_id, study_log_id, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW())
        `;

        db.query(todoSql, [todo_content, user_id, studyLogId], (todoErr) => {

            if (todoErr) {
                console.log(todoErr);
                return res.send("TODO 저장 오류");
            }

            res.redirect('/study');
        });
    });
};



// 목록 조회 + 검색 + 페이지
exports.getStudyLogs = (req, res) => {

    const type = req.query.type || 'all';
    const keyword = req.query.keyword || '';

    const page = parseInt(req.query.page) || 1;

    const limit = 10;
    const offset = (page - 1) * limit;

    let whereSql = '';
    let values = [];

    // 검색
    if (keyword) {

        if (type === 'title') {

            whereSql = `
                WHERE study_logs.title LIKE ?
            `;

            values.push(`%${keyword}%`);

        }

        else if (type === 'content') {

            whereSql = `
                WHERE study_logs.content LIKE ?
            `;

            values.push(`%${keyword}%`);

        }

        else if (type === 'writer') {

            whereSql = `
                WHERE users.nickName LIKE ?
            `;

            values.push(`%${keyword}%`);

        }

        else {

            whereSql = `
                WHERE
                study_logs.title LIKE ?
                OR study_logs.content LIKE ?
                OR users.nickName LIKE ?
            `;

            values.push(
                `%${keyword}%`,
                `%${keyword}%`,
                `%${keyword}%`
            );

        }

    }

    // 전체 게시글 수
    const countSql = `
        SELECT COUNT(*) AS total
        FROM study_logs
        JOIN users
        ON study_logs.user_id = users.user_id
        ${whereSql}
    `;

    db.query(countSql, values, (err, countResult) => {

        if (err) throw err;

        const totalPosts = countResult[0].total;

        const totalPages = Math.ceil(
            totalPosts / limit
        );

        // 게시글 목록 조회
        const sql = `
            SELECT study_logs.*, users.nickName
            FROM study_logs
            JOIN users
            ON study_logs.user_id = users.user_id
            ${whereSql}
            ORDER BY study_log_id DESC
            LIMIT ?
            OFFSET ?
        `;

        db.query(
            sql,
            [...values, limit, offset],
            (err, results) => {

                if (err) throw err;

                res.render(
                    'study/study',
                    {
                        logs: results,
                        loginUser: req.user || null,

                        currentPage: page,
                        totalPages,

                        type,
                        keyword
                    }
                );

            }
        );

    });

};


//  삭제
exports.deleteStudyLog = (req, res) => {

    const id = req.params.id;
    const user = req.user;

    const sql = `
        SELECT * FROM study_logs WHERE study_log_id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) throw err;

        const log = result[0];

        if (!log) {
            return res.send("글 없음");
        }

        // 권한 체크
        if (user.user_id !== log.user_id && user.role !== 'admin') {
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
            if (req.user.user_id !== log.user_id && req.user.role !== 'admin') {
                return res.send("권한 없음");
            }

            res.render('study/studyEdit', {
                log
            });
        }
    );
};


//  수정 처리
exports.updateStudyLog = (req, res) => {

    const id = req.params.id;

    const {
        title,
        content,
        study_time,
        category
    } = req.body;

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
            if (req.user.user_id !== log.user_id && req.user.role !== 'admin') {
                return res.send("권한 없음");
            }

            db.query(
                `
                UPDATE study_logs
                SET title=?, content=?, study_time=?, category=?, updated_at=NOW()
                WHERE study_log_id=?
                `,
                [title, content, study_time, category, id],
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

    const sql = `
        SELECT study_logs.*, users.nickName
        FROM study_logs
        JOIN users
        ON study_logs.user_id = users.user_id
        WHERE study_log_id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) throw err;

        const log = result[0];

        if (!log) {
            return res.send("글 없음");
        }

        res.render(
            'study/studyDetail',
            {
                log,
                loginUser: req.user || null
            }
        );

    });
};



//  작성 페이지
exports.getWritePage = (req, res) => {

    if (!req.user) {
        return res.redirect('/login?error=login');
    }

    res.render('study/studyWrite');
};