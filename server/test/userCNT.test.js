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

let regex = {
    nome: /\w+/g,
    //eslint-disable-next-line no-useless-escape
    email: /[a-zA-Z0-9\._-]+[@][a-zA-Z0-9\._-]+[.][a-zA-Z]{2,6}/g,
    password: /[A-Z0-9a-z.!@_-]{8,16}/g,
    facolta: /(\w+|\W+){0,30}/g,
    via: /(\w+(\W+)?)+/g,
    recapito: /\+?(\d+){0,12}/g,
    matricola: /(\d+){10}/g,
    ruolo: /(\w+(\W+)?)+/g,
    codiceFiscale: /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/g
};

describe('registrazione', function(){
    
    //testo la registrazione dello studente
    it('Dovrebbe inserire lo studente', function(done){
        let studente = {
            "nome": "pippo",
            "cognome": "pluto",
            "email": "pippo35@studenti.unisa.it",
            "password": "pippoplutoepaperino",
            "via": "via walt disney 23",
            "recapito": "+39123456789",
            "facolta": "Scienze della comunicazione",
            "matricola": "1098765432",
            "codiceFiscale": "PPPPLT80R10M082K"
        };

        chai.request(server)
            .post('/user/registrazione')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

    it('Chiave duplicata', function(done){
        let studente = {
            "nome": "pippo",
            "cognome": "pluto",
            "email": "pippo30@studenti.unisa.it",
            "password": "pippoplutoepaperino",
            "via": "via walt disney 23",
            "recapito": "+39123456789",
            "facolta": "Scienze della comunicazione",
            "matricola": "1098765432",
            "codiceFiscale": "PPPPLT80R10M082K"
        };

        chai.request(server)
            .post('/user/registrazione')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(400);
                done();
            });
    });


    it('Errore nel formato', function(done){
        let studente = {
            "nome": "test"+randomstring.generate(5),
            "cognome": "test"+randomstring.generate(5),
            "codiceFiscale": "PPPPLT80R10M082K",
            "password": "test"+randomstring.generate(8),
            "via": "test"+randomstring.generate(20),
            "recapito": "test"+randomstring.generate(12),
            "email": randomstring.generate(6)+"@studenti.unisa.it",
            "matricola": Math.floor(Math.random()*10000000)+"",
            "facolta": "testFacolta",
            "status": "Normale"
        };
        chai.request(server)
            .post('/user/registrazione')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });

    //testo la registrazione del coordinatore.
    it('Dovrebbe inserire il coordinatore', function(done){
        let coordinatore = {
            "nome": "Filomena",
            "cognome": "Ferrucci",
            "email": "fferrucci8@unisa.it",
            "password": "ff123456",
            "via": "Giovanni Paolo II",
            "recapito": "+39123456789",
            "ruolo": "prof. ordinario",
            "codiceFiscale": "FFFLMN80R10M082K",
            "facolta": "Dipartimento di Informatica/DI"
        };
        chai.request(server)
            .post('/user/registrazione')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

    it('Chiave duplicata', function(done){
        let coordinatore = {
            "nome": "Filomena",
            "cognome": "Ferrucci",
            "email": "fferrucci1@unisa.it",
            "password": "ff123456",
            "via": "via niiiiiiiiiii",
            "recapito": "+39123456789",
            "ruolo": "prof. ordinario",
            "codiceFiscale": "FFFLMN80R10M082K",
            "facolta": "Song a meglj"
        };
        chai.request(server)
            .post('/user/registrazione')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(400);
                done();
            });
    });

    it('Errore nel formato', function(done){
        let coordinatore = {
            "nome": "test"+randomstring.generate(5),
            "cognome": "test"+randomstring.generate(5),
            "email": randomstring.generate(6)+"@unisa.it",
            "password": "test"+randomstring.generate(8),
            "via": "test"+randomstring.generate(20),
            "recapito": "test"+randomstring.generate(12),
            "ruolo": "prof. ordinario",
            "codiceFiscale": "FFFLMN80R10",
            "facolta": "Song a meglj"
        };
        chai.request(server)
            .post('/user/registrazione')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });    
});

