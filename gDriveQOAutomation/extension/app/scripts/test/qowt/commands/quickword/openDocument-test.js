/**
 * @fileoverview
 * Unit test to cover the Word openDocument command.
 *
 * @author jonbronson@google.com (Jonathhan Bronson)
 */

 define([
  'qowtRoot/commands/quickword/openDocument',
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/unique/invalidFileFormatError',
  'qowtRoot/errors/unique/passwordError',
  'qowtRoot/errors/unique/coreError'
], function(
  OpenDocumentCmd,
  QOWTException,
  InvalidFileFormatError,
  PasswordError,
  CoreError
  ) {

  'use strict';

  describe('Word; "openDocument" Command.', function() {

    var cmd;

    beforeEach(function() {
      cmd = OpenDocumentCmd.create({ path: 'path' });
    });

    afterEach(function() {
      cmd = undefined;
    });

    describe('name', function() {
      it('Should have the expected name.', function() {
        assert.equal(cmd.name, 'openDocument', 'Command name');
      });
    });

    describe('isOptimistic:', function() {
      it('Should provide isOptimistic', function() {
        assert.isFalse(cmd.isOptimistic(), 'openDocument.isOptimistic()');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isTrue(cmd.callsService(), 'openDocument.callsService()');
      });
    });

    describe('dcpData', function() {
      it('Should be implemented', function() {
        assert.isFunction(cmd.dcpData, 'openDocument.dcpData() defined');
      });
      it('Should return a JSON object', function() {
        var data = cmd.dcpData();
        assert.isObject(data, "dcpData() returns an object");
      });
      it('Should set the name property', function() {
        var pl = cmd.dcpData();
        assert.equal(pl.name, 'oDC', 'set the name property');
      });
    });

    describe('responseHook:', function() {
      it('Should override responseHook', function() {
        assert.isFunction(cmd.responseHook, 'openDocument.responseHook()');
      });
      it('Should rejiggle the response DCP', function() {
        var oldDcp = {
          'id': 0,
          'name': 'oDC',
          'docId': 1
        };
        var expectedDcp = {
          'elm': [{
                'docId': oldDcp.docId,
                'etp': 'odi',
          }],
          'id': oldDcp.id,
          'name': oldDcp.name,
          'version': (oldDcp.version || 1)
        };
        var rejigDcp = cmd.responseHook(oldDcp);
        assert.deepEqual(
          rejigDcp, expectedDcp,
          'rejiggled DCP');
      });
    });

    describe('onSuccess', function() {
      it('Should be implemented', function() {
        assert.isFunction(cmd.onSuccess, 'openDocument.onSuccess() defined');
      });
    });

    describe('onFailure', function() {
      it('Should be implemented', function() {
        assert.isFunction(cmd.onFailure, 'openDocument.onFailured() defined');
      });

      it('Should capture a password-protected error and send UI notification',
          function() {
        assert.throws( function() {
          var error = { error: { name: 'PasswordProtectedError' }};
          cmd.onFailure(error, {});
        },
        PasswordError, undefined,
        'throws PasswordProtectedError');
      });

      it('Should capture an invalid_file_format error and send UI notification',
          function() {
        assert.throws( function() {
          var error = { error: { name: 'InvalidFileFormatError' }};
          cmd.onFailure(error, {});
        },
        InvalidFileFormatError, undefined,
        'throws InvalidFileFormatError');
      });

      it('should handle all other errors as core errors',
          function() {
        var error = { error: { name: 'someOtherGeneralError' }};
        assert.throws( function() {
            cmd.onFailure(error, {});
        },
        CoreError, undefined,
        'throws CoreError');
      });

      it('should append error details in the message', function() {
        var response = { error: { name: 'UnsupportedFileFormatError',
          details: 'someDetails' }};
        try {
          cmd.onFailure(response);
        } catch (e) {
          assert.include(e.message, 'someDetails', 'message has error details');
        }
      });
    });

    describe('onFailure: in Incognito or Guest mode', function() {
      var odc_cmd_;

      beforeEach(function() {
        odc_cmd_ = OpenDocumentCmd.create({isIncognito : true});
      });

      afterEach(function() {
        odc_cmd_ = undefined;
      });

      it('should report FileOpenFailedError as incognito ' +
          'mode unsupported', function() {
        var error = { error: { name: 'FileOpenFailedError' }};
        assert.throws(
          function() {
            odc_cmd_.onFailure(error);
          }, QOWTException, /file_opened_in_incognito_mode_error_details/,
          'onFailure throws QOWTException'
        );
      });

      it('should not report other errors as incognito mode ' +
          'unsupported', function() {
        var error = { error: { name: 'InvalidFileFormatError' }};
        assert.throws(
          function() {
            odc_cmd_.onFailure(error);
          }, InvalidFileFormatError, undefined, 'onFailure throws ' +
          'InvalidFileFormatError'
        );
      });
    });
  });
});