let express = require('express');
let route = express.Router();
let fs=require('fs');
let timeline = require('../model/Timeline');
let singleton = require('../singleton/singleton');
let studente = require('../model/Studente');
let documento = require('../model/Documento');
let votazione = require('../model/Votazione');
const bodyParser = require("body-parser");

route.use(bodyParser.urlencoded({
    extended: true
}));

route.use(bodyParser.json());




const Op = singleton.Op;
/*
route.get('/createMarkers',function(req,res){
    timeline.findAll({
            include:
            [{
                model: studente,
                required: true
            }],
            
    })
    .then(doc => res.send(doc).status(200).end())
    .catch(err => res.sendStatus(409).end(err));
})
*/

route.get('/createMarkers',function(req,res){
    timeline.findAll({
        group: "citta"})
    .then(doc => res.send(doc).status(200).end())
    .catch(err => res.sendStatus(409).end(err));
})

route.get('/obtainNumber',function(req,res){
    timeline.count({
        where: {
            citta : {[Op.like]: req.query.city}
        }
    })
    .then(doc => res.json(doc))
    .catch(err => res.sendStatus(409).end(err));
})

route.get('/createLista', function(req, res) {
   let help = timeline.findAll({
        where:
        {
            emailCoordinatore : {[Op.like]: "fferrucci@unisa.it"} 
        },
        include: 
            [{
                model: studente,
                required: true,
            }]
    })
    .then(doc => res.send(doc).status(200).end())
    .catch(err => res.sendStatus(409).end(err));
});

route.get('/userTimeline' , function(req, res){
    let userMail = "s.breve@studenti.unisa.it";
    let cordMail = "fferrucci@unisa.it";
    let userData = timeline.findAll({
        where:
        {
            emailStudente : {[Op.like]: userMail},
            emailCoordinatore : {[Op.like]: cordMail} 
        },
        include: 
        [{
            model: studente, votazione,
            required: true,
        }]
    })
    .then(doc => res.send(doc).status(200).end())
    .catch(err => res.sendStatus(409).end(err));
});

route.get('/userDocument' , function(req, res){
    let userDocument = documento.findAll({
        where:
        {
            idTimeline : {[Op.like]: "1"} 
        }
    })
    .then(doc => res.send(doc).status(200).end())
    .catch(err => res.sendStatus(409).end(err));
});

route.get('/userVotes' , function(req, res){
    let userDocument = votazione.findAll({
        where:
        {
            idTimeline : {[Op.like]: "1"} 
        }
    })
    .then(doc => res.send(doc).status(200).end())
    .catch(err => res.sendStatus(409).end(err));
});


route.get('/examList' , function(req, res){
    let votazione = votazione.findAll({
        where:
        {
            idTimeline : {[Op.like]: "1"} 
        }
    })
    .then(doc => res.send(doc).status(200).end())
    .catch(err => res.sendStatus(409).end(err));
});



route.get('/matchVote',function(req,res){
    res.setHeader('Content-Type', 'application/json');
    if(req.body.vote1 == "A")
        {
            res.send(JSON.stringify({"suggestedVote" : "30,29,28,27"}));
        }
    if(req.body.vote1 == "B")
        {
            res.send(JSON.stringify({"suggestedVote" : "26,25,24,23"}));
        }
    if(req.body.vote1 == "C")
        {
            res.send(JSON.stringify({"suggestedVote" : "22,21,20"}));
        }
    if(req.body.vote1 == "D")
        {
            res.send(JSON.stringify({"suggestedVote" : "19,18"}));   
        }
})

route.get('/createVote',function(req,res){
    votazione.create({"idTimeline": "1", "emailStudente": "s.breve@studenti.unisa.it", "nomeEsame": req.query.nomeEsame ,"votoIta": req.query.votoIta , "esameEstero":req.query.esameEstero, "votoEstero":req.query.votoEstero})
    .then(doc => res.send(doc).status(200).end())
    .catch(err => res.sendStatus(409).end(err));
})

route.get('/deleteVote',function(req,res){
    votazione.destroy({where:{ "idTimeline": req.query.idTimeline, "nomeEsame": req.query.nomeEsame }})
    .then(doc => res.send(doc).status(200).end())
    .catch(err => res.sendStatus(409).end(err));
})

/*
route.delete('/deleteVote', function(req, res){
    user.destroy({where:{ "idTimeline": req.query.idTimeline, "nomeEsame": req.query.nomeEsame }})
        .then(doc => res.send(doc.body).status(200).end())
        .catch(err => res.sendStatus(404).end(err));
});
*/
module.exports= route;