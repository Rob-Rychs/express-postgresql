var request = require('supertest');
var app = require('../../app.js');

describe('GET /', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /login', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /signup', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/signup')
      .expect(200, done);
  });
});

describe('GET /posts', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/posts')
      .expect(200, done);
  });
});

describe('GET /posts/submit', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/posts/submit')
      .expect(200, done);
  });
});

describe('GET /status', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/status')
      .expect(200, done);
  });
});

describe('GET /random-url', function() {
  it('should return 404', function(done) {
    request(app)
      .get('/random-url')
      .expect(404, done);
  });
});



