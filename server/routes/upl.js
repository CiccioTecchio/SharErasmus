let express = require('express');
let router = express.Router();
let studente = require('../model/Studente');
let coordinatore = require('../model/Coordinatore');
let upload = require('express-fileupload');
let fs = require("fs");
//var credenziali = require('./crede');
//var nodemailer = require('nodemailer');
router.use(upload({
    // limits: { fileSize: 50 * 1024 * 1024 }, per inserire un limite al file da uplodare, [meno di 1mb]
}));
/**
 * Post: Restituisce statusCode 403, nel caso in cui non sia possibile inserire il path del file  nel db, 200 in caso di successo.
 * Desc: Permette l'inserimento dell'immagine del profilo di uno studente o coordinatore alla piattaforma.
 */

router.post("/upl", function(req, res){
    let obj = req.body;
    if (obj.email.includes("@studenti.unisa.it")){
        //studente
        if(req.files){
            let file = req.files.filename;
            let filename = file.name;
            //provo ad eliminare il path a prescindere
            //prendo l'estensione
            //name.slice((name.lastIndexOf('.') - 1 >>> 0) + 2);
            try{
                //su mac o linux mettere /
                fs.mkdirSync('../server/upload\\'+obj.email);
                console.log('../server/upload\\'+obj.email+' is created');
            } catch(err){
                if(err.code == 'EXXIST'){
                    console.log('The direcotry name is named' +obj.email+' exists');
                    //setto null in studente ed elimino il path per poi ricreare il tutto
                    file.mv("../server/upload/"+obj.email+"\\"+filename, function(err){
                        if (err){
                            res.send("error occurred");
                        } else {
                            //carico il path nel db;
                            //per linux o mac mettere /
                            studente.update({"imgProfiloPath": "../server/upload/"+obj.email+"\\"+file.name}, {where: {"emailStudente": obj.email}})
                                .then( doc => {
                                    if(doc == false ){
                                        res.statusCode=403;
                                        res.send({msg: "Non è stato possibile inserire il path nel db!"}).end();
                                    }else{
                                        //renameFile(obj.email,filename);
                                        res.statusCode = 200;
                                        //res.send({msg: "Path dello studnete inserito!"}).end();
                                        res.redirect("/profil_users.html").end();
                                    }
                                });
                        }
                    });
                } else {
                    console.log(err);
                }
            }
            //per windows utilizzare il doppio \\ prima  di inserire il nome del file.
            //per mac o linux mettere /
            file.mv("../server/upload/"+obj.email+"\\"+filename, function(err){
                if (err){
                    res.send("error occurred");
                } else {
                    //carico il path nel db;
                    //per linux o mac mettere /
                    studente.update({"imgProfiloPath": "../server/upload/"+obj.email+"\\"+file.name}, {where: {"emailStudente": obj.email}})
                        .then( doc => {
                            if(doc == false ){
                                res.statusCode=403;
                                res.send({msg: "Non è stato possibile inserire il path nel db!"}).end();
                            }else{
                                //renameFile(obj.email,filename);
                                res.statusCode = 200;
                                //res.send({msg: "Path dello studnete inserito!"}).end();
                                res.redirect("/profil_users.html").end();
                            }
                        });
                }
            });
        } else {
            res.send("File empty!");
        }
    } else {
        //coordinatore
        if(req.files){
            let file = req.files.filename;
            let filename = file.name;
            //provo ad eliminare il path a prescindere
            //prendo l'estensione
            //name.slice((name.lastIndexOf('.') - 1 >>> 0) + 2);
            try{
                //su mac o linux mettere /
                fs.mkdirSync('../server/upload\\'+obj.email);
                console.log('../server/upload\\'+obj.email+' is created');
            } catch(err){
                if(err.code == 'EXXIST'){
                    console.log('The direcotry name is named' +obj.email+' exists');
                    //setto null in studente ed elimino il path per poi ricreare il tutto
                    file.mv("../server/upload/"+obj.email+"\\"+filename, function(err){
                        if (err){
                            res.send("error occurred");
                        } else {
                            //carico il path nel db;
                            //per linux o mac mettere /
                            coordinatore.update({"imgProfiloPath": "../server/upload/"+obj.email+"\\"+file.name}, {where: {"emailCoordinatore": obj.email}})
                                .then( doc => {
                                    if(doc == false ){
                                        res.statusCode=403;
                                        res.send({msg: "Non è stato possibile inserire il path nel db!"}).end();
                                    }else{
                                    //renameFile(obj.email,filename);
                                        res.statusCode = 200;
                                        //res.send({msg: "Path dello studnete inserito!"}).end();
                                        res.redirect("/profil_user.html").end();
                                    }
                                });
                        }
                    });
                } else {
                    console.log(err);
                }
            }
            //per windows utilizzare il doppio \\ prima  di inserire il nome del file.
            //per mac o linux mettere /
            file.mv("../server/upload/"+obj.email+"\\"+filename, function(err){
                if (err){
                    res.send("error occurred");
                } else {
                    //carico il path nel db;
                    //per linux o mac mettere /
                    coordinatore.update({"imgProfiloPath": "../server/upload/"+obj.email+"\\"+file.name}, {where: {"emailCoordinatore": obj.email}})
                        .then( doc => {
                            if(doc == false ){
                                res.statusCode=403;
                                res.send({msg: "Non è stato possibile inserire il path nel db!"}).end();
                            }else{
                            //renameFile(obj.email,filename);
                                res.statusCode = 200;
                                //res.send({msg: "Path dello studnete inserito!"}).end();
                                res.redirect("/profil_users.html").end();
                            }
                        });
                }
            });
        } else {
            res.send("File empty!");
        }
    }
});
module.exports = router;