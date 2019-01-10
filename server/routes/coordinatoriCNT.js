let express = require('express');
let route = express.Router();
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


route.post("/findEmail", function(req, res){
    singleton.query("SELECT emailStudente FROM studente WHERE studente.emailStudente NOT IN(SELECT timeline.emailStudente FROM timeline LEFT JOIN studente ON timeline.emailStudente = studente.emailStudente WHERE emailCoordinatore LIKE 'fferrucci@unisa.it' GROUP BY studente.emailStudente)", { type: singleton.QueryTypes.SELECT })
        .then(function(doc) {
            if(doc == "")
            {
                res.send("{}");
            }
            else{
                let convertedDoc = JSON.stringify(doc);
                res.send(convertedDoc);
            }
        }
        )
        .catch(err => res.sendStatus(409).end(err));
});

route.post('/addStudentToList', function (req, res) {
    let obj = req.body;
    timeline.create({
        "progresso": 0,
        "emailStudente": obj.student,
        "emailCoordinatore": "fferrucci@unisa.it",
        "citta": obj.citta,
        "nazione": obj.nation
    })
        .then(res.redirect("../students_list.html"))
        .catch(err => res.sendStatus(409).end(err));
});

route.get('/createMarkers', function (req, res) {
    timeline.findAll({
        group: "citta"
    })
        .then(doc => res.send(doc).status(200).end())
        .catch(err => res.sendStatus(409).end(err));
});

route.get('/obtainNumber', function (req, res) {
    timeline.count({
        where: {
            citta: { [Op.like]: req.query.city }
        }
    })
        .then(doc => res.json(doc))
        .catch(err => res.sendStatus(409).end(err));
});

route.get('/createLista', function (req, res) {
    timeline.findAll({
        where:
        {
            emailCoordinatore: { [Op.like]: "fferrucci@unisa.it" }
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


route.get('/userTimeline', function (req, res) {
    
    timeline.findAll({
        where:
        {
            idTimeline : { [Op.like] : req.query.idTimeline}
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

route.get('/userDocument', function (req, res) {
    documento.findAll({
        where:
        {
            idTimeline: { [Op.like]: req.query.idTimeline }
        }
    })
        .then(doc => res.send(doc).status(200).end())
        .catch(err => res.sendStatus(409).end(err));
});


route.get('/examList', function (req, res) {
    votazione.findAll({
        where:
        {
            idTimeline: { [Op.like]: req.query.idTimeline }
        }
    })
        .then(doc => res.send(doc).status(200).end())
        .catch(err => res.sendStatus(409).end(err));
});

route.get('/examNames', function (req, res) {
    votazione.findAll({
        group: "nomeEsame"
    })
        .then(doc => res.send(doc).status(200).end())
        .catch(err => res.sendStatus(409).end(err));
});

route.get('/matchVote', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.vote1 == "A") {
        res.send(JSON.stringify({ "suggestedVote": "30,29,28,27" }));
    }
    if (req.body.vote1 == "B") {
        res.send(JSON.stringify({ "suggestedVote": "26,25,24,23" }));
    }
    if (req.body.vote1 == "C") {
        res.send(JSON.stringify({ "suggestedVote": "22,21,20" }));
    }
    if (req.body.vote1 == "D") {
        res.send(JSON.stringify({ "suggestedVote": "19,18" }));
    }
});

route.get('/matchExam', function (req, res) {

    singleton.query('select esameEstero, count(*) as Occ from votazione where nomeEsame=? group by esameEstero ORDER BY Occ DESC LIMIT 1;',
        { replacements: [req.query.esameEstero], type: singleton.QueryTypes.SELECT }
    ).then(function(doc){
        if(doc == "") {
            res.send("noMatch").status(200).end();
        }else{
            res.send(doc).status(200).end();
        }
        
    }) .catch(err => res.sendStatus(409).end(err));
});

route.get('/createVote', function (req, res) {
    votazione.create({ "idTimeline": req.query.idTimeline , "emailStudente": req.query.email, "nomeEsame": req.query.nomeEsame, "votoIta": req.query.votoIta, "esameEstero": req.query.esameEstero, "votoEstero": req.query.votoEstero })
        .then(doc => res.send(doc).status(200).end())
        .catch(err => res.sendStatus(409).end(err));
});

route.get('/deleteVote', function (req, res) {
    votazione.destroy({ where: { "idTimeline": req.query.idTimeline, "nomeEsame": req.query.nomeEsame } })
        .then(doc => res.send(doc).status(200).end())
        .catch(err => res.sendStatus(409).end(err));
});

route.post('/upload', function(req, res){
    let file = req.files.filename;
    console.log("BERNARDOGAY");
    console.log("file: "+ file);
    let filename = file.name;
    console.log(req);
    file.mv('./upload/'+filename, function(err){
        if(err) {
            res.status(500).end("500: Internal server error");}
        else {//inserisci nel db
            
            timeline.create({
                "idDocumento": 2,
                "tipo": "pdf",
                "titolo": filename,
                "contenutoPath": "./upload",
                "idTimeline": 1,
                "dataUpload": "2019-06-01",
                "emailCoordinatore": "fferrucci@unisa.it"
            })
                .then(doc => res.send({message:"a "+doc}).status(200).end());
            //.catch(err => res.send({message:"b "+err}).status(403).end());
        }
    });
    /*Soluzione con le promise
        .then(doc => res.send({message: ""+doc}).status(200).end())
        .catch(err => res.send({message:""+err}).statusCode(403));*/
});

module.exports = route;