let expect  = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let randomstring = require("randomstring");
let server = require('../app');
let  should = chai.should();
chai.use(require('chai-match'));
chai.use(chaiHttp);

// findEmail
describe("ottenere email studenti non coordinati",function(){
    it('Dovrebbe restituire la lista di tutte le email degli studenti non coordinati dal coordinatore loggato',function(done){
        var obj = 
        {
            "email" : "fferrucci@unisa.it"
        }
        chai.request(server)
        .get("/coordinatore/findEmail")
        .query(obj)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        });
    });
});
//addStudentToList
describe("Aggiungere studente alla lista",function(){
    it("Dovrebbe aggiungere uno studente alla lista",function(done){
        let studente = {
        "student": "s.corso1@studenti.unisa.it",
        "loggedEmail": "fferrucci@unisa.it",
        "citta": "Madrid",
        "nation": "Spagna"
        }
        chai.request(server)
        .post('/coordinatore/addStudentToList')
        .send(studente)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })
    it("Campi vuoti",function(done){
        let studente = {
        "student": "s.corso1@studenti.unisa.t",
        "loggedEmail": "fferrucci@unisa.it",
        "citta": "Madrid",
        }
        chai.request(server)
        .post('/coordinatore/addStudentToList')
        .send(studente)
        .end(function(err,res){
            res.should.have.status(409);
            done();
        })
    })
})
//createMarkers
describe("Inserisce i marker nella mappa corrispondenti alla posizione degli studenti",function(){
    it("Dovrebbe inserire i marker",function(done){
        chai.request(server)
        .get('/coordinatore/createMarkers')
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })
})
//obtainNumber
describe("Assegna ai marker il numero di studenti corrispondente",function(){
    it("Dovrebbe ottenere il numero di studenti per la citta' data",function(done){
        let obj = {
            "citta" : "Londra"
        }
        chai.request(server)
        .get('/coordinatore/obtainNumber')
        .send(obj)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })
})