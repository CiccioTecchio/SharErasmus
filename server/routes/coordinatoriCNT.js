let express = require('express');
let route = express.Router();
let timeline = require('../model/Timeline');
let singleton = require('../singleton/singleton');
let studente = require('../model/Studente');
let documento = require('../model/Documento');
let votazione = require('../model/Votazione');
let fs = require('fs');
const bodyParser = require("body-parser");

route.use(bodyParser.urlencoded({
    extended: true
}));

route.use(bodyParser.json());

const Op = singleton.Op;


route.get("/findEmail", function (req, res) {
    singleton.query("SELECT emailStudente FROM studente WHERE studente.emailStudente NOT IN(SELECT timeline.emailStudente FROM timeline LEFT JOIN studente ON timeline.emailStudente = studente.emailStudente WHERE emailCoordinatore LIKE '" + req.query.email + "' GROUP BY studente.emailStudente)", { type: singleton.QueryTypes.SELECT })
        .then(doc => {
            let convertedDoc = JSON.stringify(doc);
            res.send(convertedDoc).status(200).end();
        }
        );
});

route.post('/addStudentToList', function (req, res) {
    let obj = req.body;
    timeline.create({
        "emailStudente": obj.student,
        "emailCoordinatore": obj.loggedEmail,
        "citta": obj.citta,
        "nazione": obj.nation
    })
        // eslint-disable-next-line no-unused-vars
        .then(doc => {//helping 
            res.redirect("../students_list.html");
        })
        .catch(err => { res.sendStatus(409).end(err); });
});

route.get('/createMarkers', function (req, res) {
    timeline.findAll({
        group: "citta"
    })
        .then(doc => res.send(doc).status(200).end());
});

route.get('/obtainNumber', function (req, res) {
    timeline.count({
        where: {
            citta: { [Op.like]: req.query.city }
        }
    })
        .then(doc => {
         
            if(doc == 0) 
            {
                res.statusCode = 404;
                res.send().end();
            }
            else 
                res.json(doc).status(200).end();
        });
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
            if (doc.length == 0) {
                res.statusCode = 403;
                res.send(doc).end();
            }
            else {
                // eslint-disable-next-line no-unused-vars
                new Promise((resolve, reject) => {
                    for(let i=0; i<doc.length; i++){
                        let toSend = new Buffer(fs.readFileSync(doc[i].studente.imgProfiloPath)).toString("base64");
                        doc[i].studente.imgProfiloPath = toSend;
                    }
                })   
                    // eslint-disable-next-line no-unused-vars
                    .then(val => {
                        res.send(doc).status(200).end();
                    });
                res.send(doc).status(200).end();
            }
        });
});
route.get('/userTimeline', function (req, res) {
   
    timeline.findAll({
        where:
        {
            idTimeline: { [Op.like]: req.query.idTimeline }
        },
        include:
            [{
                model: studente, votazione,
                required: true,
            }]
    })
        .then(doc => {
            if (doc.length == 0) {
                res.statusCode = 404;
                res.send(doc).end();
            }
            else {
                // eslint-disable-next-line no-unused-vars
                new Promise((resolve, reject) => {
                    
                    let toSend = new Buffer(fs.readFileSync(doc[0].studente.imgProfiloPath)).toString("base64");
                    doc[0].studente.imgProfiloPath = toSend;
        
                })
                    
                    // eslint-disable-next-line no-unused-vars
                    .then(val => {
                        res.send(doc).status(200).end();
                    });
                res.send(doc).status(200).end();
            }
        });
});
route.get('/userDocument', function (req, res) {
    documento.findAll({
        where:
        {
            idTimeline: { [Op.like]: req.query.idTimeline }
        }
    })
        .then(doc => {
            if (doc.length == 0)
                res.sendStatus(404).end();
            else
                res.send(doc).status(200).end();
        });
});
route.get('/examList', function (req, res) {
    votazione.findAll({
        where:
        {
            idTimeline: { [Op.like]: req.query.idTimeline }
        }
    })
        .then(doc => {
            if (doc.length == 0)
                res.sendStatus(404).end();
            else
                res.send(doc).status(200).end();
        });
});

route.get('/matchExam', function (req, res) {
    singleton.query('select esameEstero, count(*) as Occ from votazione where nomeEsame=? group by esameEstero ORDER BY Occ DESC LIMIT 1;',
        { replacements: [req.query.esameEstero], type: singleton.QueryTypes.SELECT }
    ).then(function (doc) {
        if (doc == "") {
            res.send("noMatch").status(200).end();
        } else {
            res.send(doc).status(200).end();
        }
    });
});

route.get('/createVote', function (req, res) {
    votazione.create({ "idTimeline": req.query.idTimeline, "emailStudente": req.query.email, "nomeEsame": req.query.nomeEsame, "votoIta": req.query.votoIta, "esameEstero": req.query.esameEstero, "votoEstero": req.query.votoEstero })
        .then(doc => res.send(doc).status(200).end())
        .catch(err => res.sendStatus(409).end(err));
});

route.get('/deleteVote', function (req, res) {
    votazione.destroy({ where: { "idTimeline": req.query.idTimeline, "nomeEsame": req.query.nomeEsame } })
        .then(doc => {
            if(doc === 0)
            {
                res.statusCode = 403;
                res.send({msg: "Non è stato possibile cancellare lo studente: Sutdente non trovato!"}).end();
            }
            else
                res.send().end();
        });
});

route.post('/download', function (req, res) {
    documento.findOne({
        where: { "contenutoPath": req.body.pathfile }
    }).then(doc => {
        if (doc == null) {
            //documento non trovato
            res.sendStatus(404).end();
        } else {
            let path = doc.contenutoPath;
            if (path != null) {
                let toSend = {
                    content: new Buffer(fs.readFileSync(path)).toString("base64"),
                    name: doc.titolo
                };
                res.send(toSend).status(200).end();
            } else {
                //documento corrotto
                res.sendStatus(404).end();
            }
        }
    }
    );

});

route.post('/upload', function (req, res) {
    let file = req.files.fileinput;
    let filename = file.name;
    let datetime = new Date();
    let dateonly = datetime.toISOString().slice(0, 10);
    file.mv('./docs/docs_timeline\\' + filename, function (err) {
        if (err) {
            res.status(500).end("500: Internal server error");
        }
        else {
            documento.create({
                "titolo": filename,
                "contenutoPath": "./docs/docs_timeline/" + filename,
                "idTimeline": req.body.idT,
                "dataUpload": dateonly,
                "emailCoordinatore": req.body.loggedEmail
            })
                .then(res.redirect("../timeline.html?idTimeline=" + req.body.idT))
                .catch(err => res.send({ message: "b " + err }).status(409).end());
        }
    });
});

route.post('/statusPartito', function (req, res) {
    studente.update({ "status": "Partito" }, { where: { "emailStudente": req.body.email } })
        .spread((affectedCount) => {
            if (affectedCount == 0)
                res.sendStatus(409).end();
            else
                res.redirect("../timeline.html?idTimeline=" + req.body.idt);
        });
});

route.post('/statusTornato', function (req, res) {
    studente.update({ "status": "Tornato" }, { where: { "emailStudente": req.body.email } })
        .spread((affectedCount) => {
            if (affectedCount == 0)
                res.sendStatus(409).end();
            else
                res.redirect("../timeline.html?idTimeline=" + req.body.idt);
        });
});

module.exports = route;