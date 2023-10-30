__path = process.cwd();
var favicon = require('serve-favicon');
var express = require('express'),
    cors = require('cors'),
    secure = require('ssl-express-www');
var db = require(__path + '/database/db');
const PORT = process.env.PORT || 8080 || 5000 || 3000
var {
    color
} = require('./lib/color.js')


const mainrouter = require('./routes/main')
const apirouter = require('./routes/api')
const userrouter = require('./routes/user')

var app = express()
app.enable('trust proxy');
app.set("json spaces", 2)
app.use(cors())
app.use(secure)
app.use(express.static("public"))
app.set('view engine', 'ejs');
app.set('views', (__path, 'views'));

app.use('/', mainrouter);
app.use('/api', apirouter);
app.use('/user', userrouter);

app.listen(PORT, () => {
    console.log(color("Server running on port " + PORT, 'green'))
})

module.exports = app