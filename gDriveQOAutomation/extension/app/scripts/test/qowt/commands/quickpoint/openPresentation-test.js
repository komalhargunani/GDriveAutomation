define([
  'qowtRoot/commands/quickpoint/openPresentation',
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/unique/corruptFileError',
  'qowtRoot/errors/unique/invalidFileFormatError',
  'qowtRoot/errors/unique/passwordError',
  'qowtRoot/utils/deprecatedUtils'
], function(
    OpenPresentationCmd,
    QOWTException,
    CorruptFileError,
    InvalidFileFormatError,
    PasswordError,
    DeprecatedUtils) {

  'use strict';

  describe('Point "openPresentation" command', function() {

    var cmd_, arrayBuffer_ = new ArrayBuffer(1);

    beforeEach(function() {
      cmd_ = OpenPresentationCmd.create({buffer : arrayBuffer_});
    });

    afterEach(function() {
      cmd_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(cmd_.name, 'openPresentation', 'Command name');
      });
    });

    describe('isOptimistic:', function() {
      it('Should be non optimistic', function() {
        assert.isFalse(cmd_.isOptimistic(), 'openPresentation.isOptimistic()');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isTrue(cmd_.callsService(), 'openPresentation.callsService()');
      });
    });

    describe('dcpData:', function() {
      var dcpData_;
      beforeEach(function() {
        dcpData_ = cmd_.dcpData();
      });

      afterEach(function() {
        dcpData_ = undefined;
      });

      it('should be implemented', function() {
        assert.isFunction(cmd_.dcpData, 'openPresentation.dcpData');
      });

      it('should return a JSON object', function() {
        assert.isObject(dcpData_, 'dcp data is an object');
      });

      it('should define the name property', function() {
        assert.strictEqual(dcpData_.name, 'oPT', 'names are equal');
      });

      it('should define the buffer property', function() {
        // buffer property for the command is optional. However, since we have
        // created the command by giving it a buffer we test for this optinal
        // property as well.
        assert.deepEqual(dcpData_.buffer, arrayBuffer_, 'buffers are equal');
      });
    });

    describe('onSuccess:', function() {
      it('should implement the onSuccess hook', function() {
        assert.isFunction(cmd_.onSuccess, 'openPresentation.onSuccess');
      });

      it('should set the bulletTextMeasureElement if it is undefined',
          function() {
            DeprecatedUtils.bulletTextMeasureElement = undefined;
            sinon.stub(DeprecatedUtils, 'setBulletTextMeasureElement');
            cmd_.onSuccess();
            assert.isTrue(
                DeprecatedUtils.setBulletTextMeasureElement.calledOnce,
                'setBulletTextMeasureElement called once');
            DeprecatedUtils.setBulletTextMeasureElement.restore();
          });

      it('should not set the bulletTextMeasureElement if it is defined',
          function() {
            DeprecatedUtils.bulletTextMeasureElement = {};
            sinon.stub(DeprecatedUtils, 'setBulletTextMeasureElement');
            cmd_.onSuccess();
            assert.isTrue(
                DeprecatedUtils.setBulletTextMeasureElement.notCalled,
                'setBulletTextMeasureElement not called');
            DeprecatedUtils.setBulletTextMeasureElement.restore();
            DeprecatedUtils.bulletTextMeasureElement = undefined;
          });
    });

    describe('onFailure:', function() {
      it('should implement the onFailure hook', function() {
        assert.isFunction(cmd_.onFailure, 'openPresentation.onFailure');
      });

      it('should capture a password-protected error and send UI ' +
          'notification', function() {
            // we handle 'ip', 'pnf', and 'irmf' errors with the same
            // UI message to the user

            assert.throws(function() {
              cmd_.onFailure({e: 'ip'}, {});
            }, PasswordError, undefined, 'onFailure for error code "ip"' +
                ' throws Password Error');

            assert.throws(function() {
              cmd_.onFailure({e: 'pnf'}, {});
            }, PasswordError, undefined, 'onFailure for error code "pnf"' +
                ' throws Password Error');

            assert.throws(function() {
              cmd_.onFailure({e: 'irmf'}, {});
            }, PasswordError, undefined, 'onFailure for error code "irmf"' +
                ' throws Password Error');
          });

      it('should capture an invalid_file_format error and send UI ' +
          'notification', function() {
            assert.throws(function() {
              cmd_.onFailure({e: 'iff'}, {});
            }, InvalidFileFormatError, undefined, 'onFailure throws ' +
                'Invalid File Format Error');
          });

      it('should handle all other errors as file open errors', function() {
        assert.throws(function() {
          cmd_.onFailure({e: 'someOtherGeneralError'}, {});
        }, CorruptFileError, undefined, 'onFailure throws CorruptFileError');
      });
    });

    describe('onFailure: in Incognito or Guest mode', function() {
      var opt_cmd_;

      beforeEach(function() {
        opt_cmd_ = OpenPresentationCmd.create({isIncognito : true});
      });

      afterEach(function() {
        opt_cmd_ = undefined;
      });

      it('should report dzf error as incognito mode unsupported', function() {
        assert.throws(
          function() {
            opt_cmd_.onFailure({e: 'dzf'});
          }, QOWTException, /file_opened_in_incognito_mode_error_details/,
          'onFailure throws QOWTException'
        );
      });

      it('should not report other errors as incognito mode ' +
          'unsupported', function() {
        assert.throws(
          function() {
            opt_cmd_.onFailure({e: 'iff'});
          }, InvalidFileFormatError, undefined, 'onFailure throws ' +
          'Invalid File Format Error'
        );
      });
    });
  });
});
