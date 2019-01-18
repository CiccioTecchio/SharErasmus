process.env.NODE_ENV = 'test';

let expect = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let randomstring = require("randomstring");
let server = require('../app');
// eslint-disable-next-line no-unused-vars
let should = chai.should();
chai.use(require('chai-match'));
chai.use(chaiHttp);

it('Dovrebbe restituire tutti i post', function (done) {
    chai.request(server)
        .get('/forum/getallpost')
        .end(function (err, res) {
            res.should.have.status(200);
            done();
        });
});

it('Risposte esistenti', function (done) {
    let reply = {
        id: "1"
    };
    chai.request(server)
        .post('/forum/getidreply')
        .send(reply)
        .end(function (err, res) {
            res.should.have.status(200);
            done();
        });
});

it('Risposte non esistenti', function (done) {
    let reply = {
        id: "0"
    };
    chai.request(server)
        .post('/forum/getidreply')
        .send(reply)
        .end(function (err, res) {
            res.should.have.status(404);
            done();
        });
});

describe('Inserimento Risposta', function () {

    it('Errore del formato', function (done) {
        let reply = {
            risposta: "" + randomstring.generate(100),
            idp: "5",
            email: "utenteanomalo"//formato errato
        };

        chai.request(server)
            .post('/forum/insertreply')
            .send(reply)
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });

    });

    it('Studente: Inserimento a buon fine', function (done) {
        let reply = {
            risposta: randomstring.generate(100),
            idp: "1",
            email: "l.davinci@studenti.unisa.it"
        };

        chai.request(server)
            .post('/forum/insertreply')
            .send(reply)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('Studente: Inserimento non a buon fine', function (done) {
        let reply = {
            risposta: randomstring.generate(100),
            idp: "1",
            email: "m.buonarroti@studenti.unisa.it" //studente non presente
        };

        chai.request(server)
            .post('/forum/insertreply')
            .send(reply)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            });
    });

    it('Coordinatore: Inserimento a buon fine', function (done) {
        let reply = {
            risposta: randomstring.generate(100),
            idp: "1",
            email: "fferrucci1@unisa.it"
        };

        chai.request(server)
            .post('/forum/insertreply')
            .send(reply)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('Coordinatore: Inserimento non a buon fine', function (done) {
        let reply = {
            risposta: randomstring.generate(100),
            idp: "1",
            email: "profnonpresente@unisa.it" //coordinatore non presente
        };

        chai.request(server)
            .post('/forum/insertreply')
            .send(reply)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            });
    });

});

it('Dovrebbe restituire tutti i post con lo stesso tag', function (done) {
    let post = {
        tag: "#londra"
    };
    chai.request(server)
        .post('/forum/gettagpost')
        .send(post)
        .end(function (err, res) {
            res.should.have.status(200);
            done();
        });
});

it('Dovrebbe non trovare post con quel tag', function (done) {
    let post = {
        tag: "#alaska"//tag non presente nel db
    };
    chai.request(server)
        .post('/forum/gettagpost')
        .send(post)
        .end(function (err, res) {
            res.should.have.status(404);
            done();
        });
});

it('Dovrebbe restituire tutti gli avvisi', function (done) {
    chai.request(server)
        .get('/forum/getalladv')
        .end(function (err, res) {
            res.should.have.status(200);
            done();
        });
});

describe('Inserimento Avviso', function () {


    it('Errore del formato', function (done) {
        let avviso = {
            avviso: randomstring.generate(100),
            email: "utenteanomalo" //formato errato
        };

        chai.request(server)
            .post('/forum/insertadv')
            .send(avviso)
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });

    });

    it('Utente non coordinatore: Inserimento non a buon fine', function (done) {
        let avviso = {
            avviso: randomstring.generate(100),
            email: "l.davinci@studenti.unisa.it", //lo studente non puo' inserire avvisi
        };

        chai.request(server)
            .post('/forum/insertadv')
            .send(avviso)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            });
    });

    it('Coordinatore: Inserimento a buon fine', function (done) {
        let avviso = {
            avviso: randomstring.generate(100),
            email: "fferrucci1@unisa.it"
        };

        chai.request(server)
            .post('/forum/insertadv')
            .send(avviso)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('Coordinatore: Inserimento non a buon fine', function (done) {
        let avviso = {
            avviso: randomstring.generate(100),
            email: "profnonpresente@unisa.it" //coordinatore non presente
        };

        chai.request(server)
            .post('/forum/insertadv')
            .send(avviso)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            });
    });

});

