let express = require('express');
let router = express.Router();
let studente = require('../model/Studente.js');
let coordinatore = require('../model/Coordinatore.js');
let singleton = require('../singleton/singleton');
const Op = singleton.Op;
const credeFb= require('../routes/credeFb.json'); 
//All Users in chat

router.get('/credenziali', function(req, res){
    res.send(credeFb);
});

router.get('/chatlist', function (req, res) {
    let allUsers = [];
    studente.findAll({
        attributes: ['nome', 'cognome', 'emailStudente', 'imgProfiloPath'],
        order: ['nome']
    }).then(allStudenti => {
        allUsers.push(allStudenti);
        coordinatore.findAll({
            attributes: ['nome', 'cognome', 'emailCoordinatore', 'imgProfiloPath'],
            order: ['nome']
        }).then(allCoordinatori => {
            allUsers.push(allCoordinatori);
            res.send(allUsers);
        })
           // .catch(err => res.sendStatus(404).end(err));
    })
       // .catch(err => res.sendStatus(404).end(err));
});


//Search user
router.get('/cercaUtente', function(req, res){
    let allUsers = [];
    studente.findAll({
        attributes: ['nome', 'cognome', 'emailStudente', 'imgProfiloPath'],
        where:{
            nome :{[Op.like]: req.query.trovaUser +'%'}
        }
         
        
    }).then(allStudenti => {
        allUsers.push(allStudenti);
        coordinatore.findAll({
            attributes: ['nome', 'cognome', 'emailCoordinatore', 'imgProfiloPath'],
            
            where:{
                nome :{[Op.like]: req.query.trovaUser +'%'}
            }
            
        }).then(allCoordinatori => {
            allUsers.push(allCoordinatori);
            res.send(allUsers);
        })

            .catch(err => res.sendStatus(404).end(err));
    })
        .catch(err => res.sendStatus(404).end(err));
});


module.exports = router;

