const chai = require('chai');
const expect = chai.expect;

const axios = require('axios').default;
const { API_ADDR } = require('../config');

const client = axios.create({
  baseURL: API_ADDR
})

describe('API', () => {

  describe('GET /intentions', () => {

    it('zwróć listę intencji', async () => {
      const res = await client.get('/intentions');
      expect(res).to.have.property('status', 200);
      expect(res).to.have.nested.property('.headers.content-type', 'application/json; charset=utf-8');
      expect(res.data).to.be.an('array');
    });

    // it('zwróć listę intencji z limitem 1', async () => {
    //   const res = await client.get('/intentions?limit=1');
    //   expect(res).to.have.property('status', 200);
    //   expect(res.data).to.be.an('array').that.have.lengthOf(1);
    // });

    // let lastRes;
    // it('zwróć listę intencji z limitem 2', async () => {
    //     const res = await client.get('/intentions?limit=2');
    //     expect(res).to.have.property('status', 200);
    //     expect(res.data).to.be.an('array').that.have.lengthOf(2);
    //     lastRes = res;
    // });

    // it('zwróć listę intencji z limitem 1 i offsetem 1', async () => {
    //   const res = await client.get('/intentions?limit=1&offset=1');
    //   expect(res).to.have.property('status', 200);
    //   expect(res.data).to.be.an('array').that.have.lengthOf(1);
    //   expect(res.data[0]).to.be.deep.equal(lastRes.data[1]);
    // });

    it('zwróć błąd gdy limit jest -1', async () => {
      try {
        await client.get('/intentions?limit=-1');
      } catch (err) {
        const res = err.response;
        expect(res).to.have.property('status', 400);
      }
    });

  });

});
