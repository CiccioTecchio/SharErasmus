let express = require('express');
let router = express.Router();
let studente = require('../model/Studente');
let coordinatore = require('../model/Coordinatore');
let upload = require('express-fileupload');
var fs = require("fs");
var path = require('path');
//var credenziali = require('./crede');
//var nodemailer = require('nodemailer');
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

router.get("/upl", function(req,res){

});

/**
 * Post: Restituisce statusCode 403, nel caso in cui non sia possibile inserire il path del file  nel db, 200 in caso di successo.
 * Desc: Permette l'inserimento dell'immagine del profilo di uno studente o coordinatore alla piattaforma.
 */
router.post("/upl", function(req,res){
    let obj = req.body;
    if (obj.email.includes("@studenti.unisa.it")){
            //studente
            if(req.files){
                var file = req.files.filename,
                filename = file.name;
                try{
                    fs.mkdirSync('../server/upload/'+obj.email);
                    console.log('../server/upload/'+obj.email+' is created');
                } catch(err){
                    if(err.code == 'EXXIST'){
                        console.log('The direcotry name is named' +obj.email+' exists');
                    } else {
                        console.log(err);
                    }
                }
                //per windows utilizzare il doppio \\ prima  di inserire il nome del file.
                file.mv("../server/upload/"+obj.email+"/"+filename,function(err){
                    if (err){
                    res.send("error occurred")
                    } else {
                        //carico il path nel db;
                        studente.update({"imgProfiloPath": "../server/upload/"+obj.email+"/"+file.name}, {where: {"emailStudente": obj.email}})
                        .then( doc => {
                            if(doc == false ){
                                res.statusCode=403;
                                res.send({msg: "Non è stato possibile inserire il path nel db!"}).end();
                            }else{
                                renameFile(obj.email,filename);
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
            //per windows utilizzare il doppio \\ prima  di inserire il nome del file.
            file.mv("../server/upload/"+filename,function(err){
                if (err){
                res.send("error occurred")
                } else {
                    coordinatore.update({"imgProfiloPath": "../server/upload\\"+file.name}, {where: {"emailCoordinatore": obj.email}})
                    .then( doc => {
                        if(doc == false ){
                            res.statusCode=403;
                            res.send({msg: "Non è stato possibile inserire il path nel db!"}).end();
                        }else{
                            renameFile(obj.email,filename);
                            res.statusCode = 200;
                            res.send({msg: "Path del coordinatore inserito!"}).end();
                        }
                    });
                }
            })
            //path.extname('index.html')
            //var prova='';
            //var path = require('../upload\\'+filename);
            //prova.renameSync('../server/upload\\'+filename, '../server/upload\\'+obj.email+path.extname(filename));
        } else {
            res.send("File empty!");
        }
    }
});

function renameFile(email,nomefile){
    var ext = path.extname('../server/upload/'+nomefile);
    console.log(ext);
    fs.renameSync("../server/upload/"+email+"/"+nomefile,"../server/upload/"+email+"/"+email+ext);
    console.log(nomefile+' now is: '+email+"!");
}

module.exports = router;