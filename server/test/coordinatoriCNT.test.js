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
        "student": "s.corso1@studenti.unisa.t",
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