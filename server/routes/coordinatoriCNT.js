let express = require('express');
let route = express.Router();
let timeline = require('../model/timeline');
let singleton = require('../singleton/singleton');
let studente = require('../model/Studente');

const Op = singleton.Op;


route.get('/createLista', function(req, res) {
    var help= timeline.findAll({
        where:
            {
                emailCoordinatore : {[Op.like]: "fferrucci@unisa.it"} 
            },
            include: [studente]
    })
    .then(doc => res.send(doc.body).status(200).end())
    .catch(err => res.sendStatus(404).end(err));
});

module.exports= route;