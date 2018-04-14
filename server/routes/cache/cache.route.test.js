import mongoose from 'mongoose';
import faker from 'faker';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';
import config from '../../../config/config';

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

if (config.mongo.open === true) {
  describe('## Cache APIs', () => {
    let cache = {
      data: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        card: faker.helpers.createCard()
      }
    };

    describe('# POST /api/caches', () => {
      it('should create a new data for cache', (done) => {
        request(app)
          .post('/api/caches')
          .send(cache)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body.key).to.be.a('string');
            expect(res.body.data.name).to.equal(cache.data.name);
            expect(res.body.data.email).to.equal(cache.data.email);
            expect(res.body.data.card.account).to.equal(cache.data.card.account);
            cache = res.body;
            done();
          })
          .catch(done);
      });
    });

    describe('# GET /api/caches/:key', () => {
      it('should get cache details', (done) => {
        request(app)
          .get(`/api/caches/${cache.key}`)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body.key).to.be.a('string');
            expect(res.body.data.name).to.equal(cache.data.name);
            expect(res.body.data.email).to.equal(cache.data.email);
            expect(res.body.data.card.account).to.equal(cache.data.card.account);
            done();
          })
          .catch(done);
      });

      it('should create a new key - If the key is not found in the caches', (done) => {
        request(app)
          .get('/api/caches/56c787ccc67fc16ccc1a5e92')
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body.data).to.be.a('string');
            expect(res.body.key).to.be.a('string');
            done();
          })
          .catch(done);
      });
    });

    describe('# PUT /api/caches/:key', () => {
      it('should update cache details', (done) => {
        cache.data = {
          name: faker.name.findName(),
          email: faker.internet.email(),
          card: faker.helpers.createCard()
        };
        request(app)
          .put(`/api/caches/${cache.key}`)
          .send(cache)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body.key).to.be.a('string');
            expect(res.body.data.name).to.equal(cache.data.name);
            expect(res.body.data.email).to.equal(cache.data.email);
            done();
          })
          .catch(done);
      });
    });

    describe('# GET /api/caches/', () => {
      it('should returns all stored keys in the cache', (done) => {
        request(app)
          .get('/api/caches')
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.be.a('string');
            done();
          })
          .catch(done);
      });
    });

    describe('# DELETE /api/caches/', () => {
      it('should delete cache', (done) => {
        request(app)
          .delete(`/api/caches/${cache.key}`)
          .expect(httpStatus.OK)
          .then(() => {
            done();
          })
          .catch(done);
      });
      it('should create a new key - If the key is found in the caches', (done) => {
        request(app)
          .get(`/api/caches/${cache.key}`)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body.data).to.be.a('string');
            expect(res.body.key).to.be.a('string');
            done();
          })
          .catch(done);
      });
    });
    const bulkDeleteList = ['1', '2', '3'];

    describe('# DELETE /api/caches/bulk', () => {
      it('should delete cache', (done) => {
        request(app)
          .post('/api/caches')
          .send(cache)
          .expect(httpStatus.OK)
          .then((res) => {
            bulkDeleteList.push(res.body.key);
            request(app)
              .delete(`/api/caches/bulk/${bulkDeleteList.join(',')}`)
              .expect(httpStatus.OK)
              .then(() => {
                done();
              })
              .catch(done);
          })
          .catch(done);
      });
    });
  });
}
