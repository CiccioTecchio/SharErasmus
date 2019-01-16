let express = require('express');
let router = express.Router();
let studente = require('../model/Studente');
let coordinatore = require('../model/Coordinatore');
let upload = require('express-fileupload');
var credenziali = require('./crede');
var nodemailer = require('nodemailer');
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

let token;

/** 
 * 
 * Post: Restituisce statusCode 200 se la registrazione va a buon fine, 400 in caso in cui un utente prova a registrarsi alla piattaforma e l'email è già presente, 401 in caso di errore nell'inserimento dei dati.
 * Desc: Permette la registrazione di uno studente o coordinatore alla piattaforma.
*/

router.post('/registrazione',function(req,res){
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

/*
router.post("/upl", function(req,res){
    let obj = req.body;
    if (obj.email.includes("@studenti.unisa.it")){
            //studente
            if(req.files){
                var file = req.files.filename,
                filename = file.name;
                file.mv("../server/upload\\"+filename,function(err){
                    if (err){
                    res.send("error occurred")
                    } else {
                        //carico il path nel db;
                        studente.update({"imgProfiloPath": "../server/upload\\"+file.name}, {where: {"emailStudente": obj.email}})
                        .then( doc => {
                            if(doc == false ){
                                res.statusCode=403;
                                res.send({msg: "Non è stato possibile inserire il path nel db!"}).end();
                            }else{
                                res.statusCode = 200;
                                res.send({msg: "Path dello studnete inserito!"}).end();
                            }
                        });
                    }
                })
            } else {
                res.send("File empty!");
            }
    } else {
        //coordinatore
        if(req.files){
            var file = req.files.filename,
            filename = file.name;
            file.mv("../server/upload\\"+filename,function(err){
                if (err){
                res.send("error occurred")
                } else {
                    coordinatore.update({"imgProfiloPath": "../server/upload\\"+file.name}, {where: {"emailCoordinatore": obj.email}})
                    .then( doc => {
                        if(doc == false ){
                            res.statusCode=403;
                            res.send({msg: "Non è stato possibile inserire il path nel db!"}).end();
                        }else{
                            res.statusCode = 200;
                            res.send({msg: "Path del coordinatore inserito!"}).end();
                        }
                    });
                }
            })
        } else {
            res.send("File empty!");
        }
    }
});
*/


/**
 * Post: Restituisce una stringa.
 * Desc: Funzione che permette di generare un token composto da numeri e lettere in maniera casuale.
 */
/*
function generaToken (){
    let _sym = 'abcdefghijklmnopqrstuvwxyz1234567890',
    tkn = '';
    for(var i = 0; i < 20; i++) {
        tkn += _sym[parseInt(Math.random() * (_sym.length))];
    }
    console.log('GUID prodotta: '+tkn);
    return tkn;
}
*/

//ul,m.

/**
 * 
 * @param {String} Ptoken 
 * @param {String} email
 * Post: Restituisce una stringa "Puoi inserirlo" in caso in cui il token generato è univoco, altriemnti "Duplicato".
 * Desc: Questa funzione permette di verificare se il token prodotto per uno studente o coordinatore, è già associato ad un'account. 
 */
/*
function checkToken(Ptoken,email){
    let ritorna = "Puoi inserirlo!";
        if(email.includes('@studenti.unisa.it')){
            studente.findOne({where: {"passToken": Ptoken}})
            .then( doc => {
            if(doc === null){
                ritorna = "Doppione!";
            }
        });
    } else {
        coordinatore.findOne({where: {"passToken": Ptoken}})
        .then( doc => {
        if(doc === null){
            ritorna = "Doppione!";
        }
    });
    }
    return ritorna;
}

var statusGlobale='';
*/

/**
 * 
 * @param {String} emailDestinatario 
 * @param {String} Vtoken
 * Post: Setta una variabile con "Esiste" in caso positivo e "Non trovato" in caso negativo.
 * Desc: Funzione che prende email e token e li confronta con i dati nel db, se trova corrispondenza setta una variabile con la stringa "Esiste", altrimenti "Non trovato".
 */
/*
function verifyToken(emailDestinatario,Vtoken){
    var tokenAccount = '';
    if(emailDestinatario.includes('@studenti.unisa.it')){
        // is a stdeunt 
        studente.findOne({where: {"emailStudente": emailDestinatario}, attributes: ['passToken']})
    .then(list => {
        if(list != null){
            var data = list;
            tokenAccount = data['passToken'];

            //controllo 
            statusGlobale = 'Esiste';
            console.log('/// -- Funzione per la verifica del token -- ///');
            console.log('StausGlobale dopo il richiamo della funzione ritornaToken vale: '+statusGlobale);
            console.log('Token passato per verificare la corrsipondenza: '+Vtoken);
            console.log('Token dell account: '+emailDestinatario +' ricavato dal db è: '+tokenAccount);
            if (Vtoken == ' undefined' || tokenAccount == 'undefined' || Vtoken != tokenAccount){
                statusGlobale = 'Non trovato';
            } else {
                studente.findOne({where: {"emailStudente": emailDestinatario, "passToken": Vtoken}})
                .then(doc => {
                    if(doc == null){
                        //statusGlobale = 'Non trovato';
                        console.log('Utente con quel token non trovato');
                    } else {
                        //statusGlobale = 'Esiste';
                        console.log('Utente con quel token trovato');
                    }
                })
            }
        }
    })
    } else {
        // is a coordinator
        coordinatore.findOne({where: {"emailCoordinatore": emailDestinatario}, attributes: ['passToken']})
        .then(list => {
        if(list != null){
            var data = list;
            tokenAccount = data['passToken'];

            //controllo 
            statusGlobale = 'Esiste';
            console.log('/// -- Funzione per la verifica del token -- ///');
            console.log('StausGlobale dopo il richiamo della funzione ritornaToken vale: '+statusGlobale);
            console.log('Token passato per verificare la corrsipondenza: '+Vtoken);
            console.log('Token dell account: '+emailDestinatario +' ricavato dal db è: '+tokenAccount);
            if (Vtoken == ' undefined' || tokenAccount == 'undefined' || Vtoken != tokenAccount){
                statusGlobale = 'Non trovato';
            } else {
                coordinatore.findOne({where: {"emailCoordinatore": emailDestinatario, "passToken": Vtoken}})
                .then(doc => {
                    if(doc == null){
                        //statusGlobale = 'Non trovato';
                        console.log('Utente con quel token non trovato');
                    } else {
                        //statusGlobale = 'Esiste';
                        console.log('Utente con quel token trovato');
                    }
                })
            }
        }
    })
    }
    console.log('/// -- Fine funzione per la verifica del token -- ///');
}


function generaLink(emailDestinatario,Ltoken){
    let link = "";
    link = "http://localhost:3000/insertNewPassword.html"+"?email="+emailDestinatario+"&token="+Ltoken;
    return link;
}

function sendEmailForgotPassword(emailDestinatario,nominativo,link){
    console.log('emailDestinatario is: '+emailDestinatario);
    console.log('username is: ' + credenziali.username);
    console.log('password is: ' + credenziali.password);

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: credenziali.username,
        pass: credenziali.password
    }
});

var mailOptions = {
  from: 'sharerasmus2018@gmail.com',
  to: emailDestinatario,
  subject: 'Sharerasmus reset Password',
  text: 'Dear '+nominativo+','+'\nClick this link for reset password:'+link
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


router.post('/forgotPassword', function(req, res){
    let obj = req.body;
    //let token;
    if(obj.email.match(regex.email)){
        if(obj.email.includes('@studenti.unisa.it')){
             //forgot student password
             //prima genero il token e poi vedo se è già presente all'interno del db da qualche altro account
            console.log('Genero token per il recupero password studente!');
            token = generaToken();
                while(true){
                    let result = checkToken(token,obj.email);
                    console.log('result is: '+result);
                    if(result.includes('Doppione!')){
                        token=generaToken();
                    } else {
                        break;
                    }
                }
                studente.update({"passToken": token}, {where: {"emailStudente": obj.email}})
                .then( doc => {
                    if(doc == false ){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile inserire il token!"}).end();
                    }else{
                        res.statusCode = 200;
                        res.send({msg: "Token inserito!"}).end();
                    }
                });
                //invio mail!
                //sostituire sharerasmus2018@gamil.com con obj.email
                let link= generaLink(obj.email,token);
                sendEmailForgotPassword(obj.email,obj.nome,link);

        } else {
            //forgot coordinator password
            console.log('Genero token per il recupero password coordinatore!');
            token = generaToken();
            while(true){
                let result = checkToken(token,obj.email);
                console.log('result is: '+result);
                if(result.includes('Doppione!')){
                    token=generaToken();
                } else {
                    break;
                }
            }
            coordinatore.update({"passToken": token}, {where: {"emailCoordinatore": obj.email}})
            .then( doc => {
                if(doc == false ){
                    res.statusCode=403;
                    res.send({msg: "Non è stato possibile inserire il token!"}).end();
                }else{
                    res.statusCode = 200;
                    res.send({msg: "Token inserito!"}).end();
                }
            });
            
            //invio mail!
            //sostituire sharerasmus2018@gamil.com con obj.email
            let link= generaLink(obj.email,token);
            sendEmailForgotPassword("sharerasmus2018@gmail.com",obj.nome,link);
        }
    } else {
        res.statusCode = 401;
        res.send({msg:"Errore nel formato"}).end();
    }
});

router.get('/reset', function(req, res){

});

router.post('/reset', function(req, res){
    let obj = req.body;
    let mom = '';
    //controllo se esiste un token per quell'email
    //sia l'email che il token che la nuova password vengono inviati dal client!
    //devo prendere dall'url della pagina html!
    //setta il
    token = obj.token;
    verifyToken(obj.email,token);
    console.log('Sto in /reset e statusGlobale vale: '+statusGlobale);
    //la funzione la scrivo  direttamente quà dentro 
    if(obj.email.includes('@studenti.unisa.it')){
        //studente
        //prima di statusGlobale usavo resultVer
        studente.findOne({where: {"emailStudente":obj.email, "password":obj.password}})
            .then(doc => {
                if(doc == null){
                    //non è stato trovato
                    //statusGlobale = 'Non trovato';
                    mom = 'Non trovato';
                } else {
                    mom = 'Esiste';
                    //statusGlobale = 'Esiste';
                    //è stato trovato
                }
                console.log('statusGloable prima dell if nel quale verifica se include esiste vale: '+statusGlobale);
                console.log('mom prima dell if nel quale verifica se include esiste vale: '+mom);
                if(statusGlobale.includes('Esiste')){
                    studente.update({"password": obj.nuovaPassword, "passToken": null}, {where: {"emailStudente": obj.email}})
                    .then( doc => {
                        if(doc == false ){
                            res.statusCode=403;
                            res.send({msg: "Non è stato possibile inserire la nuova Password!"}).end();
                        }else{
                            res.statusCode = 200;
                            res.send({msg: "Password cambiata!"}).end();
                            console.log('Set Default statusGloabl');
                            statusGlobale='Non trovato';
                        }
                    });
                } else {
                    //riporto errore
                    res.statusCode=403;
                    res.send({msg: "Token non valido per account: "+obj.email}).end();
                }
        })
   } else {
        //coordinatore
        studente.findOne({where: {"emailStudente":obj.email, "password":obj.password}})
            .then(doc => {
                if(doc == null){
                    //non è stato trovato
                    //statusGlobale = 'Non trovato';
                    mom = 'Non trovato';
                } else {
                    mom = 'Esiste';
                    //statusGlobale = 'Esiste';
                    //è stato trovato
                }
        console.log('statusGloab Coordinatore prima del if per vedere se include Esistente '+statusGlobale);
        console.log('mom prima dell if nel quale verifica se include esiste vale: '+mom);
        if(statusGlobale.includes('Esiste')){
            coordinatore.update({"password": obj.nuovaPassword, "passToken": null}, {where: {"emailCoordinatore": obj.email}})
            .then( doc => {
                if(doc == false ){
                    res.statusCode=403;
                    res.send({msg: "Non è stato possibile inserire la nuova Password!"}).end();
                }else{
                    res.statusCode = 200;
                    res.send({msg: "Password cambiata!"}).end();
                    console.log('Set Default statusGloabl');
                    statusGlobale='Non trovato';
                }
            });
        } else {
            //riporto errore
            res.statusCode=403;
            res.send({msg: "Token non valido per account: "+obj.email}).end();
        }
    })
}
});
*/

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
    let obj = req.body;
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
    let obj = req.body;
    //req.query.email
    if(req.query.email.match(regex.email)){
        if(req.query.email.includes('@studenti.unisa.it')){
            studente.findOne({where: {"emailStudente": req.query.email}})
                .then( doc => {
                    if(doc === null){
                        res.statusCode = 403;
                        res.send({ msg: "studente non trovato" }).end();
                    } else {
                        //var content;
                         /*let path = doc.imgProfiloPath;
                         if(path!=null) {
                             doc.imgProfiloPath= new Buffer(fs.readFileSync(path)).toString("base64");
                            }
                          else {
                              doc.imgProfiloPath=null;
                            }
                            */
                         /*if(path!=null) {
                             doc.imgProfiloPath = new Buffer(fs.readFile(path,function(err,data){
                                if(err){
                                    throw err;
                                } else {
                                    content = data;
                                    content.toString("base64");
                                }
                             }))
                         } else {
                             doc.imgProfiloPath = null;
                         }
                         */
                        new Promise((resolve, reject) => {
                            let path = doc.imgProfiloPath;
                            if(path!=null) {
                                doc.imgProfiloPath= new Buffer(fs.readFileSync(path)).toString("base64");
                               }
                             else {
                                 doc.imgProfiloPath=null;
                               }
                        }).then(val => {
                            res.send(doc).status(200).end();
                        })
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
                        new Promise((resolve, reject) => {
                            let path = doc.imgProfiloPath;
                            if(path!=null) {
                                doc.imgProfiloPath= new Buffer(fs.readFileSync(path)).toString("base64");
                               }
                             else {
                                 doc.imgProfiloPath=null;
                               }
                        }).then(val => {
                            res.send(doc).status(200).end();
                        })
                        res.send(doc).status(200).end();
                    }
                });
        }
    } else {
        res.statusCode = 401;
        res.send({msg:"Errore nel formato"}).end();
    }
});

