let express = require('express');
let route = express.Router();
let fs=require('fs');
let timeline = require('../model/timeline');
let singleton = require('../singleton/singleton');
let studente = require('../model/Studente');

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

module.exports= route;