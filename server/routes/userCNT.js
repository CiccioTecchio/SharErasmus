let express = require('express');
let router = express.Router();
let studente = require('../model/Studente');
let coordinatore = require('../model/Coordinatore');
let postP = require('../model/Post');
let timeline = require('../model/Timeline');
let upload = require('express-fileupload');
let fs = require('fs');
let singleton = require('../singleton/singleton');
const Op = singleton.Op;

router.use(upload({
    // limits: { fileSize: 50 * 1024 * 1024 }, per inserire un limite al file da uplodare, [meno di 1mb]
}));

/*Per cognome uso la stessa regex di nome*/

let regex = {
    nome: /\w+/g,
    //eslint-disable-next-line no-useless-escape
    email: /[a-zA-Z0-9\._-]+[@][a-zA-Z0-9\._-]+[.][a-zA-Z]{2,6}/g,
    password: /[A-Z0-9a-z.!@_-]{8,16}/g,
    facolta: /(\w+|\W+){0,30}/g,
    via: /(\w+(\W+)?)+/g,
    recapito: /\+?(\d+){0,12}/g,
    matricola: /(\d+){10}/g,
    //ruolo: /(\w+(\W+)?)+/g,
    codiceFiscale: /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/g
};


/** 
 * 
 * Post: Restituisce statusCode 200 se la registrazione va a buon fine, 400 in caso in cui un utente prova a registrarsi alla piattaforma e l'email è già presente, 401 in caso di errore nell'inserimento dei dati.
 * Desc: Permette la registrazione di uno studente o coordinatore alla piattaforma.
*/

