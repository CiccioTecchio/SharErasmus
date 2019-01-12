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


route.get("/findEmail", function(req, res){
    singleton.query("SELECT emailStudente FROM studente WHERE studente.emailStudente NOT IN(SELECT timeline.emailStudente FROM timeline LEFT JOIN studente ON timeline.emailStudente = studente.emailStudente WHERE emailCoordinatore LIKE '"+ req.query.email +"' GROUP BY studente.emailStudente)", { type: singleton.QueryTypes.SELECT })
        .then( doc => {
            let convertedDoc = JSON.stringify(doc);
            res.send(convertedDoc).status(200).end();
        }
        );
    //.catch(err => { res.sendStatus(409).end(err);} );
});

route.post('/addStudentToList', function (req, res) {
    let obj = req.body;
    timeline.create({
        "progresso": 0,
        "emailStudente": obj.student,
        "emailCoordinatore": obj.loggedEmail,
        "citta": obj.citta,
        "nazione": obj.nation
    })
        .then(doc => {//helping 
            res.redirect("../students_list.html");})
        .catch(err => {res.sendStatus(409).end(err);});
});

route.get('/createMarkers', function (req, res) {
    timeline.findAll({
        group: "citta"
    })
        .then(doc => res.send(doc).status(200).end());
    //.catch(err => res.sendStatus(409).end(err));
});

route.get('/obtainNumber', function (req, res) {
    timeline.count({
        where: {
            citta: { [Op.like]: req.query.city }
        }
    })
        .then(doc => {if(doc == 0)
            res.sendStatus(404).end();
        else 
            res.json(doc).status(200).end();
        });
    //.catch(err => res.sendStatus(409).end(err));
});
route.get('/createLista', function (req, res) {
    timeline.findAll({
        where:
        {
            emailCoordinatore: { [Op.like]: req.query.email }
        },
        include:
            [{
                model: studente,
                required: true,
            }]
    })
        .then(doc => {
            if(doc.length == 0)
                res.sendStatus(403).end();
            else
                res.send(doc).status(200).end();});
    //.catch(err => res.sendStatus(403).end(err));
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
        .then( doc => { if (doc.length == 0) 
            res.sendStatus(404).end();
        else 
            res.send(doc).status(200).end();} );
    //.catch(err => { res.sendStatus(409).end(err);} );
});
route.get('/userDocument', function (req, res) {
    documento.findAll({
        where:
        {
            idTimeline: { [Op.like]: req.query.idTimeline }
        }
    })
        .then(doc => {
            if(doc.length == 0) 
                res.sendStatus(404).end();
            else
                res.send(doc).status(200).end();});
    //.catch(err => res.sendStatus(409).end(err));
});
route.get('/examList', function (req, res) {
    votazione.findAll({
        where:
        {
            idTimeline: { [Op.like]: req.query.idTimeline }
        }
    })
        .then(doc => {
            if(doc.length == 0)
                res.sendStatus(404).end();
            else
                res.send(doc).status(200).end();});
    //.catch(err => res.sendStatus(409).end(err));
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
    }); 
    //.catch(err => res.sendStatus(409).end(err));
});

route.get('/createVote', function (req, res) {
    votazione.create({ "idTimeline": req.query.idTimeline, "emailStudente": req.query.email, "nomeEsame": req.query.nomeEsame, "votoIta": req.query.votoIta, "esameEstero": req.query.esameEstero, "votoEstero": req.query.votoEstero })
        .then(doc => res.send(doc).status(200).end())
        .catch(err => res.sendStatus(409).end(err));
});

route.get('/deleteVote', function (req, res) {
    votazione.destroy({ where: { "idTimeline": req.query.idTimeline, "nomeEsame": req.query.nomeEsame } })
        .then(doc => res.send(doc).status(200).end())
        .catch(err => res.sendStatus(409).end(err));
});

route.post('/upload', function(req, res){
    let file = req.files.fileinput;
    let filename = file.name;
    let datetime = new Date();
    let dateonly = datetime.toISOString().slice(0, 10);
    file.mv('./docs/docs_timeline\\'+filename, function(err){
        if(err) {
            res.status(500).end("500: Internal server error");}
        else {
            documento.create({
                "titolo": filename,
                "contenutoPath": "./docs/docs_timeline/"+filename,
                "idTimeline": req.body.idT,
                "dataUpload": dateonly,
                "emailCoordinatore": req.body.loggedEmail
            })
                .then(res.redirect("../timeline.html?idTimeline="+req.body.idT))
                .catch(err => res.send({message:"b "+err}).status(409).end());
        }
    });
});

route.post('/updateProgress', function(req, res){
    console.log("PROGRESSO TU UPDATE: " + req.query.prog);
    timeline.update({"progresso": req.query.prog}, {where: {"idTimeline": req.body.idT}})
    .then(res.sendStatus(200).end)
    .catch(err => res.send({message:"b "+err}).status(409).end());
})

module.exports = route;