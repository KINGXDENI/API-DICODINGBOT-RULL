__path = process.cwd()

const express = require('express');
const router = express.Router();
const db = require(__path + '/database/db');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

async function sendVerificationEmail(email, userId, url) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'dicodingbot@gmail.com', // Ganti dengan alamat email Anda
            pass: 'sptertqxgqvpjgaz' // Ganti dengan kata sandi email Anda
        }
    });

    // Generate link aktivasi
    const activationLink = `${url}/activate?userId=${userId}`;

    const mailOptions = {
        from: 'DIBO <' + 'dicodingbot@gmail.com' + '>',
        to: email,
        subject: 'Email Verification',
        html: `
        <html>
        <head>
            <style>
            .container{
                font-family: Arial, sans-serif;
                background-color: #6d3f24;
                padding: 20px;
                widht: 4rem;
                border: 1px solid#ccc;
                border-radius: 5px;
                text-align:center;
            }

        h1{
            color: #fff;
            }
        p{
            font-size: 18px;
            color: #fff;
        }

        .btn-primary{
                background-color: #fff;
                color: #6d3f24;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                cursor: pointer;
            }

            .btn-primary:hover{
                background-color:#b96b3d;
                color: #fff;
            }
        </style>
    </head>

    <body>

        <div class="container">
                    <h1> Verifikasi Email </h1> 
                    <p> Silakan verifikasi alamat email Anda untuk mengaktifkan akun: </p>
                    <a href="${activationLink}" class="btn-primary"> Verifikasi Email </a> 
        </div> 
    </body>
</html>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

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

router.get('/activate', (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'Parameter userId diperlukan.'
        });
    }

    const collection = db.get('userDibo');

    // Cari pengguna berdasarkan userId dan set isActive menjadi true
    collection.update({
            _id: userId
        }, // Filter berdasarkan userId
        {
            $set: {
                isActive: true
            }
        }, // Operator $set untuk mengatur isActive menjadi true
        (err, result) => {
            if (err) {
                res.redirect('/?success=false');

            }

            if (result.n === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Pengguna tidak ditemukan.'
                });
            }

            res.redirect('/?success=true');
        }
    );
});

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
        const websiteUrl = `${req.protocol}://${req.get('host')}/user`;
        // Menambahkan field limit dan isActive dengan nilai default
        const newUser = {
            email,
            username,
            password,
            apiKey,
            limit: 999, // Nilai default limit
            isActive: false // Nilai default isActive
        };

        collection.insert(newUser, async (err, doc) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Gagal melakukan registrasi.'
                });
            } else {
                // Kirim email verifikasi
                const userId = doc._id;
                await sendVerificationEmail(email, userId, websiteUrl);

                res.status(200).json({
                    success: true,
                    message: 'Registrasi berhasil. Cek email Anda untuk verifikasi.'
                });
            }
        });
    });
});



router.post('/login', (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        // Validasi data (pastikan email dan password terisi)
        return res.status(400).json({
            success: false,
            message: 'Email dan password harus diisi.'
        });
    }

    const collection = db.get('userDibo'); // Ganti 'userDibo' dengan koleksi yang sesuai
    collection.findOne({
            email,
            password
        },
        (err, user) => {
            if (err) {
                // Penanganan kesalahan jika terjadi kesalahan database
                return res.status(500).json({
                    success: false,
                    message: 'Terjadi kesalahan pada server.'
                });
            }

            if (!user) {
                // Penanganan jika data pengguna tidak ditemukan
                return res.status(200).json({
                    success: false,
                    message: 'Login gagal. Email atau password salah.'
                });
            }

            if (!user.isActive) {
                return res.status(200).json({
                    success: false,
                    message: 'Login gagal. Akun tidak aktif. Silakan verifikasi email Anda.'
                });
            }

            // Jika login berhasil, Anda dapat mengatur sesi untuk menandai bahwa pengguna sudah login

            req.session.user = user._id;
            req.session.loggedIn = true;
            res.status(200).json({
                success: true,
                message: 'Login berhasil.',
                isActive: user.isActive
            });
        }
    );
});


router.get('/logout', (req, res) => {
    // Hapus sesi dan set loggedIn menjadi false
    req.session.loggedIn = false;
    res.redirect('/');
});

module.exports = router;