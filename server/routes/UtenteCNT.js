let express = require('express');
let route = express.Router();
let stud = require('../model/Studente');
let coord = require('../model/Coordinatore');
let singleton = require('../singleton/singleton');

const Op = singleton.Op;


/*route.post('/signup',function(req,res){
    let obj= req.body;
    if(obj.email== regex for email && obj.foo= regexp for foo ...)
    controlli effettuati se controllo fallito res.sendStatus(409).send({message: "errore"}.end())
    else {
        check radio capisco studente or coord
        if(studente){
            stud.create(params)
            .then(doc => res.send(doc).status(200).end())
            .cath(err => res.send({message: foo}.statusCode(409).end()))
        }else{
            coord.create(params)
        }
    }
})


route.post('/signin', function(req,res)){
controllo campi
check mail if @studenti allora 
stud.findOne(param).then(doc=> res.send(doc).status(200).end()).catch(err>= foo...)
altrimenti coord.findOne
}
*/

route.post('/signup', function(req, res) {
  if(req.param.Certificato == true)
    {
        coord.create({
            Email_coordinatore: req.body.email,
            Password: req.body.psw, 
            Nome: req.body.name, 
            Cognome: req.body.surname, 
            Codice_Fiscale: req.body.cf, 
            Via: req.body.address ,
            Recapito: req.body.rec,
            Ruolo: req.body.role
          })
          .then(doc => res.send(doc).status(200).end())
          .catch(err => res.sendStatus(409).end(err));
    }
    else
    {
        stud.create(
            {
            Email_Studente: req.body.email,
            Password: req.body.psw, 
            Nome: req.body.name, 
            Cognome: req.body.surname,
            Codice_Fiscale: req.body.cf, 
            Via: req.body.address ,
            Recapito: req.body.rec,
            Facoltà: req.body.fac,
            Matricola: req.body.matr,
            Status: req.body.stat
            })
        .then(doc => res.send(doc).status(200).end())
        .catch(err => res.sendStatus(409).end(err));
    }
   
  
});

route.post('/signin',function(req,res){
    if(stud.findOne({
        where: 
            {Email_Studente: req.body.email, Password: req.body.psw} 
        })
        )
    {
        res.render('Home');
    }
    else
    { 
        if (coord.findOne({
            where: 
                {Email_coordinatore: req.body.email, Password: req.body.psw} 
            })
            )
        {
            res.render('Home');
        }
    }
    })