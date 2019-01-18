let express = require('express');
let router = express.Router();
let studente = require('../model/Studente');
let coordinatore = require('../model/Coordinatore');
let upload = require('express-fileupload');
let credenziali = require('./crede');
let nodemailer = require('nodemailer');
router.use(upload({
    // limits: { fileSize: 50 * 1024 * 1024 }, per inserire un limite al file da uplodare, [meno di 1mb]
}));

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
 * Post: Restituisce una stringa.
 * Desc: Funzione che permette di generare un token composto da numeri e lettere in maniera casuale.
 */
function generaToken (){
    let _sym = 'abcdefghijklmnopqrstuvwxyz1234567890',
        tkn = '';
    for(let i = 0; i < 20; i++) {
        tkn += _sym[parseInt(Math.random() * (_sym.length))];
    }
    console.log('GUID prodotta: '+tkn);
    return tkn;
}


/**
 * 
 * @param {String} Ptoken 
 * @param {String} email
 * Post: Restituisce una stringa "Puoi inserirlo" in caso in cui il token generato è univoco, altriemnti "Duplicato".
 * Desc: Questa funzione permette di verificare se il token prodotto per uno studente o coordinatore, è già associato ad un'account. 
 */
function checkToken(Ptoken, email){
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

let statusGlobale='';


/**
 * 
 * @param {String} emailDestinatario 
 * @param {String} Vtoken
 * Post: Setta una variabile con "Esiste" in caso positivo e "Non trovato" in caso negativo.
 * Desc: Funzione che prende email e token e li confronta con i dati nel db, se trova corrispondenza setta una variabile con la stringa "Esiste", altrimenti "Non trovato".
 */
function verifyToken(emailDestinatario, Vtoken){
    let tokenAccount = '';
    if(emailDestinatario.includes('@studenti.unisa.it')){
        // is a stdeunt 
        studente.findOne({where: {"emailStudente": emailDestinatario}, attributes: ['passToken']})
            .then(list => {
                if(list != null){
                    let data = list;
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
                            });
                    }
                }
            });
    } else {
        // is a coordinator
        coordinatore.findOne({where: {"emailCoordinatore": emailDestinatario}, attributes: ['passToken']})
            .then(list => {
                if(list != null){
                    let data = list;
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
                                    console.log('Coordinatore con quel token non trovato');
                                } else {
                                    //statusGlobale = 'Esiste';
                                    console.log('Coordinatore con quel token trovato');
                                }
                            });
                    }
                }
            });
    }
    console.log('/// -- Fine funzione per la verifica del token -- ///');
}


function generaLink(emailDestinatario, Ltoken){
    let link = "";
    link = "http://ec2-3-86-92-127.compute-1.amazonaws.com:3000/insertNewPassword.html"+"?email="+emailDestinatario+"&token="+Ltoken;
    return link;
}

function sendEmailForgotPassword(emailDestinatario, nominativo, link){
    console.log('emailDestinatario is: '+emailDestinatario);
    console.log('username is: ' + credenziali.username);
    console.log('password is: ' + credenziali.password);

    let transporter = nodemailer.createTransport({
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
    text: 'Caro '+nominativo+','+'\nClicca questo link per eseguire il reset della password:'+link
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
            // eslint-disable-next-line no-constant-condition
            while(true){
                let result = checkToken(token, obj.email);
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
            //sostituire User con obj.nome
            let link= generaLink(obj.email, token);
            sendEmailForgotPassword(obj.email, "User", link);

        } else {
            //forgot coordinator password
            console.log('Genero token per il recupero password coordinatore!');
            token = generaToken();
            // eslint-disable-next-line no-constant-condition
            while(true){
                let result = checkToken(token, obj.email);
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
            let link= generaLink(obj.email, token);
            sendEmailForgotPassword(obj.email, obj.nome, link);
        }
    } else {
        res.statusCode = 401;
        res.send({msg:"Errore nel formato"}).end();
    }
});
router.post('/reset', function(req, res){
    let obj = req.body;
    let mom = '';
    //controllo se esiste un token per quell'email
    //sia l'email che il token che la nuova password vengono inviati dal client!
    //devo prendere dall'url della pagina html!
    //setta il
    token = obj.token;
    verifyToken(obj.email, token);
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
                            //res.send({msg: "Password cambiata!"}).end();
                            res.redirect('/index.html').end();
                            console.log('Set Default statusGloabl');
                            statusGlobale='Non trovato';
                        }
                    });
                } else {
                    //riporto errore
                    res.statusCode=403;
                    res.send({msg: "Token non valido per account: "+obj.email}).end();
                }
            });
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
                    res.send({msg: "Non è stato possibile inserire la nuova Password!"}).end();
                }else{
                    res.statusCode = 200;
                    //res.send({msg: "Password cambiata!"}).end();
                    res.send('/index.html').end();
                    console.log('Set Default statusGloabl');
                    statusGlobale='Non trovato';
                }
            });
    }
});

module.exports = router;