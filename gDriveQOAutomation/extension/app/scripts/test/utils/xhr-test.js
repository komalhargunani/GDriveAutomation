/**
 * @fileoverview
 * Mocha based unit test for the XHR module
 *
 * @author jonbronson@google.com (Jonathan Bronson)
 */
define([
  'utils/xhr',
  'qowtRoot/errors/unique/timeoutError',
  ], function(
  XHR,
  TimeoutError) {

  'use strict';

  // fake clock for timing
  var clock;

  // JsHint does not like the ChaiJs expect format EG: expect(1).to.be.ok;
  // Disabling Lint Check for assignment vs. expression check
  /* jshint -W030 */

  describe('Failed Downloading from file stream', function() {
    beforeEach(function() {
      clock = sinon.useFakeTimers();
      sinon.stub(XMLHttpRequest.prototype, 'send', function() {});
    });

    afterEach(function() {
      clock.restore();
      XMLHttpRequest.prototype.send.restore();
    });

    it('should time out if updates aren\'t received', function() {
      var xhr = new XHR({ baseUrl: 'dummyURL' });
      xhr.send().should.eventually.be.rejectedWith(TimeoutError);
      clock.tick(XHR.timeoutLength_);
    });
  });

  describe('Successful Downloading from file stream', function() {
    beforeEach(function() {
      clock = sinon.useFakeTimers();
      sinon.stub(XHR.prototype, 'onSuccess_', function() {
        this.deferred_.resolve();
      });
      sinon.stub(XMLHttpRequest.prototype, 'send', function() {
        clock.tick(XHR.timeoutLength_ / 2);
        this.onprogress();
        clock.tick(XHR.timeoutLength_ / 2);
        this.onprogress();
        clock.tick(XHR.timeoutLength_ / 2);
        this.onprogress();
      });
    });

    afterEach(function() {
      clock.restore();
      XHR.prototype.onSuccess_.restore();
      XMLHttpRequest.prototype.send.restore();
    });

    it('should not time out if updates are received', function() {
      var xhr = new XHR({ baseUrl: 'dummyURL' });
      xhr.send().should.eventually.be.fulfilled;
    });
  });
});
