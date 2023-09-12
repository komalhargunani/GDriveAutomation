define([
  'qowtRoot/commands/quicksheet/openWorkbookFile',
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/unique/corruptFileError',
  'qowtRoot/errors/unique/invalidFileFormatError',
  'qowtRoot/errors/unique/unsupportedFileFormatError',
  'qowtRoot/errors/unique/passwordError'
], function(
    OpenWorkbookFile,
    QOWTException,
    CorruptFileError,
    InvalidFileFormatError,
    UnsupportedFileFormatError,
    PasswordError) {

  'use strict';

  describe('OpenWorkbookFile command', function() {

    describe('creation', function() {
      it('should correctly initialise the command object if a path is given ' +
          'to the creator', function() {
        var cmd = OpenWorkbookFile.create();
        expect(cmd.name).toBe('OpenWorkbookFile');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBeFalsy();
        expect(cmd.callsService()).not.toBeFalsy();
        expect(cmd.dcpData().name).toBe('owb');
      });

    });

    describe('command failure response handling', function() {

      var cmd;

      beforeEach(function() {
        cmd = OpenWorkbookFile.create('foobar.xls');
      });

      afterEach(function() {
        cmd = undefined;
      });

      it('should capture a password-protected error and send UI notification',
        function() {
          // we handle 'ip', 'ppe', 'pnf', and 'irmf' errors with the same
          // UI message to the user
          expect(function() {
            cmd.onFailure({e: 'ip'}, {});
          }).toThrowError(new PasswordError());

          expect(function() {
            cmd.onFailure({e: 'pnf'}, {});
          }).toThrowError(new PasswordError());

          expect(function() {
            cmd.onFailure({e: 'ppe'}, {});
          }).toThrowError(new PasswordError());

          expect(function() {
            cmd.onFailure({e: 'irmf'}, {});
          }).toThrowError(new PasswordError());
        });

      it('should capture an invalid_file_format error and send UI notification',
        function() {
          expect(function() {
            cmd.onFailure({
              e: 'iff'
            }, {});
          }).toThrowError(new InvalidFileFormatError());
        });

      it('should handle all other errors as file open errors',
        function() {
          expect(function() {
            cmd.onFailure({
              e: 'someOtherGeneralError'
            }, {});
          }).toThrowError(new CorruptFileError());
        });

      it('should capture an UnsupportedFileFormat error and send UI ' +
          'notification', function() {
            expect(function() {
              cmd.onFailure({
                e: 'uff'
              }, {});
            }).toThrowError(new UnsupportedFileFormatError());
          });

      it('should append error details in the message', function() {
        var response = {
          e: 'uff',
          m: 'someDetails'
        };
        try {
          cmd.onFailure(response);
        } catch (e) {
          expect(e.message).toContain('someDetails');
        }
      });
    });

    describe('onFailure: in Incognito or Guest mode', function() {
      var owb_cmd_;

      beforeEach(function() {
        owb_cmd_ = OpenWorkbookFile.create({isIncognito : true});
      });

      afterEach(function() {
        owb_cmd_ = undefined;
      });

      it('should report fof error as incognito mode unsupported', function() {
        expect(
          function() {
            owb_cmd_.onFailure({e: 'fof'});
        }).toThrowError(new QOWTException({
          title: 'file_opened_in_incognito_mode_error_title',
          details: 'file_opened_in_incognito_mode_error_details'
        }));
      });

      it('should not report other errors as incognito mode ' +
          'unsupported', function() {
        expect(
          function() {
            owb_cmd_.onFailure({e: 'iff'});
        }).toThrowError(new InvalidFileFormatError());
      });
    });

  });
});
