
define([
  'qowtRoot/utils/imageUtils',
  'qowtRoot/drawing/pictureRecolor/recolorRequest',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/drawing/pictureRecolor/effects/grayscaleEffect'
], function(ImageUtils,
            RecolorRequest,
            QowtSilentError,
            ErrorCatcher,
            GrayscaleEffect) {

  'use strict';

  describe('ImageUtils Test', function() {

    describe('Test "applyEffects" API', function() {
      beforeEach(function() {
        sinon.stub(ErrorCatcher, 'handleError');
      });

      afterEach(function() {
        ErrorCatcher.handleError.restore();
      });

      it('should correctly return a promise when all required parameters are ' +
          'passed and the image is in png format', function(done) {
           var imageDataUrl = '/base/app/scripts/test/qowt/utils/pallete.png',
                recolorRequest = new RecolorRequest(),
                returnValue;

            recolorRequest.addEffect(new GrayscaleEffect());
            returnValue = ImageUtils.applyEffects(imageDataUrl, recolorRequest);

            assert.isDefined(returnValue);
            assert.instanceOf(returnValue, Promise);
            assert.eventually.match(returnValue, /^data:image\/png;base64,/,
                'Applier\'s promise resolved').notify(done);
          });

      it('should correctly return a promise when all required parameters are ' +
          'passed and the image is in jpg format', function(done) {
            var imageDataUrl = '/base/app/scripts/test/qowt/utils/pallete.jpg',
                recolorRequest = new RecolorRequest(),
                returnValue;

            recolorRequest.addEffect(new GrayscaleEffect());
            returnValue = ImageUtils.applyEffects(imageDataUrl, recolorRequest);

            assert.isDefined(returnValue);
            assert.instanceOf(returnValue, Promise);
            assert.eventually.match(returnValue, /^data:image\/jpeg;base64,/,
                'Applier\'s promise resolved').notify(done);
          });

      it('should reject the promise when invalid image url parameter is ' +
          'passed', function(done) {
            var imageUrl = 'some invalid path to url',
                recolorRequest = new RecolorRequest(),
                returnValue;

            recolorRequest.addEffect(new GrayscaleEffect());
            returnValue = ImageUtils.applyEffects(imageUrl, recolorRequest);

            assert.isDefined(returnValue);
            assert.instanceOf(returnValue, Promise);
            assert.isRejected(returnValue, new RegExp('Image to be recolored ' +
                'could not be loaded!')).notify(done);
          });

      it('should reject the promise if exception encountered when ' +
          'processing', function(done) {
            // We try to simulate a situation that results in an exception being
            // thrown in applyEffects_ api, to test logging of error and
            // rejection of promise.
            sinon.stub(document, 'createElement', function() {
              return undefined;
            });

            var imageUrl = '/base/app/scripts/test/qowt/utils/pallete.png',
                recolorRequest = new RecolorRequest(),
                returnValue;

            recolorRequest.addEffect(new GrayscaleEffect());
            returnValue = ImageUtils.applyEffects(imageUrl, recolorRequest);

            assert.isDefined(returnValue);
            assert.instanceOf(returnValue, Promise);
            returnValue.then(function() {
              assert.fail(true, true, 'Promise resolved but it was supposed ' +
                  'to be rejected!');

              // restore the stub with original to not mess up something in
              // following tests
              document.createElement.restore();

              done();
            }, function(ex) {
              assert.isDefined(ex);
              assert.isTrue(ErrorCatcher.handleError.calledOnce);
              assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
                  new QowtSilentError('ImageUtils: Effects couldn\'t be ' +
                      'processed!'));

              // restore the stub with original to not mess up something in
              // following tests
              document.createElement.restore();

              done();
            });
          });

      it('should log a message and return null when imageBlob parameter is ' +
          'not passed', function() {
            var recolorRequest = new RecolorRequest(),
                returnValue;

            recolorRequest.addEffect(new GrayscaleEffect());
            returnValue = ImageUtils.applyEffects(undefined, recolorRequest);

            assert.isNull(returnValue);
            assert.isTrue(ErrorCatcher.handleError.calledOnce);
            assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
                new QowtSilentError('ImageUtils: Effects requested to be' +
                    ' applied but either of the params or effects data is ' +
                    'incomplete!'));
          });

      it('should log a message and return null when recolorRequest parameter ' +
          'is not passed', function() {
            var imageUrl = 'some image blob url',
                returnValue;

            returnValue = ImageUtils.applyEffects(imageUrl, undefined);

            assert.isNull(returnValue);
            assert.isTrue(ErrorCatcher.handleError.calledOnce);
            assert.deepEqual(ErrorCatcher.handleError.firstCall.args[0],
                new QowtSilentError('ImageUtils: Effects requested to be' +
                    ' applied but either of the params or effects data is ' +
                    'incomplete!'));
          });
    });
  });
});