router.post('/registrazione', function(req, res){
    let obj = req.body;
    if(obj.email.includes('@studenti.unisa.it')){
        //studente
        if(obj.nome.match(regex.nome) && obj.cognome.match(regex.nome) && obj.email.match(regex.email) && obj.password.match(regex.password) && obj.codiceFiscale.match(regex.codiceFiscale) && obj.via.match(regex.via) && obj.recapito.match(regex.recapito) && obj.facolta.match(regex.facolta) && obj.matricola.match(regex.matricola)){
            studente.create({"nome": obj.nome, "cognome": obj.cognome, "emailStudente": obj.email, "password": obj.password, "codiceFiscale": obj.codiceFiscale, "via": obj.via, "recapito": obj.recapito, "facolta": obj.facolta, "matricola": obj.matricola, "status": ['Normale']})
                .then( doc =>  res.send(doc).status(200).end())
                .catch(err => {
                    err.nome = 'Chiave duplicata!';
                    res.statusCode=400;
                    res.send({msg: err.nome}).end();
                }); 
        } else {
            //errore nel formato
            res.statusCode=401;
            res.send({msg:"Errore nel formato, Regex non rispettate"}).end();
        }
    } else {
        //coordinatore
        if(obj.nome.match(regex.nome) && obj.cognome.match(regex.nome) && obj.email.match(regex.email) && obj.password.match(regex.password) && obj.codiceFiscale.match(regex.codiceFiscale) && obj.via.match(regex.via) && obj.recapito.match(regex.recapito) && obj.facolta.match(regex.facolta)){
            coordinatore.create({"emailCoordinatore": obj.email, "password": obj.password, "nome": obj.nome, "cognome": obj.cognome, "codiceFiscale": obj.codiceFiscale, "via": obj.via, "recapito": obj.recapito, "ruolo": obj.ruolo, "facolta": obj.facolta})
                .then(doc => res.send(doc).status(200))
                .catch(err => {
                    err.nome = 'Chiave duplicata!';
                    res.statusCode=400;
                    res.send({msg: err.nome}).end();
                });
        } else {
            //errore nel formato
            res.statusCode=401;
            res.send({msg:"Errore nel formato, Regex non rispettate"}).end();
        }
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



router.post('/deleteAccount', function(req, res){
    if(req.query.email.match(regex.email)){
        if(req.query.email.includes('@studenti.unisa.it')){
        //elimino account studente!
            studente.destroy({where: {"emailStudente": req.query.email}})
                .then( doc => {
                    if(doc === 0){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile cancellare lo studente: Studente non trovato!"}).end();
                    }else{
                        //res.send({msg: "cancellato"}).end();
                        res.send().end();
                    }
                });
        } else {
        //elimino account cooridnatore!
            coordinatore.destroy({where: {"emailCoordinatore": req.query.email}})
                .then( doc => {
                    if(doc === 0){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile cancellare il coordinatore: Coordinatore non trovato!"}).end();
                    }else{
                        //res.send({msg: "cancellato"}).end();
                        res.send().end();
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
                        //res.redirect('../profil_user.html');
                    }
                });
        } else {
        // inserisco la bio al coordinatore
            coordinatore.update({"bio": obj.bio}, {where: {"emailCoordinatore": obj.email}})
                .then( doc => {
                    if(doc == false ){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile modificare la bio!"}).end();
                    }else{
                        res.statusCode = 200;
                        res.send({msg: "Bio modificata!"}).end();
                        //res.redirect('../profil_user.html');
                    }
                });
        }
    } else {
        res.statusCode = 401;
        res.send({msg: "Errore nel formato"}).end();
    }
});


//.post
router.get('/visualizzaDA', function(req, res){
    //req.query.email
    if(req.query.email.match(regex.email)){
        if(req.query.email.includes('@studenti.unisa.it')){
            studente.findOne({where: {"emailStudente": req.query.email}})
                .then( doc => {
                    if(doc === null){
                        res.statusCode = 403;
                        res.send({ msg: "studente non trovato" }).end();
                    } else {
                        
                        new Promise(() => {
                            let path = doc.imgProfiloPath;
                            console.log("asdfghjkldsfghjkl: "+path);
                            if(path!=null) {
                                doc.imgProfiloPath= new Buffer(fs.readFileSync(path)).toString("base64");
                            }
                            else {
                                doc.imgProfiloPath=null;
                            }
                        // eslint-disable-next-line no-unused-vars
                        }).then(val => {
                            res.send(doc).status(200).end();
                        });
                        
                        res.send(doc).status(200).end();
                    }
                });
        } else {
            coordinatore.findOne({where: {"emailCoordinatore": req.query.email}})
                .then( doc => {
                    if(doc === null){
                        res.statusCode = 403;
                        res.send({ msg: "Coordinatore non trovato" }).end();
                    } else {
                        //let path = doc.imgProfiloPath;
                        //if(path!=null) doc.imgProfiloPath= new Buffer(fs.readFileSync(path)).toString("base64"); else doc.imgProfiloPath=null;
                        new Promise(() => {
                            let path = doc.imgProfiloPath;
                            if(path!=null) {
                                doc.imgProfiloPath= new Buffer(fs.readFileSync(path)).toString("base64");
                            }
                            else {
                                doc.imgProfiloPath=null;
                            }
                        // eslint-disable-next-line no-unused-vars
                        }).then(val => {
                            res.send(doc).status(200).end();
                        });
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
    let nuovi = req.body;
    if(nuovi.email.includes('@studenti.unisa.it')){
        //studente
        if(nuovi.nome.match(regex.nome) && nuovi.cognome.match(regex.nome) && nuovi.email.match(regex.email) && nuovi.password.match(regex.password) && nuovi.codiceFiscale.match(regex.codiceFiscale) && nuovi.via.match(regex.via) && nuovi.recapito.match(regex.recapito) && nuovi.facolta.match(regex.facolta)){
            studente.update({"nome": nuovi.nome, "cognome": nuovi.cognome, "emailStudente": nuovi.email, "password": nuovi.password, "via": nuovi.via, "recapito": nuovi.recapito, "facolta": nuovi.facolta, "matricola": nuovi.matricola, "codiceFiscale": nuovi.codiceFiscale}, {where: {"emailStudente": nuovi.email}})
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
            //errore nel formato
            res.statusCode=401;
            res.send({msg:"Errore nel formato, Regex non rispettate"}).end();
        }
    } else {
        //coordinatore
        if(nuovi.nome.match(regex.nome) && nuovi.cognome.match(regex.nome) && nuovi.email.match(regex.email) && nuovi.password.match(regex.password) && nuovi.codiceFiscale.match(regex.codiceFiscale) && nuovi.via.match(regex.via) && nuovi.recapito.match(regex.recapito) && nuovi.facolta.match(regex.facolta)){
            coordinatore.update({"nome": nuovi.nome, "cognome": nuovi.cognome, "password": nuovi.password, "emailCoordinatore": nuovi.email, "codiceFiscale": nuovi.codiceFiscale, "via": nuovi.via, "recapito": nuovi.recapito, "facolta": nuovi.facolta}, {where: {"emailCoordinatore": nuovi.email}})
                .then( doc => {
                    if(doc == 0){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile modificare i dati di accesso!"}).end();
                    }else{
                        res.statusCode = 200;
                        res.send({msg: "Modifica dati di accesso effettuata!"}).end();
                    }
                });
        } else {
            //errore nel formato
            res.statusCode=401;
            res.send({msg:"Errore nel formato, Regex non rispettate"}).end();
        }
    }
});

router.get('/restpost', function (req, res) {
    let obj = req.query;
    console.log(obj);
    if (obj.email.includes('@studenti.unisa.it')) {
        //studente
        if (obj.email.match(regex.email)) {
            //faccio vedere i post
            postP.findAll({ where: { "emailStudente": obj.email } })
                .then( doc => {
                    if(doc == 0){
                        res.statusCode=403;
                        res.send({msg: "Studente non trovato"}).end();
                    }else{
                        res.statusCode = 200;
                        res.send(doc).end();
                    }
                });
        } else {
            //errore nel formato
            res.statusCode = 401;
            res.send({ msg: "Errore nel formato, Regex non rispettate" }).end();
        }
    } else {
        //coordinatore
        if (obj.email.match(regex.email)) {
            //faccio vedere i post
            postP.findAll({ where: { "emailCoordinatore": obj.email } })
               .then( doc => {
                if(doc == 0){
                    res.statusCode=403;
                    res.send({msg: "Coordinatore non trovato"}).end();
                }else{
                    res.statusCode = 200;
                    res.send(doc).end();
                }
            });
        } else {
            //errore nel formato
            res.statusCode = 401;
            res.send({ msg: "Errore nel formato, Regex non rispettate" }).end();
        }
    }
});


router.post('/getMaxId', function(req, res){
    let obj = req.body;
    if(obj.emailS.match(regex.email)){
        timeline.max('idTimeline', {where : {"emailStudente" : {[Op.like] : obj.emailS}}})
            .then(doc => {
            //console.log(doc)
                if(isNaN(doc)){
                    res.statusCode = 403;
                    res.send({msg: "Studente non trovato"}).end();
                } else {
                    let convertedDoc = JSON.stringify(doc);
                    res.send(convertedDoc).status(200).end();
                }
            //let convertedDoc = JSON.stringify(doc);
            //res.send(convertedDoc).status(200).end();
            });
    } else {
        res.statusCode = 401;
        res.send({msg: "Errore nel formato"}).end();
    }
});


module.exports = router;