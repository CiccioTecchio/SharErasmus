let express = require('express');
let router = express.Router();
let studente = require('../model/Studente');
let coordinatore = require('../model/Coordinatore');

/*Per cognome uso la stessa regex di nome*/

let regex = {
    nome: /\w+/g,
    //eslint-disable-next-line no-useless-escape
    email: /[a-zA-Z0-9\._-]+[@][a-zA-Z0-9\._-]+[.][a-zA-Z]{2,6}/g,
    password: /[A-Z0-9a-z.!@_-]{8,16}/g,
    facolta: /(\w+|\W+){0,30}/g,
    via: /(\w+\W+)+(\d+)?/g,
    recapito: /\+?(\d+){0,12}/g,
    matricola: /(\d+){9}/g,
    codiceFiscale: /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/g
};

//si verifica un errore nella registrazione del coordinatore:  Cannot read property 'match' of undefined 21:263
router.post('/registrazione', function(req, res){
    let obj = req.body;
    if(obj.nome.match(regex.nome) && obj.cognome.match(regex.nome) && obj.email.match(regex.email) && obj.password.match(regex.password) && obj.codiceFiscale.match(regex.codiceFiscale) && obj.via.match(regex.via) && obj.recapito.match(regex.recapito) && obj.facolta.match(regex.facolta) && obj.matricola.match(regex.matricola)){
        if(obj.email.includes("@studenti.unisa.it")){
        //inserisco studente
            studente.create({"nome": obj.nome, "cognome": obj.cognome, "emailStudente": obj.email, "password": obj.password, "codiceFiscale": obj.codiceFiscale, "via": obj.via, "recapito": obj.recapito, "facolta": obj.facolta, "matricola": obj.matricola, "status": ['Normale']})
                .then(doc => res.send(doc).status(200).end())
                .catch(err => {
                    err.nome = 'Chiave duplicata!';
                    res.statusCode=400;
                    res.send({msg: err.nome}).end();
                }); 
        }else{
        //inserisco coordinatore
            coordinatore.create({"emailCoordinatore": obj.email, "password": obj.password, "nome": obj.nome, "cognome": obj.cognome, "codiceFiscale": obj.codiceFiscale, "via": obj.via, "recapito": obj.recapito, "ruolo": obj.ruolo, "facolta": obj.facolta})
                .then(doc => res.send(doc).status(200).end())
                .catch(err => {
                    err.nome = 'Chiave duplicata!';
                    res.statusCode=400;
                    res.send({msg: err.nome}).end();
                });
        }
    } else {
        res.statusCode=401;
        res.send({msg:"Errore nel formato, Regex non rispettate"}).end();
    }
});


router.post('/login', function(req, res){
    let obj = req.body;
    if(obj.email.match(regex.email) && obj.password.match(regex.password)){
        if(obj.email.includes('@studenti.unisa.it')){
            //loggo studente
            studente.findOne({where: {"emailStudente":obj.email, "password":obj.password} })
                .then( doc => {
                    if(doc === null){
                        res.statusCode = 403;
                        res.send({msg: "utente non trovato"}).end();
                    }else{
                        res.statusCode = 200;
                        res.send(doc).end();
                    }
                });
        } else {
            //loggo coordinatore
            coordinatore.findOne({where: {"emailCoordinatore":obj.email, "password":obj.password}})
                .then( doc => { 
                    if (doc === null){
                        res.statusCode = 403;
                        res.send({msg: "coordinatore non trovato"}).end();
                    } else {
                        res.statusCode = 200;
                        res.send(doc).end();
                    }
                });
        }
    } else {
        res.statusCode = 401;
        res.send({msg:"Errore nel formato"}).end();
    }
});

router.delete('/deleteAccount', function(req, res){
    let obj = req.body;
    if(obj.email.match(regex.email)){
        if(obj.email.includes('@studenti.unisa.it')){
        //elimino account studente!
            studente.destroy({where: {"emailStudente": obj.email}})
                .then( doc => {
                    if(doc === 0){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile cancellare lo studente: Studente non trovato!"}).end();
                    }else{
                        res.send({msg: "cancellato"}).end();
                    }
                });
        } else {
        //elimino account cooridnatore!
            coordinatore.destroy({where: {"emailCoordinatore": obj.email}})
                .then( doc => {
                    console.log(doc);
                    if(doc === 0){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile cancellare il coordinatore: Coordinatore non trovato!"}).end();
                    }else{
                        res.send({msg: "cancellato"}).end();
                    }
                });
        }
    } else {
        res.statusCode = 401;
        res.send({msg:"Errore nel formato"}).end();
    }
});


