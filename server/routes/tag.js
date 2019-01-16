let express = require('express');
let router = express.Router();
let studente = require('../model/Studente');
let coordinatore = require('../model/Coordinatore');
let credeFirebase = require('./crede_fb');
let firebase = require('firebase');

// Initialize Firebase
let config = {
    apiKey: credeFirebase.apiKey,
    authDomain: credeFirebase.authDomain,
    databaseURL: credeFirebase.databaseURL,
    projectId: credeFirebase.projectId,
    storageBucket: credeFirebase.storageBucket,
    messagingSenderId: credeFirebase.messagingSenderId
};

firebase.initializeApp(config);


router.post('/caricaTag', function (req, res) {
    let obj = req.body;
    if (obj.email.includes('@studenti.unisa.it')) {
        //studente
        if (obj.email.match(regex.email)) {
            //carico i tag studente
            studente.findOne({ where: { "emailStudente": obj.email } })
                .then(doc => {
                    if (doc === null) {
                        res.statusCode = 403;
                        res.send({ msg: "coordinatore non trovato" }).end();
                    } else {
                        console.log('il codice fiscale è: ' + doc.codiceFiscale);
                        obj.tag.split(',').forEach(element => {
                            if (element != '') {
                                firebase.database().ref('tagUtente/' + doc.codiceFiscale).push(element.toLowerCase());
                            }
                        });
                        res.send(doc).status(200).end();
                    }
                });
            //console.log('Tag ricevuti: '+obj.tag);
        } else {
            //errore nel formato
            res.status = 401;
            res.send({ msg: "Errore nel formato, regex non rispettata" }).end();
        }
    } else {
        //coordinatore
        if (obj.email.match(regex.email)) {
            //carico i tag coordinatori
            let codiceF = cod_fis(obj.email);
        } else {
            //errore nel formato
            res.send = 401;
            res.send({ msg: "Errore nel formato, regex non rispettata" }).end();
        }
    }
})

router.post('/visualizzaTag', function (req, res) {
    let obj = req.body;
    if (obj.email.includes('@studenti.unisa.it')) {
        //studente
        if (obj.email.match(regex.email)) {
            //carico i tag studente
            studente.findOne({ where: { "emailStudente": obj.email } })
                .then(doc => {
                    if (doc === null) {
                        res.statusCode = 403;
                        res.send({ msg: "coordinatore non trovato" }).end();
                    } else {
                        console.log('il codice fiscale è: ' + doc.codiceFiscale);
                        //visualizza
                        new Promise((resolve, reject) => {
                            var rtn = '';
                            firebase.database().ref('tagUtente/' + doc.codiceFiscale).on('child_added', snapshot => {
                                rtn += snapshot.val() + '\n';
                                //res.send(rtn).status(200).end();
                                console.log('dfewfewfwe: '+rtn)
                            })
                            setTimeout(() => {
                                resolve(rtn)
                              }, 1000);
                            console.log("Sono rtn: "+rtn);
                        }).then(val => {
                            res.send(val).status(200).end();
                        })
                    }
                });
            //console.log('Tag ricevuti: '+obj.tag);
        } else {
            //errore nel formato
            res.status = 401;
            res.send({ msg: "Errore nel formato, regex non rispettata" }).end();
        }
    } else {
        //coordinatore
        if (obj.email.match(regex.email)) {
            //carico i tag coordinatori
            let codiceF = cod_fis(obj.email);
        } else {
            //errore nel formato
            res.send = 401;
            res.send({ msg: "Errore nel formato, regex non rispettata" }).end();
        }
    }
})

module.exports = router;