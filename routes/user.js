const express = require('express');
const router = express.Router();
const db = require(__path + '/database/db');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

function generateApiKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const apiKeyLength = 5;
    let apiKey = '';
    for (let i = 0; i < apiKeyLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        apiKey += characters.charAt(randomIndex);
    }
    return apiKey;
}

router.post('/register', (req, res) => {
    const {
        email,
        username,
        password
    } = req.body;

    if (!email || !username || !password) {
        // Validasi data (pastikan semua field terisi)
        return res.status(400).json({
            success: false,
            message: 'Semua field harus diisi.'
        });
    }

    const collection = db.get('userDibo');

    // Cek apakah email atau username sudah digunakan
    collection.findOne({
        $or: [{
            email: email
        }, {
            username: username
        }]
    }, (err, user) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan pada server.'
            });
        }

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Email atau username sudah digunakan.'
            });
        }

        // Jika data valid dan tidak ada konflik, tambahkan ke database
        const apiKey = generateApiKey();
        collection.insert({
            email,
            username,
            password,
            apiKey // Menambahkan apiKey ke data registrasi
        }, (err, doc) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Gagal melakukan registrasi.'
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Registrasi berhasil.',
                    apiKey // Mengirimkan apiKey sebagai respons sukses
                });
            }
        });
    });
});


router.post('/login', (req, res) => {
    const {
        username,
        password
    } = req.body;

    if (!username || !password) {
        // Validasi data (pastikan username dan password terisi)
        return res.status(400).json({
            success: false,
            message: 'Username dan password harus diisi.'
        });
    }

    const collection = db.get('userDibo'); // Ganti 'userDibo' dengan koleksi yang sesuai
    collection.findOne({
        username,
        password
    }, (err, user) => {
        if (err) {
            // Penanganan kesalahan jika terjadi kesalahan database
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan pada server.'
            });
        }

        if (!user) {
            // Penanganan jika data pengguna tidak ditemukan
            return res.status(401).json({
                success: false,
                message: 'Login gagal. Username atau password salah.'
            });
        }

        // Jika login berhasil, Anda dapat mengatur sesi untuk menandai bahwa pengguna sudah login

        const users = {
            username: user.username,
            email: user.email,
            apiKey: user.apiKey
        };
        req.session.loggedIn = true;

        res.status(200).json({
            success: true,
            message: 'Login berhasil.',
            users
        });
    });
});

router.get('/logout', (req, res) => {
    // Hapus sesi dan set loggedIn menjadi false
    req.session.loggedIn = false;
    res.redirect('/');
});

module.exports = router;