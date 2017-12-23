'use strict';

var expect = require('expect.js');
var email = require('../../../services/emailService')

describe('Email Service', function() {

  describe('Basic Stuff', function() {
    it('should have a service with two methods and have all the correct variables', function (done) {
      expect(email.applicationName).to.not.be(null);
      expect(email.senderAddress).to.not.be(null);
      done()
    });
  });
});