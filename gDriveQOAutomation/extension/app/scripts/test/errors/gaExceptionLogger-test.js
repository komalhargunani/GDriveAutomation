define([
  'errorObservers/gaExceptionLogger',
  'utils/analytics/googleAnalytics',
  'qowtRoot/errors/unique/textualEditError',
  'qowtRoot/pubsub/pubsub'
  ], function(gaExceptionLogger, GA, TextualEditError, PubSub) {

  'use strict';

  describe("GA Exception Logger", function() {

    var error;

    beforeEach(function() {
      error = new TextualEditError();
      sinon.spy(GA, 'sendException');
      PubSub.publish('qowt:init');
    });


    afterEach(function() {
      GA.sendException.restore();
    });


    it("should log unique exception names", function() {
      gaExceptionLogger(error);
      sinon.assert.calledWith(GA.sendException, sinon.match.has('msg',
          sinon.match('TextualEditError')));
    });


    it("should log the debug msg passed to the error", function() {
      var editError = new TextualEditError('foo');
      gaExceptionLogger(editError);
      sinon.assert.calledWith(GA.sendException, sinon.match.has('msg',
          sinon.match('foo')));
    });


    it("should only log the fist fatal error, not subsequent fatal errors.",
        function() {
      // error is fatal, but for test purposes guard to ensure it is.
      error.fatal = true;

      // Log our first fatal error.
      gaExceptionLogger(error);
      // Try logging a another fatal error.
      gaExceptionLogger(error);

      sinon.assert.calledOnce(GA.sendException);
    });


    it("should log all non-fatal errors prior to the first fatal error.",
        function() {
      error.fatal = false;

      // These 2 non-fatal errors should be logged.
      gaExceptionLogger(error);
      gaExceptionLogger(error);

      // This first fatal error should be logged.
      error.fatal = true;
      gaExceptionLogger(error);

      sinon.assert.calledThrice(GA.sendException);
    });
  });
});