/*
router.post('/modificaDA', function(req, res){
    let nuovi = req.query.nuovi;
    let vecchi = req.query.vecchi;
    if(nuovi.nome.match(regex.nome) && nuovi.cognome.match(regex.nome) && nuovi.email.match(regex.email) && nuovi.password.match(regex.password) && nuovi.codiceFiscale.match(regex.codiceFiscale) && nuovi.via.match(regex.via) && nuovi.recapito.match(regex.recapito) && nuovi.facolta.match(regex.facolta) && nuovi.matricola.match(regex.matricola)){
        if(req.query.vecchi.email.includes('@studenti.unisa.it')){
        //effettuo la modifica dei dati dello studente
            studente.update({"nome": nuovi.nome, "cognome": nuovi.cognome, "emailStudente": nuovi.email, "password": nuovi.password, "via": nuovi.via, "recapito": nuovi.recapito, "facolta": nuovi.facolta, "matricola": nuovi.matricola, "status": nuovi.status, "codiceFiscale": nuovi.codiceFiscale, "bio": nuovi.bio}, {where: {"emailStudente": req.query.vecchi.email}})
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
            coordinatore.update({"nome": nuovi.nome, "cognome": nuovi.cognome, "password": nuovi.password, "emailCoordinatore": nuovi.email, "bio": nuovi.bio, "codiceFiscale": nuovi.codiceFiscale, "via": nuovi.via, "recapito": nuovi.recapito, "ruolo": nuovi.ruolo, "facolta": nuovi.facolta}, {where: {"emailCoordinatore": req.query.vecchi.email}})
                .then( doc => {
                    if(doc == 0){
                        res.statusCode=403;
                        res.send({msg: "Non è stato possibile modificare i dati di accesso!"}).end();
                    }else{
                        res.statusCode = 200;
                        res.send({msg: "Modifica dati di accesso effettuata!"}).end();
                    }
                });
        }
    } else {
        res.statusCode = 401;
        res.send({msg: "Errore nel formato"}).end();
    }
});
*/


//imgProfiloPath non l'ho messo.
//ho tolto Bio
router.post('/modificaDA', function(req,res){
    let nuovi = req.body;
    //let vecchi = req.body.vecchi;
    //console.log('email passata: '+ vecchi.email);
    //console.log('Nome: '+ nuovi.nome);
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
                })
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
                })
        } else {
            //errore nel formato
            res.statusCode=401;
            res.send({msg:"Errore nel formato, Regex non rispettate"}).end();
        }
    }
})

module.exports = router;