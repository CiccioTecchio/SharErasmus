var express = require('express');
var router = express.Router();
var studente = require('../model/Studente.js');
var coordinatore = require('../model/Coordinatore.js');
let singleton = require('../singleton/singleton');
const Op = singleton.Op;

//All Users in chat

//todo da aggiungere i dovuti catch
router.get('/chatlist', function (req, res) {
    let allUsers = [];
    studente.findAll({
        attributes: ['nome', 'cognome', 'Email_Studente'],
        order: ['nome']
    }).then(allStudenti => {
        allUsers.push(allStudenti);
        coordinatore.findAll({
            attributes: ['nome', 'cognome','Email_Coordinatore'],
            order: ['nome']
        }).then(allCoordinatori => {
            allUsers.push(allCoordinatori);
            res.send(allUsers);
        })
    })
});
module.exports = router;