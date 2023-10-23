//yy
__path = process.cwd();
//var favicon = require('serve-favicon');
var express = require('express'),
    cors = require('cors'),
    secure = require('ssl-express-www');
var db = require(__path + '/database/db');
const session = require('express-session');
const PORT = process.env.PORT || 8080 || 5000 || 3000
var {
    color
} = require('./lib/color.js')


var mainrouter = require('./routes/main'),
    apirouter = require('./routes/api'),
    userrouter = require('./routes/user')
const router = express.Router();
var app = express()
app.enable('trust proxy');
app.set("json spaces", 2)
app.use(cors())
app.use(secure)
app.use(express.static("public"))

app.use(session({
    secret: 'secret-key', // Ganti dengan kunci rahasia yang aman
    resave: false,
    saveUninitialized: true
}));

app.use('/', mainrouter);
app.use('/api', apirouter);
app.use('/user', userrouter);

app.listen(PORT, () => {
    console.log(color("Server running on port " + PORT, 'green'))
})

module.exports = app