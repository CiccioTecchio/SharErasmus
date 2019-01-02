process.env.NODE_ENV = 'test';

let expect  = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let randomstring = require("randomstring");
let server = require('../app');
// eslint-disable-next-line no-unused-vars
let  should = chai.should();
chai.use(require('chai-match'));
chai.use(chaiHttp);

//TODO: RIMUOVERE TUTTI GLI ID QUANDO VERRANNO AUTO INCREMENTATI

it('Dovrebbe restituire tutti i post', function(done){
    chai.request(server)
        .get('/forum/getallpost')
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
});

describe('Inserimento Post', function(){ 

    it('Errore del formato', function(done){
        let post = {
            id:44, //da rimuovere quando verrà inserita l'autoincrement
            post:randomstring.generate(100), 
            data:"20-12-2018", //formato data errato
            ora:"12:40:21",
            tag:"#test"+randomstring.generate(3),
            email:"l.davinci@studenti.unisa.it"
        };
    
        chai.request(server)
            .post('/forum/insertpost')
            .send(post)
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });

    });

    it('Studente: Inserimento a buon fine', function(done){
        let post = {
            id:45, //da rimuovere quando verrà inserita l'autoincrement
            post:randomstring.generate(100), 
            data:"2018-12-20",
            ora:"12:40:21",
            tag:"#test"+randomstring.generate(3),
            email:"l.davinci@studenti.unisa.it"
        };

        chai.request(server)
            .post('/forum/insertpost')
            .send(post)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

    it('Studente: Inserimento non a buon fine', function(done){
        let post = {
            id:23, //da rimuovere quando verrà inserita l'autoincrement
            post:randomstring.generate(100), 
            data:"2018-12-20",
            ora:"12:40:21",
            tag:"#test"+randomstring.generate(3),
            email:"l.davinci@studenti.unisa.it"
        };

        chai.request(server)
            .post('/forum/insertpost')
            .send(post)
            .end(function(err, res){
                res.should.have.status(400);
                done();
            });
    });

    it('Coordinatore: Inserimento a buon fine', function(done){
        let post = {
            id:46, //da rimuovere quando verrà inserita l'autoincrement
            post:randomstring.generate(100), 
            data:"2018-12-20",
            ora:"12:40:21",
            tag:"#test"+randomstring.generate(3),
            fissato:"0",
            email:"fferrucci@unisa.it"
        };

        chai.request(server)
            .post('/forum/insertpost')
            .send(post)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

    it('Coordinatore: Inserimento non a buon fine', function(done){
        let post = {
            id:23, //da rimuovere quando verrà inserita l'autoincrement
            post:randomstring.generate(100), 
            data:"2018-12-20",
            ora:"12:40:21",
            tag:"#test"+randomstring.generate(3),
            fissato:"0",
            email:"fferrucci@unisa.it"
        };

        chai.request(server)
            .post('/forum/insertpost')
            .send(post)
            .end(function(err, res){
                res.should.have.status(400);
                done();
            });
    });

});

it('Risposte esistenti', function(done){
    let id= "0";
    chai.request(server)
        .post('/forum/getidreply')
        .send(id)
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
});

describe('Inserimento Risposta', function(){ 

    it('Errore del formato', function(done){
        let reply = {
            id:23, //da rimuovere quando verrà inserita l'autoincrement
            risposta: ""+randomstring.generate(100), 
            data:"20-12-2018", //formato data errato
            ora:"12:40:21",
            idp:"5",
            email:"l.davinci@studenti.unisa.it"
        };
        
        chai.request(server)
            .post('/forum/insertreply')
            .send(reply)
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    
    });
    
    it('Studente: Inserimento a buon fine', function(done){
        let reply = {
            id:24, //da rimuovere quando verrà inserita l'autoincrement
            risposta:randomstring.generate(100), 
            data:"2018-12-20", 
            ora:"12:40:21",
            idp:"5",
            email:"l.davinci@studenti.unisa.it"
        };
    
        chai.request(server)
            .post('/forum/insertreply')
            .send(reply)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    
    it('Studente: Inserimento non a buon fine', function(done){
        let reply = {
            id:0, //da rimuovere quando verrà inserita l'autoincrement
            risposta:randomstring.generate(100), 
            data:"2018-12-20", 
            ora:"12:40:21",
            idp:"5",
            email:"l.davinci@studenti.unisa.it"
        };
    
        chai.request(server)
            .post('/forum/insertreply')
            .send(reply)
            .end(function(err, res){
                res.should.have.status(400);
                done();
            });
    });
    
    it('Coordinatore: Inserimento a buon fine', function(done){
        let reply = {
            id:25, //da rimuovere quando verrà inserita l'autoincrement
            risposta:randomstring.generate(100), 
            data:"2018-12-20", 
            ora:"12:40:21",
            idp:"5",
            email:"fferrucci@unisa.it"
        };
    
        chai.request(server)
            .post('/forum/insertreply')
            .send(reply)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    
    it('Coordinatore: Inserimento non a buon fine', function(done){
        let reply = {
            id:0, //da rimuovere quando verrà inserita l'autoincrement
            risposta:randomstring.generate(100), 
            data:"2018-12-20", 
            ora:"12:40:21",
            idp:"5",
            email:"fferrucci@unisa.it"
        };
    
        chai.request(server)
            .post('/forum/insertreply')
            .send(reply)
            .end(function(err, res){
                res.should.have.status(400);
                done();
            });
    });
    
});