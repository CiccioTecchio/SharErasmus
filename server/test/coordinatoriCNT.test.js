let expect  = require('chai').expect;
let chai = require('chai');
let chaiHttp = require('chai-http');
let randomstring = require("randomstring");
let server = require('../app');
// eslint-disable-next-line no-unused-vars
let  should = chai.should();
chai.use(require('chai-match'));
chai.use(chaiHttp);

/*
describe("ottenere email studenti non coordinati",function(){
    it('Dovrebbe restituire la lista di tutte le email degli studenti non coordinati dal coordinatore loggato',function(done){
        let 
    })
})
*/

//describe("")