router.post('/insertBio', function(req, res){
    let obj = req.body;
    if(obj.email.match(regex.email)){
        if(obj.email.includes('@studenti.unisa.it')){
            studente.update({"bio": obj.bio}, {where: {"emailStudente": obj.email}})
                .then( doc => {
                    if(doc == false ){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile modificare la bio!"}).end();
                    }else{
                        res.statusCode = 200;
                        res.send({msg: "Bio modificata!"}).end();
                    }
                });
        } else {
        // inserisco la bio al coordinatore
            coordinatore.update({"bio": obj.bio}, {where: {"emailCoordinatore": obj.email}})
                .then( doc => {
                    console.log(doc);
                    if(doc == false ){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile modificare la bio!"}).end();
                    }else{
                        res.statusCode = 200;
                        res.send({msg: "Bio modificata!"}).end();
                    }
                });
        }
    } else {
        res.statusCode = 401;
        res.send({msg: "Errore nel formato"}).end();
    }
});

router.post('/visualizzaDA', function(req, res){
    let obj = req.body;
    if(obj.email.match(regex.email)){
        if(obj.email.includes('@studenti.unisa.it')){
            studente.findOne({where: {"emailStudente": obj.email}})
                .then( doc => {
                    if(doc === null){
                        res.statusCode = 403;
                        res.send({msg: "studente non trovato"}).end();
                    }else{
                        res.send(doc).status(200).end();
                    }
                });
        } else {
            coordinatore.findOne({where: {"emailCoordinatore": obj.email}})
                .then( doc => {
                    if(doc === null){
                        res.statusCode = 403;
                        res.send({msg: "Coordinatore non trovato"}).end();
                    }else{
                        res.send(doc).status(200).end();
                    }
                });
        }
    } else {
        res.statusCode = 401;
        res.send({msg:"Errore nel formato"}).end();
    }
});

router.post('/modificaDA', function(req, res){
    let nuovi = req.body.nuovi;
    let vecchi = req.body.vecchi;
    if(nuovi.nome.match(regex.nome) && nuovi.cognome.match(regex.nome) && nuovi.email.match(regex.email) && nuovi.password.match(regex.password) && nuovi.codiceFiscale.match(regex.codiceFiscale) && nuovi.via.match(regex.via) && nuovi.recapito.match(regex.recapito) && nuovi.facolta.match(regex.facolta) && nuovi.matricola.match(regex.matricola)){
        if(req.body.vecchi.email.includes('@studenti.unisa.it')){
        //effettuo la modifica dei dati dello studente
            studente.update({"nome": nuovi.nome, "cognome": nuovi.cognome, "emailStudente": nuovi.email, "password": nuovi.password, "via": nuovi.via, "recapito": nuovi.recapito, "facolta": nuovi.facolta, "matricola": nuovi.matricola, "status": nuovi.status, "codiceFiscale": nuovi.codiceFiscale, "bio": nuovi.bio}, {where: {"emailStudente": vecchi.email}})
                .then( doc => {
                    if(doc == false){
                        res.statusCode=403;
                        res.send({msg: "Non è stato popssibile modificare i dati di accesso!"}).end();
                    }else{
                        res.statusCode = 200;
                        res.send({msg: "Modifica dati di accesso effettuata!"}).end();
                    }
                });
        } else {
            // effettuo la modifica del coordinatore
            coordinatore.update({"nome": nuovi.nome, "cognome": nuovi.cognome, "password": nuovi.password, "emailCoordinatore": nuovi.email, "bio": nuovi.bio, "codiceFiscale": nuovi.codiceFiscale, "via": nuovi.via, "recapito": nuovi.recapito, "ruolo": nuovi.ruolo, "facolta": nuovi.facolta}, {where: {"emailCoordinatore": vecchi.email}})
                .then( doc => {
                    console.log(req.body);
                    if(doc == 0){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile modificare i dati di accesso!"}).end();
                    }else{
                        res.statusCode = 200;
                        res.send({msg: "Modifica dati di accesso effettuata!"}).end();
                    //res.send(doc).status(200).end()
                    }
                });
        }
    } else {
        res.statusCode = 401;
        res.send({msg: "Errore nel formato"}).end();
    }
});

module.exports = router;