let express = require('express');
let route = express.Router();

/* GET home page. */
route.get('/', function(req, res) {
    res.redirect('/index.html');
});

/*
route.get('/Home', function(req, res){
    res.sendFile("C:/Users/Silvio Corso/Desktop/IS/Git/SharErasmus/docs/index.html");
});
*/


module.exports = route;
