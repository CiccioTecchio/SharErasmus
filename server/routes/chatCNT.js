let express = require('express');
let router = express.Router();
let studente = require('../model/Studente.js');
let coordinatore = require('../model/Coordinatore.js');
let singleton = require('../singleton/singleton');
let fs = require('fs');
const Op = singleton.Op;
const credeFb= require('../routes/credeFb.json'); 
//All Users in chat

router.get('/credenziali', function(req, res){
    res.send(credeFb);
});

router.get('/chatlist', function (req, res) {
    let allUsers = [];
    studente.findAll({
        attributes: ['nome', 'cognome', 'emailStudente', 'imgProfiloPath'],
        order: ['nome']
    }).then(allStudenti => {
        allUsers.push(allStudenti);
        coordinatore.findAll({
            attributes: ['nome', 'cognome', 'emailCoordinatore', 'imgProfiloPath'],
            order: ['nome']
        }).then(allCoordinatori => {
            allUsers.push(allCoordinatori);
            let len = allUsers[0].length;
            for(let i=0; i<len; i++){
                let cImgPath = allUsers[0][i].dataValues.imgProfiloPath;
                if(cImgPath != null){
                    allUsers[0][i].imgProfiloPath = new Buffer.from(new Buffer(fs.readFileSync(allUsers[0][i].imgProfiloPath), "base64")).toString("base64");
                }
            }
            len = allUsers[1].length;
            for(let i=0; i<len; i++){
                let cImgPath = allUsers[1][i].dataValues.imgProfiloPath;
                if(cImgPath != null){
                    allUsers[1][i].imgProfiloPath = new Buffer.from(new Buffer(fs.readFileSync(allUsers[1][i].imgProfiloPath), "base64")).toString("base64");
                }
            }
            res.send(allUsers);
        })
           // .catch(err => res.sendStatus(404).end(err));
    })
       // .catch(err => res.sendStatus(404).end(err));
});


//Search user
router.get('/cercaUtente', function(req, res){
    let allUsers = [];
    studente.findAll({
        attributes: ['nome', 'cognome', 'emailStudente', 'imgProfiloPath'],
        where:{
            nome :{[Op.like]: req.query.trovaUser +'%'}
        }
         
        
    }).then(allStudenti => {
        allUsers.push(allStudenti);
        coordinatore.findAll({
            attributes: ['nome', 'cognome', 'emailCoordinatore', 'imgProfiloPath'],
            
            where:{
                nome :{[Op.like]: req.query.trovaUser +'%'}
            }
            
        }).then(allCoordinatori => {
            allUsers.push(allCoordinatori);
            let len = allUsers[0].length;
            for(let i=0; i<len; i++){
                let cImgPath = allUsers[0][i].dataValues.imgProfiloPath;
                if(cImgPath != null){
                    allUsers[0][i].imgProfiloPath = new Buffer.from(new Buffer(fs.readFileSync(allUsers[0][i].imgProfiloPath), "base64")).toString("base64");
                }
            }
            len = allUsers[1].length;
            for(let i=0; i<len; i++){
                let cImgPath = allUsers[1][i].dataValues.imgProfiloPath;
                if(cImgPath != null){
                    allUsers[1][i].imgProfiloPath = new Buffer.from(new Buffer(fs.readFileSync(allUsers[1][i].imgProfiloPath), "base64")).toString("base64");
                }
            }
            res.send(allUsers);
        })

            .catch(err => res.sendStatus(404).end(err));
    })
        .catch(err => res.sendStatus(404).end(err));
});


module.exports = router;

