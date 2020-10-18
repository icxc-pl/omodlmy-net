const chai = require('chai');
const expect = chai.expect;

const axios = require('axios').default;
const { SERVER_ADDR } = require('../config');

const client = axios.create({
  baseURL: SERVER_ADDR
})

describe('HTTP Server', () => {

  describe('GET /', () => {

    it('zwraca 200 i content-type html', async () => {
      const res = await client.get('/');
      expect(res.status).to.be.equal(200);
      expect(res.headers['content-type']).to.be.eq('text/html; charset=UTF-8');
    });

  });

});
