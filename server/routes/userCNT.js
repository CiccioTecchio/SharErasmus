let express = require('express');
let router = express.Router();
let studente = require('../model/Studente');
let coordinatore = require('../model/Coordinatore');

/*Per cognome uso la stessa regex di nome*/
/*res.send({msg: "impossibile inserire"}.statusCode(400)) */
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
    console.log(obj.facolta);
    console.log(obj.matricola);
    if(obj.nome.match(regex.nome) && obj.cognome.match(regex.nome) && obj.email.match(regex.email) && obj.password.match(regex.password) && obj.codiceFiscale.match(regex.codiceFiscale) && obj.via.match(regex.via) && obj.recapito.match(regex.recapito) && obj.facolta.match(regex.facolta) && obj.matricola.match(regex.matricola) 
    || (obj.nome.match(regex.nome) && obj.cognome.match(regex.nome) && obj.email.match(regex.email) && obj.password.match(regex.password) && obj.codiceFiscale.match(regex.codiceFiscale) && obj.via.match(regex.via) && obj.recapito.match(regex.recapito) && obj.ruolo.match(regex.ruolo) && obj.facolta.match(regex.facolta))){
        if(obj.email.includes("@studenti.unisa.it")){
        //inserisco studente
            studente.create({"Nome": obj.nome, "Cognome": obj.cognome, "Email_Studente": obj.email, "Password": obj.password, "Codice_Fiscale": obj.codiceFiscale, "Via": obj.via, "Recapito": obj.recapito, "Facoltà": obj.facolta, "Matricola": obj.matricola, "Status": ['Normale']})
                .then(doc => res.send(doc).status(200).end())
                .catch(err => {
                    err.nome = 'Chiave duplicata!';
                    res.send({msg: err.nome}).status(400).end();
                }); 
        }else{
        //inserisco coordinatore
            coordinatore.create({"Email_Coordinatore": obj.email, "Password": obj.password, "Nome": obj.nome, "Cognome": obj.cognome, "Codice_Fiscale": obj.codiceFiscale, "Via": obj.via, "Recapito": obj.recapito, "Ruolo": obj.ruolo, "facolta": obj.facolta})
                .then(doc => res.send(doc))
                .catch(err => {
                    err.nome = 'Chiave duplicata!';
                    res.send({msg: err.nome}).status(400).end();
                });
        }
    } else {
        res.send({msg:"Errore nel formato, Regex non rispettate"}).status(401).end();
    }
});


router.post('/login', function(req, res){
    let obj = req.body;
    //console.log(obj);
    if(obj.email.match(regex.email) && obj.password.match(regex.password)){
        if(obj.email.includes('@studenti.unisa.it')){
            //loggo studente
            studente.findOne({where: {"Email_Studente":obj.email, "Password":obj.password} })
                .then( doc => {
                    if(doc === null){
                        res.send({msg: "utente non trovato"}).status(403).end();
                    }else{
                        res.send(doc).status(200).end();
                    }
                });
        } else {
            //loggo coordinatore
            coordinatore.findOne({where: {"Email_Coordinatore":obj.email, "Password":obj.password}})
                .then( doc => { 
                    if (doc=== null){
                        res.send({msg: "coordinatore non trovato"}).status(403).end();
                    } else {
                        res.send(doc).status(200).end();
                    }
                });
        }
    } else {
        res.send({msg:"Errore nel formato"}).status(401).end();
    }
});

router.delete('/deleteAccount', function(req, res){
    let obj = req.body;
    if(obj.email.match(regex.email)){
        if(obj.email.includes('@studenti.unisa.it')){
        //elimino account studente!
            studente.destroy({where: {"Email_Studente": obj.email}})
                .then( doc => {
                    if(doc === 0){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile cancellare lo studente: Studente non trovato!"}).end();
                    }else{
                        res.send({msg: "cancellato"}).end();
                        //res.status(200).send((doc).toString());
                    }
                });
        } else {
        //elimino account cooridnatore!
            coordinatore.destroy({where: {"Email_Coordinatore": obj.email}})
                .then( doc => {
                    console.log(doc);
                    if(doc === 0){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile cancellare il coordinatore: Coordinatore non trovato!"}).end();
                    }else{
                        res.send({msg: "cancellato"}).end();
                        //res.send(doc).status(200).end()
                    }
                });
        }
    } else {

        res.send({msg:"Errore nel formato"}).status(401).end();
    }
});

router.post('/insertBio', function(req, res){
    let obj = req.body;
    if(obj.email.includes('@studenti.unisa.it')){
        //inserisco bio
        studente.update({"bio": obj.bio}, {where: {"Email_Studente": obj.email}})
            .then( doc => {
                console.log(doc);
                if(doc === null){
                    res.statusCode=403;
                    res.send({msg: "Non è stato popssibile modificare la bio!"}).end();
                }else{
                    res.send({msg: "Bio modificata!"}).end();
                    //res.send(doc).status(200).end()
                }
            });
    } else {
        //non è uno studente.
        res.send({msg: "Si nu cazz"}).status(401).end();
    }
});


router.post('/visualizzaDA', function(req, res){
    let obj = req.body;
    if(obj.email.includes('@studenti.unisa.it')){
        studente.findOne({where: {"Email_Studente": obj.email}})
            .then( doc => {
                if(doc === null){
                    res.send({msg: "studente non trovato"}).status(403).end();
                }else{
                    res.send(doc).status(200).end();
                }
            });
    } else {
        res.send({msg: "Imposibbile recuperare le info!"}).status(401).end();
    }
});

router.post('/modificaDA', function(req, res){
    let obj = req.body;
    if(obj.nome.match(regex.nome) && obj.cognome.match(regex.nome) && obj.email.match(regex.email) && obj.password.match(regex.password) && obj.codiceFiscale.match(regex.codiceFiscale) && obj.via.match(regex.via) && obj.recapito.match(regex.recapito) && obj.facolta.match(regex.facolta) && obj.matricola.match(regex.matricola)){
        //effettuo la modifica
        studente.update({"Nome": obj.nome, "Cognome": obj.cognome, "Email_Studente": obj.email, "Password": obj.password, "Via": obj.via, "Recapito": obj.recapito, "Facoltà": obj.facolta, "Matricola": obj.matricola, "Status": obj.status, "Codice_Fiscale": obj.codiceFiscale, "bio": obj.bio}, {where: {"Email_Studente": obj.email}})
            .then( doc => {
                console.log(doc);
                if(doc === null){
                    res.statusCode=403;
                    res.send({msg: "Non è stato popssibile modificare i dati di accesso!"}).end();
                }else{
                    res.send({msg: "Modifica dati di accesso effettuata!"}).end();
                    //res.send(doc).status(200).end()
                }
            });
    } else {
        res.send({msg: "Errore nel formato"}).status(400).end();
    }
});

module.exports = router;