describe('Fix Post', function () {


    it('Studente o errore nel formato', function (done) {
        let fissare = {
            email: "ldavinci@studenti.unisa.it", //lo studente non puo' fissare
            idp: 1,
            fix: 0
        };

        chai.request(server)
            .post('/forum/fixpost')
            .send(fissare)
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });

    });

    it('Il Coordinatore fissa il post', function (done) {
        let fissare = {
            email: "fferrucci1@unisa.it",
            idp: 1,
            fix: 1
        };

        chai.request(server)
            .post('/forum/fixpost')
            .send(fissare)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('Coordinatore non presente nel db', function (done) {
        let fissare = {
            email: "profnonpresente@unisa.it", //coordinatore non presente
            idp: 1,
            fix: 1
        };

        chai.request(server)
            .post('/forum/fixpost')
            .send(fissare)
            .end(function (err, res) {
                res.should.have.status(404);
                done();
            });
    });

});

describe('Rating', function () {


    it('Errore nel formato', function (done) {
        let vota = {
            email: "utenteanomalo",
            voto: 1,
            idr: 5,
            emailp: "formatoerrato"
        };

        chai.request(server)
            .post('/forum/vota')
            .send(vota)
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });

    });

    //dopo la prima esecuzione cambiare i valori
    it('Studente: voto inserito correttamente', function (done) {
        let vota = {
            email: "s.lavori@studenti.unisa.it",
            voto: 1,
            idr: 1, //cambiare dopo la prima esecuzione
            emailp: "l.davinci@studenti.unisa.it"
        };

        chai.request(server)
            .post('/forum/vota')
            .send(vota)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });

    });

    it('Studente: voto già presente', function (done) {
        let vota = {
            email: "s.lavori@studenti.unisa.it",
            voto: 1,
            idr: 1,
            emailp: "l.davinci@studenti.unisa.it"
        };

        chai.request(server)
            .post('/forum/vota')
            .send(vota)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            });

    });

    //dopo la prima esecuzione cambiare i valori
    it('Coordinatore: voto inserito correttamente', function (done) {
        let vota = {
            email: "fferrucci@unisa.it",
            voto: 1,
            idr: 1, //cambiare dopo la prima esecuzione
            emailp: "l.davinci@studenti.unisa.it"
        };

        chai.request(server)
            .post('/forum/vota')
            .send(vota)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });

    });

    it('Coordinatore: voto già presente', function (done) {
        let vota = {
            email: "fferrucci1@unisa.it",
            voto: 1,
            idr: 1,
            emailp: "l.davinci@studenti.unisa.it"
        };

        chai.request(server)
            .post('/forum/vota')
            .send(vota)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            });

    });

});

/*
describe('Inserimento Post', function () {


    it('Errore del formato', function (done) {
        let post = {
            post: randomstring.generate(100),
            tag: "#test" + randomstring.generate(3),
            email: "utenteanomalo" //mail non valida
        };

        chai.request(server)
            .post('/forum/insertpost')
            .send(post)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            });

    });

    it('Studente: Inserimento a buon fine', function (done) {
        let post = {
            post: randomstring.generate(100),
            tag: "#test" + randomstring.generate(3),
            email: "l.davinci@studenti.unisa.it"
        };

        chai.request(server)
            .post('/forum/insertpost')
            .send(post)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('Studente: Inserimento non a buon fine', function (done) {
        let post = {
            post: randomstring.generate(100),
            tag: "#test" + randomstring.generate(3),
            email: "m.buonarroti@studenti.unisa.it" //studente non presente
        };

        chai.request(server)
            .post('/forum/insertpost')
            .send(post)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            });
    });

    it('Coordinatore: Inserimento a buon fine', function (done) {
        let post = {
            post: randomstring.generate(100),
            tag: "#test" + randomstring.generate(3),
            fissato: "0",
            email: "fferrucci1@unisa.it"
        };

        chai.request(server)
            .post('/forum/insertpost')
            .send(post)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('Coordinatore: Inserimento non a buon fine', function (done) {
        let post = {
            post: randomstring.generate(100),
            tag: "#test" + randomstring.generate(3),
            fissato: "0",
            email: "profnonpresente@unisa.it" //coordinatore non presente
        };

        chai.request(server)
            .post('/forum/insertpost')
            .send(post)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            });
    });

});
*/