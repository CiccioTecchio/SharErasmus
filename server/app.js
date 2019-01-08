let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let path = require('path');


let forumRoute = require('./routes/forumCNT');
let userRouter = require('./routes/userCNT');
let coordRoute = require('./routes/coordinatoriCNT');
let upload = require('express-fileupload');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'docs')));
app.use(cookieParser());

app.use('/forum', forumRoute);
app.use('/user', userRouter);
app.use(upload());
app.use('/coordinatore', coordRoute);

let server = app.listen(3000, "127.0.0.1", function () {
    let address = server.address().address;
    let port = server.address().port;
    console.log("Listening on " + address + ":" + port);
});

module.exports = app;
