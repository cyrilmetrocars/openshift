var server   = require('../server'),
    chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();

chai.use(chaiHTTP);

reqServer = process.env.HTTP_TEST_SERVER || server

describe('Basic routes tests', function() {

    it('GET to /views should return 200', function(done){
        chai.request(reqServer)
        .get('/views/')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });

    it('GET to /all-cars should return 200', function(done){
        chai.request(reqServer)
        .get('/all-cars/')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });

    it('GET to /all-brands should return 200', function(done){
        chai.request(reqServer)
        .get('/all-brands/')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });
})
