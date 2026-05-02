exports.isLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.send('로그인 필요');
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.session.user.role !== 'admin') {
        return res.send('관리자만 접근 가능');
    }
    next();
};