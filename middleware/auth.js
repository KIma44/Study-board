exports.isLogin = (req, res, next) => {
    if (!req.session.user) {
        
    if (!req.session.user) {
        return res.redirect('/login?error=login');
    }

    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.session.user.role !== 'admin') {
        return res.send('관리자만 접근 가능');
    }
    next();
};