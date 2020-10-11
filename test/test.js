var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var $server = chai.request('http://127.0.0.1:8000');
var $api = chai.request('http://127.0.0.1:8000/api');
// var $server = chai.request('http://172.22.22.22:50001');
// var $api = chai.request('http://172.22.22.22:50001/api');

var expect = chai.expect;

describe('HTTP Server', function () {
  describe('GET /', function () {
    it('zwróć 404', function (done) {
      $server.get('/').end(function (err, res) {
        expect(res).have.status(404);
        done();
      });
    });
  });
});

describe('API', function () {
  describe('GET /intentions', function () {
    it('zwróć listę intencji', function (done) {
      $api.get('/intentions').end(function (err, res) {
        expect(res).have.status(200).that.have.header('Content-Type', 'application/json; charset=utf-8');
        expect(res.body).to.be.an('array');
        done();
      });
    });

    it('zwróć listę intencji z limitem 1', function (done) {
      $api.get('/intentions?limit=1').end(function (err, res) {
        expect(res).have.status(200);
        expect(res.body).to.be.an('array').that.have.lengthOf(1);
        done();
      });
    });

    var intentionsLimit2;
    it('zwróć listę intencji z limitem 2', function () {
      intentionsLimit2 = new Promise(function (resolve) {
        $api.get('/intentions?limit=2').end(function (err, res) {
          expect(res).have.status(200);
          expect(res.body).to.be.an('array').that.have.lengthOf(2);
          resolve(res.body);
        });
      });
      return intentionsLimit2;
    });

    it('zwróć listę intencji z limitem 1 i offsetem 1', function (done) {
      this.timeout(250);
      intentionsLimit2.then(function (body) {
        $api.get('/intentions?limit=1&offset=1').end(function (err, res) {
          expect(res).have.status(200);
          expect(res.body).to.be.an('array').that.have.lengthOf(1);
          expect(res.body[0]).to.be.deep.equal(body[1]);
          done();
        });
      });
    });

    it('zwróć błąd gdy limit jest -1', function (done) {
      $api.get('/intentions?limit=-1').end(function (err, res) {
        expect(res).have.status(400);
        done();
      });
    });
  });

  describe('POST /intentions', function () {
    it('nadaj intencję bez autora', function (done) {
      var intention = {
        content: 'Proszę o zdrowie'
      };

      $api.post('/intentions').send(intention).end(function (err, res) {
        expect(res).have.status(201);
        expect(res.body).to.be.an('object').that.have.property('id');
        expect(res.body.id).to.not.be.null;
        done();
      });
    });

    it('nadaj intencję z autorem', function (done) {
      var intention = {
        content: 'Proszę o zdrowie',
        author: 'Potrzebujący'
      };

      $api.post('/intentions').send(intention).end(function (err, res) {
        expect(res).have.status(201);
        expect(res.body).to.be.an('object').that.have.property('id');
        expect(res.body.id).to.not.be.null;
        done();
      });
    });
  });
});