describe('login', function(){
    //testo il login dello studente
    it('Dovrebbe autenticare lo studente', function(done){
        let studente = {
            "email": "pippo30@studenti.unisa.it",
            "password": "pippoplutoepaperino"
        };

        chai.request(server)
            .post('/user/login')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    
    it('Utente non registrato', function(done){
        let studente = {
            "email": "pippo100@studenti.unisa.it",
            "password": "pippoplutoepaperino"
        };
        chai.request(server)
            .post('/user/login')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });
    
    it('Errore nel formato', function(done){
        let studente = {
            "email": randomstring.generate(6)+"studenti.unisa.it",
            "password": "test"+randomstring.generate(8)
        };
        chai.request(server)
            .post('/user/login')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });
    
 
    //Testo il login del coordinatore
    it('Dovrebbe autenticare il coordinatore', function(done){
        let coordinatore = {
            "email": "fferrucci5@unisa.it",
            "password": "ff123456"
        };
        chai.request(server)
            .post('/user/login')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    
    it('Coordinatore non trovato', function(done){
        let coordinatore  = {
            "email": "fferrucci100@unista.it",
            "password": "ff123456"
        };
        chai.request(server)
            .post('/user/login')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });
 
    it('Errore nel formato', function(done){
        let coordinatore = {
            "email": randomstring.generate(6)+"unisa.it",
            "password": "test"+randomstring.generate(8)
        };
        chai.request(server)
            .post('/user/login')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });
});

/*
describe('cancellazione', function(){
    //Testo la cancellazione dello studente
    it('Dovrebbe cancellare lo studente', function(done){
        let studente = {
            "email": "pippo35@studenti.unisa.it"
        };
        chai.request(server)
            .post('/user/deleteAccount')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

    it('Utente non presente', function(done){
        let studente = {
            "email": "pippo49@studenti.unisa.it"
        };
        chai.request(server)
            .post('/user/deleteAccount')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });

    it('Errore nel formato', function(done){
        let studente = {
            "email": randomstring.generate(6)+"studenti.unisa.it"
        };
        chai.request(server)
            .post('/user/deleteAccount')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });

    //Testo la cancellazione del coordinatore
    it('Dovrebbe cancellare il coordinatore', function(done){
        let coordinatore = {
            "email": "fferrucci8@unisa.it"
        };
        chai.request(server)
            .post('/user/deleteAccount')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

    it('Impossibile cancellare il coordinatore, non è presente', function(done){
        let coordinatore = {
            "email": "fferrucci8@unisa.it"
        };
        chai.request(server)
            .post('/user/deleteAccount')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });

    it('Errore nel formato', function(done){
        let coordinatore = {
            "email": randomstring.generate(6)+"unisa.it"
        };
        chai.request(server)
            .post('/user/deleteAccount')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });
});
*/

describe('cancellazione', function(){
    it('cancellazione Studente', function(done){
        let studente = {
            "email": "pippo35@studenti.unisa.it"
        };
        chai.request(server)
        .post('/user/deleteAccount')
        .query(studente)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        }); 
    });


    it('uttente non presente', function(done){
        let studente = {
            "email": "pippo49@studenti.unisa.it"
        };
        chai.request(server)
        .post('/user/deleteAccount')
        .query(studente)
        .end(function(err,res){
            res.should.have.status(403);
            done();
        })
    })

    it('errore nel formato - studente', function(done){
        let studente = {
            "email": randomstring.generate(6)+"studenti.unisa.it"
        };
        chai.request(server)
        .post('/user/deleteAccount')
        .query(studente)
        .end(function(err,res){
            res.should.have.status(401);
            done();
        })
    })

    //testo la cancellazione del coordinatore
    it('dovrebbe cancellare il coordinatore', function(done){
        let coordinatore = {
            "email": "fferrucci8@unisa.it"
        };
        chai.request(server)
        .post('/user/deleteAccount')
        .query(coordinatore)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })

    it('dovrebbe non conacellare il coordinatore', function(done){
        let coordinatore = {
            "email": "fferrucci8@unisa.it"
        };
        chai.request(server)
        .post('/user/deleteAccount')
        .query(coordinatore)
        .end(function(err,res){
            res.should.have.status(403);
            done();
        })
    })

    it('errore nel formato - coordinatore', function(done){
        let coordinatore = {
            "email": randomstring.generate(6)+"unisa.it"
        };
        chai.request(server)
        .post('/user/deleteAccount')
        .query(coordinatore)
        .end(function(err,res){
            res.should.have.status(401);
            done();
        })
    })
})

//Per il test cambiare inserimentoBio std, inserimentoBio coord.
describe('insertBio', function(){
    //test insertBio studente
    it('inserimentoBio studente', function(done){
        let studente = {
            "email": "pippo2@studenti.unisa.it",
            "bio": randomstring.generate(5)
        };
        chai.request(server)
            .post('/user/insertBio')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

    it('Errore Inserimento Bio - studente', function(done){
        let studente = {
            "email": "pippo55@studenti.unisa.it",
            "bio": "Rocco"
        };
        chai.request(server)
            .post('/user/insertBio')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });


    it('Errore nel formato - studente', function(done){
        let studente = {
            "email": randomstring.generate(8)+"studenti.unisa.it",
            "bio": randomstring.generate(5)+""
        };
        chai.request(server)
            .post('/user/insertBio')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });
 
    it('inserimentoBio coordinatore ', function(done){
        let coordinatore = {
            "email": "fferrucci2@unisa.it",
            "bio": randomstring.generate(6)
        };
        chai.request(server)
            .post('/user/insertBio')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });


    it('Errore Inserimento - coordinatore', function(done){
        let coordinatore = {
            "email": "fferrucci55@unisa.it",
            "bio": "Fantasia"
        };
        chai.request(server)
            .post('/user/insertBio')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });

    
    it('Errore nel formato - coordinatore', function(done){
        let coordinatore = {
            "email": randomstring.generate(6)+"unisa.it",
            "bio": randomstring.generate(5)+""
        }
        chai.request(server)
        .post('/user/insertBio')
        .send(coordinatore)
        .end(function(err,res){
            res.should.have.status(401);
            done();
        })
    })

});

/*
describe('visualizzaDA', function(){
    //visualizzo per lo studente
    it('Dovrebbe visualizzare i dati di accesso dello studente', function(done){
        let studente = {
            "email": "pippo31@studenti.unisa.it"
        };
        chai.request(server)
            .post('/user/visualizzaDA')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

    it('Utente non trovato', function(done){
        let studente = {
            "email": "pippo57@studenti.unisa.it"
        };
        chai.request(server)
            .post('/user/visualizzaDA')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });

    it('Errore nel formato', function(done){
        let studente = {
            "email": randomstring.generate(7)+"studenti.unisa.it"
        };
        chai.request(server)
            .post('/user/visualizzaDA')
            .send(studente)
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });

    //Testo la visualizzazione dei dati di accesso dei coordinatori.
    it('Dovrebbe visualizzare le informazioni del coordinatore', function(done){
        let coordinatore = {
            "email": "fferrucci1@unisa.it"
        };
        chai.request(server)
            .post('/user/visualizzaDA')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

    it('coordinatore non trovato', function(done){
        let coordinatore = {
            "email": "fferr56ucci@unisa.it"
        };
        chai.request(server)
            .post('/user/visualizzaDA')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });

    it('Errore nel formato', function(done){
        let coordinatore = {
            "email": randomstring.generate(8)+"unisa.it"
        };
        chai.request(server)
            .post('/user/visualizzaDA')
            .send(coordinatore)
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });

});
*/

describe('VisualizzaDA', function(){
    it('dovrebbe visualizzare i dati di accesso', function(done){
        let studente = {
            "email": "pippo31@studenti.unisa.it"
        };
        chai.request(server)
        .get('/user/visualizzaDA')
        .query(studente)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })

    it('studente non trovato, dovrebbe NON visualizzare i dati di accesso', function(done){
        let studente = {
            "email": "pippo57@studenti.unisa.it"
        };
        chai.request(server)
        .get('/user/visualizzaDA')
        .query(studente)
        .end(function(err,res){
            res.should.have.status(403);
            done();
        })
    })

    it('errore nel formato - studente', function(done){
        let studente = {
            "email": randomstring.generate(7)+"studenti.unisa.it"
        };
        chai.request(server)
        .get('/user/visualizzaDA')
        .query(studente)
        .end(function(err,res){
            res.should.have.status(401);
            done();
        })
    })

    //testo la visualizzazione dei dati di accesso del coordinatore
    it('dovrebbe visualizzare i dati di accesso dello studente', function(done){
        let coordinatore = {
            "email": "fferrucci1@unisa.it"
        };
        chai.request(server)
        .get('/user/visualizzaDA')
        .query(coordinatore)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })

    it('coordinatore non trovato, dovrebbe NON visualizzare i dati di accesso', function(done){
        let coordinatore = {
            "email": "fferrucci56@unisa.it"
        };
        chai.request(server)
        .get('/user/visualizzaDA')
        .query(coordinatore)
        .end(function(err,res){
            res.should.have.status(403);
            done();
        })
    })

    it('errore nel formato - coordinatore', function(done){
        let coordinatore = {
            "email": randomstring.generate(8)+"unisa.it"
        };
        chai.request(server)
        .get('/user/visualizzaDA')
        .query(coordinatore)
        .end(function(err,res){
            res.should.have.status(401);
            done();
        })
    })
})

/*
describe('modificaDA', function(){
    //Testo la modifica dei dati di accesso sullo studente.
    //Per il test scambiare email vecchi non quella nuovi.
    it('Dorvebbe modificare i dati di accesso dello studente', function(done){
        let toUpdate = {
            vecchi: {
                //sarà l'oggetto che conterrà i dati precedente alla modifica
                "email": "pippo38@studenti.unisa.it"
            },
            nuovi: {
                //sarà l'oggetto che conterrà i dati che saranno modificati
                //modificare
                "nome": "pippo",
                "cognome": randomstring.generate(5),
                "email": "pippo38@studenti.unisa.it",
                "password": "pippoplutoepaper",
                "via": "via walt d 23",
                "recapito": "+39123456789",
                "facolta": "Scienze della comunicazione",
                "matricola": "1098765432",
                "codiceFiscale": "PPPPLT80R10M082K",
                "bio": "OU0FhmS8o5"
            }
        };
        chai.request(server)
            .post('/user/modificaDA')
            .send(toUpdate)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

    it('Studente non trovato', function(done){
        let toUpdate = {
            vecchi: {
                //sarà l'oggetto che conterrà i dati precedente alla modifica
                "nome": "pippo",
                "cognome": "pluto",
                "email": "pippo55@studenti.unisa.it",
                "password": "pippoplutoepaper",
                "via": "via walt disney 23",
                "recapito": "+39123456789",
                "facolta": "Scienze della prenotazione",
                "matricola": "1098765432",
                "codiceFiscale": "PPPPLT80R10M082K",
                "bio": ""
            },
            nuovi: {
                //sarà l'oggetto che conterrà i dati che saranno modificati
                "nome": "pippo",
                "cognome": "pluto",
                "email": "pippo38@studenti.unisa.it",
                "password": "pippoplutoepaper",
                "via": "via walt disney 23",
                "recapito": "+39123456789",
                "facolta": randomstring.generate(10),
                "matricola": "1098765432",
                "codiceFiscale": "PPPPLT80R10M082K",
                "bio": "questo è stato modificato"
            }
        };
        chai.request(server)
            .post('/user/modificaDA')
            .send(toUpdate)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });

    it('Errore nel formato', function(done){
        let toUpdate = {
            vecchi: {
                //sarà l'oggetto che conterrà i dati precedente alla modifica
                "email": "pippo38studenti.unisa.it"
            },
            nuovi: {
                //sarà l'oggetto che conterrà i dati che saranno modificati
                "nome": "pippo",
                "cognome": "pluto",
                "email": "pippo38studenti.unisa.it",
                "password": "pippoplutoepaper",
                "via": "via walt d 23",
                "recapito": "+39123456789",
                "facolta": "Scienze della comunicazione",
                "matricola": "1098765432",
                "codiceFiscale": "PPPPLT80R10M082K",
                "bio": "questo è stato modificato"
            }
        };
        chai.request(server)
            .post('/user/modificaDA')
            .send(toUpdate)
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });

    //Testo la modifica dei dati sul coordinatore
    it('Dorvebbe modificare i dati di accesso del coordinatore', function(done){
        let toUpdate = {
            vecchi: {
                //sarà l'oggetto che conterrà i dati precedente alla modifica
                "email": "fferrucci7@unisa.it"
            },
            nuovi: {
                //sarà l'oggetto che conterrà i dati che saranno modificati
                "nome": "Filomena",
                "cognome": randomstring.generate(5),
                "email": "fferrucci7@unisa.it",
                "password": "ff123456",
                "via": "via Giovanni P. II",
                "recapito": "+39123456789",
                "ruolo": "prof.ordinario",
                "facolta": "Dipartimento di Informatica",
                "codiceFiscale": "FFFLMN80R10M082K",
                "bio": randomstring.generate(10),
                "matricola": "0000000000"
            }
        };
        chai.request(server)
            .post('/user/modificaDA')
            .send(toUpdate)
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

    it('Dovrebbe NON modificare la bio del coordinatore', function(done){
        let toUpdate = {
            vecchi: {
                //sarà l'oggetto che conterrà i dati precedente alla modifica
                "email": "fferrucci150@unisa.it"
            },
            nuovi: {
                //sarà l'oggetto che conterrà i dati che saranno modificati
                "nome": "Filomena",
                "cognome": "Ferrucci",
                "email": "fferrucci150@unisa.it",
                "password": "ff123456",
                "via": "via niiiiiiiiiii",
                "recapito": "+39123456789",
                "ruolo": "prof.ordinario",
                "facolta": "Song a megli",
                "codiceFiscale": "FFFLMN80R10M082K",
                "bio": randomstring.generate(6),
                "matricola": "0000000000"
            }
        };
        chai.request(server)
            .post('/user/modificaDA')
            .send(toUpdate)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            });
    });
});
*/


describe('modificaDA', function(){
    it('dovrebbe modificare i dati di accesso dello studente',function(done){
        let toUpdate = {
                //sarà l'oggetto che conterrà i dati che saranno modificati
                //modificare
                "nome": "pippo",
                "cognome": randomstring.generate(5),
                "email": "pippo38@studenti.unisa.it",
                "password": "pippoplutoepaper",
                "via": "via walt d 23",
                "recapito": "+39123456789",
                "facolta": "Scienze della comunicazione",
                "codiceFiscale": "PPPPLT80R10M082K"
        };
        chai.request(server)
        .post('/user/modificaDA')
        .send(toUpdate)
        //.query(toUpdate)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })

    it('studente non trovato, dovrebbe NON modificare i dati di accesso dello studente', function(done){
        let toUpdate = {
                //sarà l'oggetto che conterrà i dati precedente alla modifica
                "nome": "pippo",
                "cognome": "pluto",
                "email": "pippo55@studenti.unisa.it",
                "password": "pippoplutoepaper",
                "via": randomstring.generate(10),
                "recapito": "+39123456789",
                "facolta": "Scienze della prenotazione",
                "codiceFiscale": "PPPPLT80R10M082K"
        };
        chai.request(server)
        .post('/user/modificaDA')
        .send(toUpdate)
        //.query(toUpdate)
        .end(function(err,res){
            res.should.have.status(403);
            done();
        })
    })

    it('errore nel formato - studente', function(done){
        let toUpdate = {
                //sarà l'oggetto che conterrà i dati che saranno modificati
                "nome": "pippo",
                "cognome": "pluto",
                "email": randomstring.generate(8)+"studenti.unisa.it",
                "password": "pippoplutoepaper",
                "via": "via walt d 23",
                "recapito": "+39123456789",
                "facolta": "Scienze della comunicazione",
                "codiceFiscale": "PPPPLT80R10M082K"
        };
        chai.request(server)
        .post('/user/modificaDA')
        .send(toUpdate)
        //.query(toUpdate)
        .end(function(err,res){
            res.should.have.status(401);
            done();
        })
    })

    //testo la modifica dei dati di accesso del coordinatore
    it('dovrebbe modificare il cognome, funzione modifica dati di accesso del coordinatore', function(done){
        let toUpdate = {
                //sarà l'oggetto che conterrà i dati che saranno modificati
                "nome": "Filomena",
                "cognome": randomstring.generate(5)+"",
                "email": "fferrucci7@unisa.it",
                "password": "ff123456",
                "via": "via Giovanni P. II",
                "recapito": "+39123456789",
                "facolta": "Dipartimento di Informatica",
                "codiceFiscale": "FFFLMN80R10M082K"
            
        };
        chai.request(server)
        .post('/user/modificaDA')
        .send(toUpdate)
        //.query(toUpdate)
        .end(function(err,res){
            res.should.have.status(200);
            done();
        })
    })

    it('coordinatore non trovato, dovrebbe NON modificare la facoltà del coordinatore', function(done){
        let toUpdate = {
                //sarà l'oggetto che conterrà i dati che saranno modificati
                "nome": "Filomena",
                "cognome": "Ferrucci",
                "email": "fferrucci500@unisa.it",
                "password": "ff123456",
                "via": "via niiiiiiiiiii",
                "recapito": "+39123456789",
                "facolta": randomstring.generate(10),
                "codiceFiscale": "FFFLMN80R10M082K"
        };
        chai.request(server)
            .post('/user/modificaDA')
            //.query(toUpdate)
            .send(toUpdate)
            .end(function(err, res){
                res.should.have.status(403);
                done();
            })
    })

    it('errore nel formato - coordinatore', function(done){
        let toUpdate = {
                //sarà l'oggetto che conterrà i dati che saranno modificati
                "nome": "Filomena",
                "cognome": randomstring.generate(5),
                "email": randomstring.generate(10)+"unisa.it",
                "password": "ff123456",
                "via": "via Giovanni P. II",
                "recapito": "+39123456789",
                "facolta": "Dipartimento di Informatica",
                "codiceFiscale": "FFFLMN80R10M082K",
        };
        chai.request(server)
        .post('/user/modificaDA')
        //.query(toUpdate)
        .send(toUpdate)
        .end(function(err,res){
            res.should.have.status(401);
            done();
        })
    })
})
