let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //necessaria per index.html
app.use(cookieParser());

app.use('/', indexRouter);

let server = app.listen(3000, "127.0.0.1", function () {
    let address = server.address().address;
    let port = server.address().port;
    console.log("Listening on "+address+":"+port);
});

module.exports = app;
