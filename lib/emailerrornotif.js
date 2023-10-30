const nodemailer = require('nodemailer');

async function sendErrorEmail(text, currentUrl) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'dicodingbot@gmail.com', // Ganti dengan alamat email Anda
            pass: 'sptertqxgqvpjgaz' // Ganti dengan kata sandi email Anda
        }
    });

    const mailOptions = {
        from: 'DIBO <' + 'dicodingbot@gmail.com' + '>',
        to: 'dicodingbot@gmail.com',
        subject: 'Error Notification',
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
                <h1> Error Notification </h1> 
                <p> Hai developer, ada yang error. pada url ${currentUrl} </p>
                <p> ${text}</p>
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

module.exports = sendErrorEmail;
