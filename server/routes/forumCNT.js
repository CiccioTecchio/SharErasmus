let express = require('express');
let routes = express.Router();
let post = require('../model/Post');
let coordinatore = require('../model/Coordinatore');
let studente = require('../model/Studente');
let risposta = require('../model/Risposta');
let avviso = require('../model/Avviso');
let vota = require('../model/Vota');
let firebase = require('firebase');
let cred = require('crede_fb');

// Initialize Firebase
let config = {
    apiKey: cred.apiKey,
    authDomain: cred.authDomain,
    databaseURL: cred.databaseURL,
    projectId: cred.projectId,
    storageBucket: cred.storageBucket,
    messagingSenderId: cred.messagingSenderId 
};

firebase.initializeApp(config);

let regexp = {
    date: /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g,
    ora: /^((?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$)/g,
    tag: /#(\w+)/g,
    // eslint-disable-next-line no-useless-escape
    email: /[a-zA-Z0-9\._-]+[@][a-zA-Z0-9\._-]+[.][a-zA-Z]{2,6}/g
};

routes.get('/getallpost', function (req, res) {
    post.findAll({
        include: [{ model: coordinatore, studente, required: true }]
    })
        .then(doc => res.send(doc).status(200).end());
    /* .then(doc =>{
        if(doc.length==0){
            res.send(doc).sendStatus(404);
        }else{
            res.send(doc).status(200).end();
        }
    });*/
});

routes.post('/insertpost', function (req, res) {
    let obj = req.body;

    if (obj.data.match(regexp.date) && obj.ora.match(regexp.ora) && obj.tag.match(regexp.tag) && obj.email.match(regexp.email)) {

        if (obj.email.includes('@studenti.unisa.it')) {

            post.create({ post: obj.post, data: obj.data, ora: obj.ora, tag: obj.tag, fissato: 0, emailStudente: obj.email })
                .then(doc => {
                    obj.tag.split(",").forEach(element => {
                        firebase.database().ref('tagPost/' + idPost).push(element);
                    });
                    res.send(doc).status(200).end()
                })
                .catch(err => {
                    res.statusCode = 400;
                    res.send({ msg: 'Impossibile inserire il post' }).end();
                });
        } else {
            post.create({ post: obj.post, data: obj.data, ora: obj.ora, tag: obj.tag, fissato: obj.fissato, emailCoordinatore: obj.email })
                .then(doc => res.send(doc).status(200).end())
                .catch(err => {
                    res.statusCode = 400;
                    res.send({ msg: 'Impossibile inserire il post' }).end();
                });
        }
    } else {
        res.statusCode = 401;
        res.send({ msg: 'Errore nel formato' }).end();
    }
});

routes.post('/getidreply', function (req, res) {
    let obj = req.body;
    risposta.findAll({ where: { idPost: obj.id } })
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

    if (obj.data.match(regexp.date) && obj.ora.match(regexp.ora) && obj.email.match(regexp.email)) {

        if (obj.email.includes("@studenti.unisa.it")) {
            risposta.create({ risposta: obj.risposta, data: obj.data, ora: obj.ora, idPost: obj.idp, emailStudente: obj.email })
                .then(doc => res.send(doc).status(200).end())
                .catch(err => {
                    res.statusCode = 400;
                    res.send({ msg: 'Impossibile inserire la risposta' }).end();
                });
        } else {
            risposta.create({ risposta: obj.risposta, data: obj.data, ora: obj.ora, idPost: obj.idp, emailCoordinatore: obj.email })
                .then(doc => res.send(doc).status(200).end())
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
    post.findAll({ where: { tag: obj.tag } })
        .then(doc => {
            if (doc.length == 0) {
                res.statusCode = 404;
                res.send({ msg: 'Post con questo tag non presenti' }).end();
            } else {
                res.send(doc).status(200).end();
            }
        });
});

routes.get('/getalladv', function (req, res) {
    avviso.findAll({
        attributes: ['avviso', 'data', 'ora', 'emailCoordinatore'],
        include: [{ model: coordinatore, required: true }]
    })
        .then(doc => res.send(doc).status(200).end());
    /*
    .then(doc => {
        if (doc.length == 0) {
            res.statusCode = 404;
            res.send({ msg: 'Avvisi non presenti' }).end();
        } else {
            res.send(doc).status(200).end();
        }
    });
    */
});

routes.post('/insertadv', function (req, res) {
    let obj = req.body;
    let file = obj.files;

    if (obj.data.match(regexp.date) && obj.ora.match(regexp.ora) && obj.email.match(regexp.email)) {

        if (obj.email.includes('@studenti.unisa.it')) {
            res.statusCode = 400;
            res.send({ msg: "Errore, utente non abilitato all'inserimento" }).end();
        } else {
            if (file == undefined) {
                avviso.create({ avviso: obj.avviso, data: obj.data, ora: obj.ora, emailCoordinatore: obj.email })
                    .then(doc => res.send(doc).status(200).end())
                    .catch(err => {
                        res.statusCode = 400;
                        res.send({ msg: 'Impossibile inserire avviso!' }).end();
                    });
            } else {
                let filename = file.name;
                file.mv('./docs/docs_avviso\\' + filename, function (err) {
                    if (err) {
                        res.status(500).end("500: Internal server error");
                    }
                    else {
                        avviso.create({
                            avviso: obj.avviso,
                            data: obj.data,
                            ora: obj.ora,
                            emailCoordinatore: obj.email,
                            documentoPath: "./docs/docs_avviso/" + filename
                        })
                            .then(doc => res.send(doc).status(200).end())
                            .catch(err => {
                                res.statusCode = 400;
                                res.send({ msg: 'Impossibile inserire avviso!' }).end();
                            });
                    }
                });
            }
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
            vota.findAll({ where: { idRisposta: obj.idr } && { emailStudente: obj.email } })
                .then(doc => {
                    if (doc.length == 0) {
                        vota.create({ voto: obj.voto, idRisposta: obj.idr, emailStudente: obj.email });
                        studente.findAll({ where: { emailStudente: obj.emailp } })
                            .then(doc => {
                                let voto = doc[0].rating + obj.voto;
                                studente.update({ rating: voto }, { where: { emailStudente: obj.emailp } });
                                res.send(doc).status(200).end();
                            });
                    } else {
                        res.statusCode = 400;
                        res.send({ msg: 'Hai già votato questa risposta!' }).end();
                    }
                });
        } else {
            vota.findAll({ where: { idRisposta: obj.idr } && { emailCoordinatore: obj.email } })
                .then(doc => {
                    if (doc.length == 0) {
                        vota.create({ voto: obj.voto, idRisposta: obj.idr, emailCoordinatore: obj.email });
                        studente.findAll({ where: { emailStudente: obj.emailp } })
                            .then(doc => {
                                let voto = doc[0].rating + obj.voto;
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

routes.post('/notifica', function (req, res) {

    firebase.database().ref('tagPost/' + idPost).on('child_added', snapshot => {
        firebase.database().ref('tagUtente/' + codiceFiscale).on('child_added', tagutente => {
            if (snapshot.val() == tagutente.val()) {
                post.findAll({ where: { idPost: snapshot.key } })
                    .then(doc => res.send(doc).status(200).end());
            }
        })
    })
});

module.exports = routes;