process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
chai.use(require('chai-match'));
chai.use(chaiHttp);
// eslint-disable-next-line no-unused-vars
let  should = chai.should();
it('GET: it should render the home page', function(done){
    chai.request(server)
        .get('/')
        .end(function(err, res){
            res.should.have.status(200);
            done();
        });
});