const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// 회원가입
exports.register = async (req,res)=>{

    const {
        email,
        password,
        nickName
    } = req.body;

    try{

        const hash =
            await bcrypt.hash(password,10);

        const sql = `
        INSERT INTO users
        (
            email,
            password,
            nickName
        )
        VALUES
        (?, ?, ?)
        `;

        db.query(
            sql,
            [
                email,
                hash,
                nickName
            ],
            (err)=>{

                if(err){
                    console.log(err);
                    return res.send('회원가입 실패');
                }

                res.redirect('/login');

            }
        );

    }catch(err){

        console.log(err);

        res.send('에러 발생');

    }

};


// 로그인
exports.login = (req,res)=>{

    const {
        email,
        password
    } = req.body;

    const sql=`
    SELECT *
    FROM users
    WHERE email=?
    `;

    db.query(
        sql,
        [email],
        async(err,results)=>{

            if(err) throw err;

            if(results.length===0){

                return res.send(
                    '이메일 없음'
                );

            }

            const user = results[0];

            const isMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if(!isMatch){

                return res.send(
                    '비밀번호 틀림'
                );

            }

            const token =
            jwt.sign(
            {
                user_id:user.user_id,
                email:user.email,
                nickName:user.nickName,
                role:user.role,
                profile_image:user.profile_image
            },
            process.env.JWT_SECRET,
            {
                expiresIn:'1h'
            });

            res.cookie(
                'token',
                token,
                {
                    httpOnly:true
                }
            );

            res.redirect('/');

        }
    );

};