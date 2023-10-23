__path = process.cwd()

var express = require('express');
var router = express.Router();
const session = require('express-session');
router.use(session({
    secret: 'secret-key', // Ganti dengan kunci rahasia yang aman
    resave: false,
    saveUninitialized: true
}));
router.get('/docs', (req, res) => {
    if (req.session.loggedIn) {
        // Pengguna sudah login, tampilkan halaman /docs
        res.sendFile(__path + '/views/docs.html')
    } else {
        // Pengguna belum login, alihkan ke halaman login atau tampilkan pesan kesalahan
        res.redirect('/'); // Ganti '/login' dengan URL halaman login Anda
    }

})
router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        // Pengguna sudah login, tampilkan halaman /docs
        res.redirect('/docs');
    } else {
        // Pengguna belum login, alihkan ke halaman login atau tampilkan pesan kesalahan
        res.sendFile(__path + '/views/login.html') // Ganti '/login' dengan URL halaman login Anda
    }

})
router.get('/api/game', (req, res) => {
    res.sendFile(__path + '/views/game.html')
})
router.get('/register', (req, res) => {
    if (req.session.loggedIn) {
        // Pengguna sudah login, tampilkan halaman /docs
        res.redirect('/docs');
    } else {
        // Pengguna belum login, alihkan ke halaman login atau tampilkan pesan kesalahan
        res.sendFile(__path + '/views/regist.html')
    }

})

router.get('/error', (req, res) => {
    res.sendFile(__path + '/views/404.html')
})

router.get('/about', (req, res) => {
    res.sendFile(__path + '/views/about.html')
})

module.exports = router