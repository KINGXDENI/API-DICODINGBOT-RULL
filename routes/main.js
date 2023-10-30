__path = process.cwd()

var express = require('express');
var router = express.Router();
const session = require('express-session');
const db = require(__path + '/database/db');
router.use(session({
    secret: 'rahasia', // Ganti dengan rahasia sesi Anda
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 4 * 60 * 60 * 1000
    } // 4 jam dalam milidetik
}));
function updateUptime() {
    const uptimeInSeconds = Math.floor(process.uptime());
    const days = Math.floor(uptimeInSeconds / 86400);
    const hours = Math.floor((uptimeInSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = uptimeInSeconds % 60;
    return `${days} hari ${hours} jam ${minutes} menit ${seconds} detik`;
}
router.get('/docs', async (req, res) => {
    if (req.session.loggedIn) {
        const userId = req.session.user; // Mengambil ID pengguna dari sesi

        try {
            const users = db.get('userDibo'); // Mengambil koleksi 'users' dari database
            const user = await users.findOne({
                _id: userId
            });

            if (user) {
                const uptime = updateUptime()
                res.render('docs', {
                    uptime: uptime,
                    user: user
                });
            } else {
                res.redirect('/')
            }
        } catch (error) {
            console.error(error);
            res.redirect('/error'); // Alihkan ke halaman kesalahan jika terjadi kesalahan
        }
    } else {
        res.redirect('/'); // Pengguna belum login, alihkan ke halaman login atau tampilkan pesan kesalahan
    }
});
router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        // Pengguna sudah login, tampilkan halaman /docs
        res.redirect('/docs');
    } else {
        // Pengguna belum login, alihkan ke halaman login atau tampilkan pesan kesalahan
        res.render('login'); // Ganti '/login' dengan URL halaman login Anda
    }
});

router.get('/api/game', (req, res) => {
    res.render('game');
});

router.get('/register', (req, res) => {
    if (req.session.loggedIn) {
        // Pengguna sudah login, tampilkan halaman /docs
        res.redirect('/docs');
    } else {
        // Pengguna belum login, alihkan ke halaman login atau tampilkan pesan kesalahan
        res.render('regist');
    }
});

router.get('/error', (req, res) => {
    res.render('404');
});

router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router