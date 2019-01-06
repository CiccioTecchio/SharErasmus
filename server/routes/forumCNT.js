let express = require('express');
let routes = express.Router();
let post = require('../model/Post');
let risposta = require('../model/Risposta');

let regexp={
    date:/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g,
    ora: /^((?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$)/g,
    tag: /#(\w+)/g,
    // eslint-disable-next-line no-useless-escape
    email: /[a-zA-Z0-9\._-]+[@][a-zA-Z0-9\._-]+[.][a-zA-Z]{2,6}/g
};

routes.get('/getallpost', function(req, res){
    post.findAll({attributes:['post', 'Data', 'Ora', 'Tag', 'Email_Studente', 'Email_Coordinatore']})
        .then(doc => res.send(doc).status(200).end());
    /*.catch(err => {
        res.statusCode= 400;
        res.send({msg: 'Errore'}).end();
    });*/ 
});

routes.post('/insertpost', function(req, res){
    let obj  = req.body;

    if(obj.data.match(regexp.date) && obj.ora.match(regexp.ora) && obj.tag.match(regexp.tag) && obj.email.match(regexp.email)){

        if(obj.email.includes('@studenti.unisa.it')){

            post.create({ID_Post:obj.id, post: obj.post, Data: obj.data, Ora:obj.ora, Tag:obj.tag, Fissato:0, Email_Studente:obj.email})
                .then(doc => res.send(doc).status(200).end())
                .catch(err => {
                    res.statusCode= 400;
                    res.send({msg: 'Impossibile inserire il post'}).end();
                });
        }else{
            post.create({ID_Post:obj.id, post: obj.post, Data: obj.data, Ora:obj.ora, Tag:obj.tag, Fissato:obj.fissato, Email_Coordinatore:obj.email})
                .then(doc => res.send(doc).status(200).end())
                .catch(err => {
                    res.statusCode= 400;
                    res.send({msg: 'Impossibile inserire il post'}).end();
                });
        }
    }else{
        res.statusCode=401;
        res.send({msg:'Errore nel formato'}).end();
    }
});

routes.post('/getidreply', function(req, res){
    let obj = req.body;
    risposta.find({where:{ID_Risposta:obj.id}})
        .then(doc => res.send(doc).status(200).end());
    /*.catch(err => {
        res.statusCode= 400;
        res.send({msg: 'Errore'}).end();
    });*/

});

routes.post('/insertreply', function(req, res){
    let obj= req.body;
    
    if(obj.data.match(regexp.date) && obj.ora.match(regexp.ora) && obj.email.match(regexp.email)){

        if(obj.email.includes("@studenti.unisa.it")){
            risposta.create({ID_Risposta:obj.id, Risposta:obj.risposta, Data:obj.data, Ora:obj.ora, ID_Post:obj.idp, Email_Studente:obj.email})
                .then(doc => res.send(doc).status(200).end())
                .catch(err => {
                    res.statusCode= 400;
                    res.send({msg: 'Impossibile inserire la risposta'}).end();
                });
        }else{
            risposta.create({ID_Risposta:obj.id, Risposta:obj.risposta, Data:obj.data, Ora:obj.ora, ID_Post:obj.idp, Email_Coordinatore:obj.email})
                .then(doc => res.send(doc).status(200).end())
                .catch(err => {
                    res.statusCode= 400;
                    res.send({msg: 'Impossibile inserire la risposta'}).end();
                });
        }

    }else{
        res.statusCode=401;
        res.send({msg:"Errore nel formato"}).end();
    }
});

module.exports=routes;