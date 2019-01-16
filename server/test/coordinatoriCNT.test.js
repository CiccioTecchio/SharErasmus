let expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let randomstring = require("randomstring");
let server = require('../app');
let should = chai.should();
chai.use(require('chai-match'));
chai.use(chaiHttp);

// findEmail
describe("ottenere email studenti non coordinati", function(){
    it('Dovrebbe restituire la lista di tutte le email degli studenti non coordinati dal coordinatore loggato', function(done){
        let obj = 
        {
            "email" : "fferrucci@unisa.it"
        };
        chai.request(server)
            .get("/coordinatore/findEmail")
            .query(obj)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
});
//addStudentToList
describe("Aggiungere studente alla lista", function(){
    it("Dovrebbe aggiungere uno studente alla lista", function(done){
        let studente = {
            "student": "s.corso1@studenti.unisa.it",
            "loggedEmail": "fferrucci@unisa.it",
            "citta": "Madrid",
            "nation": "Spagna"
        };
        chai.request(server)
            .post('/coordinatore/addStudentToList')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it("Campi vuoti", function(done){
        let studente = {
            "student": "s.corso1@studenti.unisa.it",
            "loggedEmail": "fferrucci@unisa.it",
        };
        chai.request(server)
            .post('/coordinatore/addStudentToList')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(409);
                done();
            });
    });
    it("Email scorrette", function(done){
        let studente = {
            "student": "s.corso2@studenti.unisa.it",
            "loggedEmail": "fferrucci@studenti.unisa.it",
        };
        chai.request(server)
            .post('/coordinatore/addStudentToList')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(409);
                done();
            });
    });
});
//createMarkers
describe("Inserisce i marker nella mappa corrispondenti alla posizione degli studenti", function(){
    it("Dovrebbe inserire i marker", function(done){
        chai.request(server)
            .get('/coordinatore/createMarkers')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
});
//obtainNumber
describe("Assegna ai marker il numero di studenti corrispondente", function(){
    it("Dovrebbe ottenere il numero di studenti per la citta' data", function(done){
        let obj = {
            "city" : "Salerno"
        };
        chai.request(server)
            .get('/coordinatore/obtainNumber')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it("La citta passata è nulla", function(done){
        let obj = {
            "city" : null
        };
        chai.request(server)
            .get('/coordinatore/obtainNumber')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(404);
                done();
            }); 
    });
    it("La citta passata non è esistente nel db", function(done){
        let obj = {
            "city" : "nonEsistente"
        };
        chai.request(server)
            .get('/coordinatore/obtainNumber')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(404);
                done();
            }); 
    });
});
//createLista
describe("Crea la lista studenti del coordinatore loggato", function(){
    it("Dovrebbe restituire tutti gli studenti coordinati al coordinatore loggato", function(done){
        let obj = {
            "email" : "f.ferrucci@unisa.it"
        };
        chai.request(server)
            .get('/coordinatore/createLista')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it("Utente loggato non è un coordinatore", function(done){
        let obj = {
            "email" : "fferrucci@studenti.unisa.it"
        };
        chai.request(server)
            .get('/coordinatore/createLista')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });
    it("Non si ha effettuato il login", function(done){
        let obj = {
            "email" : null
        };
        chai.request(server)
            .get('/coordinatore/createLista')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });
});
//userTimeline
describe("Mostra la timeline dello studente selezionato dalla lista", function(){
    it("Dovrebbe restituire la timeline", function(done){
        let obj = {
            "idTimeline" : "1"
        };
        chai.request(server)
            .get('/coordinatore/userTimeline')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it("Timeline richiesta non esistente", function(done){
        let obj = {
            "idTimeline" : "200"
        };
        chai.request(server)
            .get('/coordinatore/userTimeline')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(404);
                done();
            });
    });
    /*
    it("idTimeline non passato", function(done){
        let obj = {
            "idTimeline" : null
        };
        chai.request(server)
            .get('/coordinatore/userTimeline')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(404);
                done();
            });
    });
    */
});
//userDocument
describe("Mostra i documenti dello studente nella timeline", function(){
    it("Dovrebbe restituire i documenti", function(done){
        let obj = {
            "idTimeline" : "5"
        };
        chai.request(server)
            .get('/coordinatore/userDocument')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it("Timeline richiesta non esistente", function(done){
        let obj = {
            "idTimeline" : "200"
        };
        chai.request(server)
            .get('/coordinatore/userDocument')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(404);
                done();
            });
    });
    it("idTimeline non passato", function(done){
        let obj = {
            "idTimeline" : null
        };
        chai.request(server)
            .get('/coordinatore/userDocument')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(404);
                done();
            });
    });
});
//examList
describe("Mostra gli esami conseguiti dallo studente nella timeline", function(){
    it("Dovrebbe restituire gli esami conseguiti in erasmus", function(done){
        let obj = {
            "idTimeline" : "1"
        };
        chai.request(server)
            .get('/coordinatore/examList')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it("Timeline richiesta non esistente", function(done){
        let obj = {
            "idTimeline" : "200"
        };
        chai.request(server)
            .get('/coordinatore/examList')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(404);
                done();
            });
    });
    it("idTimeline non passato", function(done){
        let obj = {
            "idTimeline" : null
        };
        chai.request(server)
            .get('/coordinatore/examList')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(404);
                done();
            });
    });
});
//matchExam
describe("Mostra un suggerimento per l'esame inserito", function(){
    it("E' stato possibile trovare un suggerimento all'esame inserito", function(done){
        let obj = {
            "esameEstero" : "Programmazione 1"
        };
        chai.request(server)
            .get('/coordinatore/matchExam')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it("L'esame inserito non ha nessun suggerimento", function(done){
        let obj = {
            "esameEstero" : "200"
        };
        chai.request(server)
            .get('/coordinatore/matchExam')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
});
//createVote
describe("Dopo aver matchato gli esami,l'esito viene registrato nel db", function(){
    it("Dovrebbe registrare il voto nel db", function(done){
        let obj = {
            "idTimeline" : "3",
            "nomeEsame" : randomstring.generate(6),
            "votoIta" : "30",
            "esameEstero" : "Programaciao 3",
            "votoEstero" : "A",
            "email" : "g.cavaliere10@studenti.unisa.it",
        };
        chai.request(server)
            .get('/coordinatore/createVote')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it("Campi vuoti", function(done){
        let obj = {
            "emailStudente" : "s.corso1@studenti.unisa.it",
            "esameEstero" : "Programaciao 2",
            "votoEstero" : "A"
        };
        chai.request(server)
            .get('/coordinatore/createVote')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(409);
                done();
            });
    });
    it("Email studente non corretta", function(done){
        let obj = {
            "idTimeline" : "1",
            "nomeEsame" : "Programmazione 2",
            "votoIta" : "30",
            "esameEstero" : "Programaciao 2",
            "votoEstero" : "A",
            "email" : "s.corso2@studenti.unisa.it",
        };
        chai.request(server)
            .get('/coordinatore/createVote')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(409);
                done();
            });
    });
    it("idTimeline non corretto", function(done){
        let obj = {
            "idTimeline" : "200",
            "nomeEsame" : "Programmazione 2",
            "votoIta" : "30",
            "esameEstero" : "Programaciao 2",
            "votoEstero" : "A",
            "email" : "s.corso1@studenti.unisa.it",
        };
        chai.request(server)
            .get('/coordinatore/createVote')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(409);
                done();
            });
    });
});
//deleteVote
describe("Viene rimosso l'esame selezionato con la x rossa", function(){
    it("Dovrebbe rimuovere l'esame", function(done){
        let obj = {
            "idTimeline" : "3",
            "nomeEsame" : "Programmazione 2",
        };
        chai.request(server)
            .get('/coordinatore/deleteVote')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it("Campi vuoti", function(done){
        let obj = {
            "nomeEsame" : "Programmazione 3",
        };
        chai.request(server)
            .get('/coordinatore/deleteVote')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(409);
                done();
            });
    });
    it("nomeEsame non corretto", function(done){
        let obj = {
            "idTimeline" : "1",
            "nomeEsame" : "Programmazione 5",
        };
        chai.request(server)
            .get('/coordinatore/deleteVote')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(409);
                done();
            });
    });
    it("idTimeline non corretto", function(done){
        let obj = {
            "idTimeline" : "300",
            "nomeEsame" : "Programmazione 2",
        };
        chai.request(server)
            .get('/coordinatore/deleteVote')
            .query(obj)
            .end(function(err, res){
                res.should.have.status(409);
                done();
            });
    });
});
//statusPartito
describe("Dovrebbe modificare lo status dello studente", function(){
    it("Modifica lo status in partito", function(done){
        let obj = {
            "email" : "v.sabato@studenti.unisa.it",
        };
        chai.request(server)
            .post('/coordinatore/statusPartito')
            .send(obj)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it("Email passata incorretta", function(done){
        let obj = {
            "email" : "s.corso1@unisa.it",
        };
        chai.request(server)
            .post('/coordinatore/statusPartito')
            .send(obj)
            .end(function(err, res){
                res.should.have.status(409);
                done();
            });
    });
});
//statusTornato
describe("Dovrebbe modificare lo status dello studente", function(){
    it("Modifica lo status in tornato", function(done){
        let obj = {
            "email" : "v.sabato@studenti.unisa.it",
        };
        chai.request(server)
            .post('/coordinatore/statusTornato')
            .send(obj)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it("Email passata incorretta", function(done){
        let obj = {
            "email" : "s.corso1@unisa.it",
        };
        chai.request(server)
            .post('/coordinatore/statusTornato')
            .send(obj)
            .end(function(err, res){
                res.should.have.status(409);
                done();
            });
    });
});