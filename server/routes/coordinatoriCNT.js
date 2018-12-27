let express = require('express');
let route = express.Router();
let fs=require('fs');
let timeline = require('../model/timeline');
let singleton = require('../singleton/singleton');
let studente = require('../model/Studente');
let votazione = require('../model/Votazione');

const Op = singleton.Op;


route.get('/studentsList', function(req, res){
    fs.readFile('../docs/students_list.html',   function (err, data) {
        res.setHeader('Content-Type', 'text/html');
        res.send(data);
    });
});

route.get('/createLista', function(req, res) {
    timeline.findAll({
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
        .catch(err => res.sendStatus(404).end(err));
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
    votazione.create({"idTimeline": "1", "emailStudente": "s.corso1@studenti.unisa.it", "nomeEsame": req.body.examName ,"voto": req.body.selectedVote})
    .then(doc => res.send(doc).status(200).end())
    .catch(err => res.sendStatus(409).end(err));
})

module.exports= route;