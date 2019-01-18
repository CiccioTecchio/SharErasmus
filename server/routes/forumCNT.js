let express = require('express');
let routes = express.Router();
let post = require('../model/Post');
let coordinatore = require('../model/Coordinatore');
let studente = require('../model/Studente');
let risposta = require('../model/Risposta');
let avviso = require('../model/Avviso');
let vota = require('../model/Vota');
let firebase = require('firebase');

let regexp = {
    // eslint-disable-next-line no-useless-escape
    date: /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/g,
    ora: /^((?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$)/g,
    tag: /#(\w+)/g,
    // eslint-disable-next-line no-useless-escape
    email: /[a-zA-Z0-9\._-]+[@][a-zA-Z0-9\._-]+[.][a-zA-Z]{2,6}/g
};

routes.get('/getallpost', function (req, res) {
    post.findAll({
        order: [
            ['data', 'DESC'],
            ['ora', 'DESC'],
        ],
        include: [{ model: coordinatore }, { model: studente }]
    })
        .then(doc => res.send(doc).status(200).end());
});

routes.post('/insertpost', function (req, res) {
    let obj = req.body;
    let datetime = new Date();
    let dateonly = datetime.toISOString().slice(0, 10);
    let timeonly = datetime.toISOString().slice(11, 19);

    if (dateonly.match(regexp.date) && timeonly.match(regexp.ora) && obj.email.match(regexp.email)) {
        if (obj.email.includes('@studenti.unisa.it')) {

            post.create({ post: obj.post, data: dateonly, ora: timeonly, tag: obj.tag.toLowerCase().trim().split(" ").join(''), fissato: 0, emailStudente: obj.email })
                // eslint-disable-next-line no-unused-vars
                .then(doc => {
                    post.findAll({ where: { ora: timeonly, emailStudente: obj.email } })
                        .then(doc => {
                            obj.tag.trim().split(" ").join('').split(",").forEach(element => {
                                firebase.database().ref('tagPost/' + doc[0].idPost).push(element.toLowerCase());
                            });
                            res.send(doc).status(200).end();
                        });
                })
                // eslint-disable-next-line no-unused-vars
                .catch(err => {
                    res.statusCode = 400;
                    res.send({ msg: 'Impossibile inserire il post, utente non presente' }).end();
                });
        } else {
            post.create({ post: obj.post, data: dateonly, ora: timeonly, tag: obj.tag.toLowerCase().trim().split(" ").join(''), fissato: 0, emailCoordinatore: obj.email })
                // eslint-disable-next-line no-unused-vars
                .then(doc => {
                    post.findAll({ where: { ora: timeonly, emailCoordinatore: obj.email } })
                        .then(doc => {
                            obj.tag.trim().split(" ").join('').split(",").forEach(element => {
                                firebase.database().ref('tagPost/' + doc[0].idPost).push(element);
                            });
                            res.send(doc).status(200).end();
                        });
                })
                // eslint-disable-next-line no-unused-vars
                .catch(err => {
                    res.statusCode = 400;
                    res.send({ msg: 'Impossibile inserire il post, coordinatore non presente' }).end();
                });
        }
    } else {
        res.statusCode = 400;
        res.send({ msg: 'Errore nel formato, impossibile inserire post' }).end();
    }
});

routes.post('/getidreply', function (req, res) {
    let obj = req.body;
    risposta.findAll({
        order: [
            ['data', 'DESC'],
            ['ora', 'DESC'],
        ],
        where: { idPost: obj.id },
        include: [{ model: coordinatore }, { model: studente }]
    })
        .then(doc => {
            if (doc.length == 0) {
                res.statusCode = 404;
                res.send({ msg: 'Risposte non presenti' }).end();
            } else {
                res.send(doc).status(200).end();
            }
        });
});

routes.post('/insertreply', function (req, res) {
    let obj = req.body;
    let datetime = new Date();
    let dateonly = datetime.toISOString().slice(0, 10);
    let timeonly = datetime.toISOString().slice(11, 19);

    if (dateonly.match(regexp.date) && timeonly.match(regexp.ora) && obj.email.match(regexp.email)) {

        if (obj.email.includes("@studenti.unisa.it")) {
            risposta.create({ risposta: obj.risposta, data: dateonly, ora: timeonly, idPost: obj.idp, emailStudente: obj.email })
                .then(doc => res.send(doc).status(200).end())
                // eslint-disable-next-line no-unused-vars
                .catch(err => {
                    res.statusCode = 400;
                    res.send({ msg: 'Impossibile inserire la risposta' }).end();
                });
        } else {
            risposta.create({ risposta: obj.risposta, data: dateonly, ora: timeonly, idPost: obj.idp, emailCoordinatore: obj.email })
                .then(doc => res.send(doc).status(200).end())
                // eslint-disable-next-line no-unused-vars
                .catch(err => {
                    res.statusCode = 400;
                    res.send({ msg: 'Impossibile inserire la risposta' }).end();
                });
        }

    } else {
        res.statusCode = 401;
        res.send({ msg: "Errore nel formato" }).end();
    }
});

routes.post('/gettagpost', function (req, res) {
    let obj = req.body;
    post.findAll({ where: { tag: obj.tag } },
        {
            order: [
                ['data', 'DESC'],
                ['ora', 'DESC'],
            ],
        })
        .then(doc => {
            if (doc.length == 0) {
                console.log(doc.length);
                res.statusCode = 404;
                res.send({ msg: 'Post con questo tag non presenti' }).end();
            } else {
                res.send(doc).status(200).end();
            }
        });
});

routes.get('/getalladv', function (req, res) {
    avviso.findAll({
        order: [
            ['data', 'DESC'],
            ['ora', 'DESC'],
        ],
        include: [{ model: coordinatore, required: true }]
    })
        .then(doc => res.send(doc).status(200).end());
});

routes.post('/insertadv', function (req, res) {
    let obj = req.body;
    let datetime = new Date();
    let dateonly = datetime.toISOString().slice(0, 10);
    let timeonly = datetime.toISOString().slice(11, 19);


    if (dateonly.match(regexp.date) && timeonly.match(regexp.ora) && obj.email.match(regexp.email)) {

        if (obj.email.includes('@studenti.unisa.it')) {
            res.statusCode = 400;
            res.send({ msg: "Errore, utente non abilitato all'inserimento" }).end();
        } else {
            avviso.create({ avviso: obj.avviso, data: dateonly, ora: timeonly, emailCoordinatore: obj.email })
                .then(doc => res.send(doc).status(200).end())
                // eslint-disable-next-line no-unused-vars
                .catch(err => {
                    res.statusCode = 400;
                    res.send({ msg: 'Impossibile inserire avviso!' }).end();
                });
        }
    } else {
        res.statusCode = 401;
        res.send({ msg: "Errore nel formato" }).end();
    }
});

routes.post('/fixpost', function (req, res) {
    let obj = req.body;

    if (obj.email.includes("@studenti.unisa.it") || !(obj.email.match(regexp.email))) {
        res.statusCode = 401;
        res.send({ msg: "Errore, impossibile fissare il post" }).end();
    } else {
        coordinatore.findAll({ where: { emailCoordinatore: obj.email } })
            .then(doc => {
                if (doc.length == 0) {
                    res.statusCode = 404;
                    res.send({ msg: 'Coordinatore non presente!' }).end();
                } else {
                    post.update({ fissato: obj.fix }, { where: { idPost: obj.idp } });
                    res.send(doc).status(200).end();
                }
            });
    }
});

routes.post('/vota', function (req, res) {
    let obj = req.body;

    if (obj.email.match(regexp.email) && obj.email.match(regexp.emailp)) {

        if (obj.email.includes("@studenti.unisa.it")) {
            vota.findAll({ where: { idRisposta: obj.idr, emailStudente: obj.email } })
                .then(doc => {
                    if (doc.length == 0) {
                        vota.create({ voto: obj.voto, idRisposta: obj.idr, emailStudente: obj.email });
                        studente.findAll({ where: { emailStudente: obj.emailp } })
                            .then(doc => {
                                let voto = doc[0].rating + parseInt(obj.voto);
                                studente.update({ rating: voto }, { where: { emailStudente: obj.emailp } });
                                res.send(doc).status(200).end();
                            });
                    } else {
                        res.statusCode = 400;
                        res.send({ msg: 'Hai già votato questa risposta!' }).end();
                    }
                });
        } else {
            vota.findAll({ where: { idRisposta: obj.idr, emailCoordinatore: obj.email } })
                .then(doc => {
                    if (doc.length == 0) {
                        vota.create({ voto: obj.voto, idRisposta: obj.idr, emailCoordinatore: obj.email });
                        studente.findAll({ where: { emailStudente: obj.emailp } })
                            .then(doc => {
                                let voto = doc[0].rating + parseInt(obj.voto);
                                studente.update({ rating: voto }, { where: { emailStudente: obj.emailp } });
                                res.send(doc).status(200).end();
                            });
                    } else {
                        res.statusCode = 400;
                        res.send({ msg: 'Hai già votato questa risposta!' }).end();
                    }
                });
        }
    } else {
        res.statusCode = 401;
        res.send({ msg: 'Errore nel formato' }).end();
    }
});

module.exports = routes;