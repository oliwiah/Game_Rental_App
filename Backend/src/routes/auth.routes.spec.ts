import 'jasmine';
import * as request from 'supertest';
import app from '../app';
import { openMongooseConnection, dropMongooseDb } from '../conn';
import { config } from '../config/app-config';
import { User } from '../models/user.model';
import { properUser, brokenUser } from '../mocks/users.mock';

describe('Login route', () => {
  beforeAll(done => {
    //create test db
    openMongooseConnection(config.testDb)
      .then(() => {
        console.log('set testing env db');
        done();
      })
      .catch(done);
  });

  beforeAll(done => {
    const user = new User({
      email: 'test@test',
      // hashed password for test
      password: '$2b$10$5FMWXHwOrVvWdi27Q1YgAOxTLSxj1DO28rqfB.ADG8T5hKIerqM2G'
    });
    // populate db with user
    user
      .save()
      .then(result => {
        console.log('db populated for tests');
        done();
      })
      .catch(err => {
        console.log(err, 'error while preparing test db');
        done();
      });
  });

  afterAll(() => {
    //clean up db after tests
    dropMongooseDb('users');
  });

  describe('/login', () => {
    it('should login user', done => {
      request(app)
        .post(`/login`)
        .send(properUser)
        .then(resp => {
          expect(resp.status).toEqual(200);
          expect(resp.body.msg).toBeTruthy();
          done();
        })
        .catch(err => done());
    });

    it('should prevent to login when wrong credentials are passed', done => {
      request(app)
        .post(`/login`)
        .send(brokenUser)
        .then(resp => {
          expect(resp.status).toEqual(401);
          expect(resp.body.msg).toEqual('invalid email');
          done();
        })
        .catch(err => done());
    });
  });
});