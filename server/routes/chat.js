var express = require('express');
var router = express.Router();
var studente = require('../model/Studente.js');
var coordinatore = require('../model/Coordinatore.js');
let singleton = require('../singleton/singleton');
const Op = singleton.Op;

//All Users in chat

router.post('/chatList'),function(req,res){
    var allStudents = studente.findAll({
        attributes:['nome','cognome'],
        order:['nome']
    })
    .then(doc => res.send(doc.body).status(200).end())
        .catch(err => res.sendStatus(404).end(err));
   /* var allCoordinatori =coordinatore.findAll({
        attributes:['nome','cognome'],
        order:['nome']
    });
    return Promise.all([allStudents,allCoordinatori]);
    */
   
}
module.exports = router;
