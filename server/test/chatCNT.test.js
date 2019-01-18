// eslint-disable-next-line no-unused-vars
let expect  = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let randomstring = require("randomstring");
let server = require('../app');
// eslint-disable-next-line no-unused-vars
let  should = chai.should();
chai.use(require('chai-match'));
chai.use(chaiHttp);

describe('Credenziali - Chat', function(){
    it('Dovrebbe restituire le credenziali di firebase', function(done){
        chai.request(server)
        .get('/chat/credenziali')
        .end(function(err, res){
            res.should.have.status(200);
            done();
        })
    })
})


describe('Chatlist', function(){
    it('dovrebbe restituire la lista degli studenti', function(done){
        chai.request(server)
        .get('/chat/chatlist')
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })

    it('dovrebbe restituire la lista degli coordinatori', function(done){
        chai.request(server)
        .get('/chat/chatlist')
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })
})


describe('Search User', function(){
    it("dovrebbe ritornare lo studente cercato", function(done){
        let studente = {
            "nome": "pippo31@studenti.unisa.it"
        }
        chai.request(server)
        .get('/chat/chatlist')
        .query(studente)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })

    it("dovrebbe ritornare il coordinatore cercato", function(done){
        let studente = {
            "nome": "fferrucci1@unisa.it"
        }
        chai.request(server)
        .get('/chat/chatlist')
        .query(studente)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })

})