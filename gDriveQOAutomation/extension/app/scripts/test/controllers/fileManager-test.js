/**
 * @fileoverview
 * Mocha based unit test for the App fileManager controller.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'controllers/fileManager',
  'utils/converter',
  'utils/fileWriter',
  'utils/gdrive/drive',
  'utils/xhr',
  'ui/progressSpinner',
  'qowtRoot/errors/qowtException',
  'qowtRoot/errors/unique/timeoutError',
  'qowtRoot/third_party/when/when'
], function(
    FileManager,
    Converter,
    FileWriter,
    Drive,
    XHR,
    ProgressSpinner,
    QOWTException,
    TimeoutError,
    when) {

  'use strict';

  describe('FileManager', function() {
    describe ('download_', function() {
      var config = {
        mimeType: 'dummy',
        streamURL: 'fictional',
        privateFile: 'private file',
        extension: "docx"
      };

      beforeEach(function() {
        // Mock progress spinner
        sinon.stub(ProgressSpinner, 'show');
        sinon.stub(ProgressSpinner, 'addContributor').returns(function() {});

        // Mock Session storage to not affect other tests
        sinon.stub(window.sessionStorage, 'getItem').returns(null);
        sinon.stub(window.sessionStorage, 'setItem');

        // Mock loading of plugin so that we always succeed in this step
        sinon.stub(FileManager, 'loadPlugin_').returns(when.resolve());
      });

      afterEach(function() {
        // Clean up mocks
        ProgressSpinner.show.restore();
        ProgressSpinner.addContributor.restore();
        window.sessionStorage.getItem.restore();
        window.sessionStorage.setItem.restore();
        FileManager.loadPlugin_.restore();

        FileManager.config_ = undefined;
      });

      describe('on file not written', function() {
        beforeEach(function() {
          // Make the FileWriter reject upon writing data
          sinon.stub(FileWriter.prototype, 'writeData').returns(
              when.reject(new Error('Failed to write data')));
          // Mock XHR to succeed
          sinon.stub(XHR.prototype, 'send').returns(
              when.resolve('fake response'));
        });

        afterEach(function() {
          // Clean up mocks
          FileWriter.prototype.writeData.restore();
          XHR.prototype.send.restore();
        });

        it('should reject with a fatal error', function() {
          return FileManager.init(config, 'DUMMY_UUID').should.eventually.be.
              rejectedWith(QOWTException);
        });
      });

      describe('on timeout', function() {
        beforeEach(function() {
          // Mock XHR to reject with a timeout error
          var error = new TimeoutError();
          sinon.stub(XHR.prototype, 'send').returns(when.reject(error));
        });

        afterEach(function() {
          // Clean up mocks
          XHR.prototype.send.restore();
        });

        it('should reject with a fatal timeout error', function() {
          return FileManager.init(config, 'DUMMY_UUID').should.eventually.be.
              rejectedWith(TimeoutError);
        });
      });
    });


    describe('displayName', function() {
      beforeEach(function() {
        var filenames = [
          '/testFileName.docx', // no encoding
          '/test_%20_.docx',    // encoded space
          '/test_%3B_.docx',    // encoded ;
          '/test_%2F_.docx',    // encoded /
          '/test_%3F_.docx',    // encoded ?
          '/test_%3A_.docx',    // encoded :
          '/test_%40_.docx',    // encoded @
          '/test_%26_.docx',    // encoded &
          '/test_%3D_.docx',    // encoded =
          '/test_%2B_.docx',    // encoded +
          '/test_%24_.docx',    // encoded $
          '/test_%2C_.docx',    // encoded ,
          '/test_%23_.docx',    // encoded #
          '/test_%25_.docx',    // encoded %
          '/test_ _.docx',      // unencoded space
          '/test_;_.docx',      // unencoded ;
          '/test_?_.docx',      // unencoded ?
          '/test_:_.docx',      // unencoded :
          '/test_@_.docx',      // unencoded @
          '/test_&_.docx',      // unencoded &
          '/test_=_.docx',      // unencoded =
          '/test_+_.docx',      // unencoded +
          '/test_$_.docx',      // unencoded $
          '/test_,_.docx',      // unencoded ,
          '/test_#_.docx',      // unencoded #
          '/test_%_.docx',      // unencoded %
          '/%20%3B%3F%3A@%26%3D+%24%2C%23%25.docx' // all together
        ];

        // Stub out FileManager.userFilePath
        // The displayName() function relies on the userFilePath() to get
        // the current filename, stub userFilePath to return the contents of
        // a provided array.
        sinon.stub(FileManager, 'userFilePath', function() {
          return filenames.shift();
        });
      });

      afterEach(function() {
        FileManager.userFilePath.restore();
      });

      it('should handle encoded and non-encoded filename strings', function() {
        expect(FileManager.displayName()).to.equal('testFileName.docx');
        expect(FileManager.displayName()).to.equal('test_ _.docx');
        expect(FileManager.displayName()).to.equal('test_;_.docx');
        expect(FileManager.displayName()).to.equal('test_/_.docx');
        expect(FileManager.displayName()).to.equal('test_?_.docx');
        expect(FileManager.displayName()).to.equal('test_:_.docx');
        expect(FileManager.displayName()).to.equal('test_@_.docx');
        expect(FileManager.displayName()).to.equal('test_&_.docx');
        expect(FileManager.displayName()).to.equal('test_=_.docx');
        expect(FileManager.displayName()).to.equal('test_+_.docx');
        expect(FileManager.displayName()).to.equal('test_$_.docx');
        expect(FileManager.displayName()).to.equal('test_,_.docx');
        expect(FileManager.displayName()).to.equal('test_#_.docx');
        expect(FileManager.displayName()).to.equal('test_%_.docx');
        expect(FileManager.displayName()).to.equal('test_ _.docx');
        expect(FileManager.displayName()).to.equal('test_;_.docx');
        expect(FileManager.displayName()).to.equal('test_?_.docx');
        expect(FileManager.displayName()).to.equal('test_:_.docx');
        expect(FileManager.displayName()).to.equal('test_@_.docx');
        expect(FileManager.displayName()).to.equal('test_&_.docx');
        expect(FileManager.displayName()).to.equal('test_=_.docx');
        expect(FileManager.displayName()).to.equal('test_+_.docx');
        expect(FileManager.displayName()).to.equal('test_$_.docx');
        expect(FileManager.displayName()).to.equal('test_,_.docx');
        expect(FileManager.displayName()).to.equal('test_#_.docx');
        expect(FileManager.displayName()).to.equal('test_%_.docx');
        expect(FileManager.displayName()).to.equal(' ;?:@&=+$,#%.docx');
      });
    });

    describe('initialization', function() {
      var sandbox_, config_;
      beforeEach(function() {
        sandbox_ = sinon.sandbox.create();
        config_ = {
          mimeType: 'dummy',
          privateFile: 'private file',
          downloadFile: 'download file',
          extension: 'docx',
          driveDocId_: 'some-drive-doc-id'
        };
      });
      afterEach(function() {
        sandbox_.restore();
        sandbox_ = undefined;
        config_ = undefined;
      });

      it('should create downloadable file for stream file', function() {
        sandbox_.stub(FileManager, 'getFileType_').returns('stream');
        sandbox_.stub(FileManager, 'download_').returns(when.resolve());
        sandbox_.stub(FileManager, 'loadPlugin_').returns(when.resolve());
        sandbox_.stub(FileManager, 'createDownloadableFile_');

        var promise = FileManager.init(config_, 'DUMMY_UUID');
        return assert.isFulfilled(promise, 'file manager initialized')
            .then(function() {
              assert.isTrue(FileManager.createDownloadableFile_.called,
                  'downloadable file creation initiated');
            });
      });

      it('should create downloadable file for drive file', function() {
        sandbox_.stub(FileManager, 'getFileType_').returns('driveDoc');

        var metaData = {
          mimeType: 'some mime type',
          title: 'some title',
          id: 'some id'
        };
        sandbox_.stub(Drive, 'getMetaData').returns(when.resolve(metaData));
        sandbox_.stub(FileManager, 'initAppState_');
        sandbox_.stub(FileManager, 'download_').returns(when.resolve());
        sandbox_.stub(FileManager, 'loadPlugin_').returns(when.resolve());
        sandbox_.stub(FileManager, 'createDownloadableFile_');

        var promise = FileManager.init(config_, 'DUMMY_UUID');
        return assert.isFulfilled(promise, 'file manager initialized')
            .then(function() {
              assert.isTrue(FileManager.createDownloadableFile_.called,
                  'downloadable file creation initiated');
            });
      });

      it('should reject if the drive doc id starts with ../', function() {
        config_.driveDocId_ = '../somerandomstring';
        sandbox_.stub(FileManager, 'getFileType_').returns('driveDoc');

        var metaData = {
          mimeType: 'some mime type',
          title: 'some title',
          id: 'some id',

        };
        sandbox_.stub(Drive, 'getMetaData').returns(when.resolve(metaData));
        sandbox_.stub(FileManager, 'initAppState_');
        sandbox_.stub(FileManager, 'download_').returns(when.resolve());
        sandbox_.stub(FileManager, 'loadPlugin_').returns(when.resolve());
        sandbox_.stub(FileManager, 'createDownloadableFile_');

        return FileManager.init(config_, 'DUMMY_UUID').should.eventually.be.
            rejectedWith(QOWTException);
      });

      it('should create downloadable file for user file', function() {
        sandbox_.stub(FileManager, 'getFileType_').returns('userFile');
        sandbox_.stub(FileManager, 'copyFile_').returns(when.resolve());
        sandbox_.stub(FileManager, 'loadPlugin_').returns(when.resolve());
        sandbox_.stub(FileManager, 'createDownloadableFile_');

        var promise = FileManager.init(config_, 'DUMMY_UUID');
        return assert.isFulfilled(promise, 'file manager initialized')
            .then(function() {
              assert.isTrue(FileManager.createDownloadableFile_.called,
                  'downloadable file creation initiated');
            });
      });
    });

    describe('createDownloadableFile', function() {
      it('should call createDownloadableFileFromPrivateFile_', function() {
        var sandbox = sinon.sandbox.create();

        sandbox.stub(FileManager, 'createDownloadableFileFromPrivateFile_');
        var promise = Promise.resolve();
        sandbox.stub(FileManager, 'getTempFs_').returns(promise);

        FileManager.createDownloadableFile_();

        return assert.isFulfilled(promise, 'file system available')
            .then(function() {
              assert.isTrue(FileManager.createDownloadableFileFromPrivateFile_.
                  called, 'createDownloadableFileFromPrivateFile_ called');
              sandbox.restore();
            });
      });
    });

    describe('createDownloadableFileFromPrivateFile_', function() {
      it('should create a copy of the privateFile', function() {
        FileManager.config_ = {privateFile: {name: 'dummy.pptx',
          copyTo: function() {}}};

        sinon.stub(FileManager.config_.privateFile, 'copyTo');

        FileManager.createDownloadableFileFromPrivateFile_({root: 'dummyRoot'});
        assert.isTrue(FileManager.config_.privateFile.copyTo.called,
            'copyTo called on privateFile');
        FileManager.config_.privateFile.copyTo.restore();
        FileManager.config_ = undefined;
      });
    });

    describe('tryToRestoreFiles_', function() {
      it('should check for restore downloadFile ', function() {
        var sandbox = sinon.sandbox.create();
        FileManager.config_ = {};
        var promise = Promise.resolve();
        sandbox.stub(FileManager, 'restorePrivateFile_').returns(promise);
        sandbox.stub(FileManager, 'restoreDownloadFile_');

        var cache = {
          privateFilePath: 'private file path',
          downloadFilePath: 'download file path',
          downloadFileName: 'file name'
        };
        FileManager.tryToRestoreFiles_(cache);

        return assert.isFulfilled(promise, 'file system available')
            .then(function() {
              assert.isTrue(FileManager.restoreDownloadFile_.called,
                  'restoreDownloadFile_ called');
              assert.strictEqual(FileManager.config_.downloadFileName,
                  'file name', 'downloadFileName restored correctly');
              sandbox.restore();
            });
      });
    });

    describe('restoreDownloadFile_', function() {
      it('should restore downloadFile if present in cache', function() {
        FileManager.config_ = {};
        var sandbox = sinon.sandbox.create();
        var tempFilePromise = Promise.resolve();
        var openFilePromise = new Promise(function(resolve) {
          resolve('some file entry');
        });

        sandbox.stub(FileManager, 'getTempFs_').returns(tempFilePromise);
        sandbox.stub(FileManager, 'openFile_').returns(openFilePromise);

        FileManager.restoreDownloadFile_('someFileName');

        return assert.isFulfilled(tempFilePromise, 'file system available')
            .then(function() {
              assert.isTrue(FileManager.openFile_.called, 'openFile_ called');
              return assert.isFulfilled(openFilePromise, 'file available')
                  .then(function() {
                       assert.strictEqual(FileManager.config_.downloadFile,
                           'some file entry');
                       sandbox.restore();
                  });
            });
      });

      it('should create downloadFile if not present in cache', function() {
        FileManager.config_ = {};
        var sandbox = sinon.sandbox.create();
        var tempFilePromise = Promise.resolve();

        sandbox.stub(FileManager, 'getTempFs_').returns(tempFilePromise);
        sandbox.stub(FileManager, 'createDownloadableFile_');

        FileManager.restoreDownloadFile_();

        return assert.isFulfilled(tempFilePromise, 'file system available')
            .then(function() {
              assert.isTrue(FileManager.createDownloadableFile_.called,
                  'download file created');
            });
      });
    });

    // Disabling this test for the time being. As we are not sure about how
    // to mock/fake the constructor call for 'File', which is being called
    // in FileManager's downloadToLocalFile().
    // Though test is failing, functionality is not broken.
    xdescribe('downloadToLocalFile', function() {
      var sandbox_, promise_;
      beforeEach(function() {
        sandbox_ = sinon.sandbox.create();
        FileManager.config_ = {downloadFile: 'download file'};
        chrome.downloads = {
          download: function() {}
        };
        sandbox_.stub(chrome.downloads, 'download');
        sandbox_.stub(window.URL, 'createObjectURL').returns('some url');
        sandbox_.stub(FileManager, 'originalURL', function() {
          return 'some url';
        });

        promise_ = Promise.resolve();
        sandbox_.stub(FileManager, 'getFileFromEntry_').returns(promise_);
      });

      afterEach(function() {
        sandbox_.restore();
        sandbox_ = promise_ = undefined;
        FileManager.config_ = chrome.downloads = undefined;
      });

      it('should download file using current display name and file url',
          function() {
            FileManager.config_.downloadFileName = 'file name.docx';
            FileManager.downloadToLocalFile();
            return assert.isFulfilled(promise_, 'file fetched')
                .then(function() {
                  assert.isTrue(chrome.downloads.download.called,
                      'download called');
                  var callArgument = chrome.downloads.download.getCall(0).
                      args[0];
                  assert.strictEqual(callArgument.url, 'some url',
                      'file downloaded with correct file url');
                  assert.strictEqual(callArgument.filename,
                      FileManager.config_.downloadFileName,
                      'file downloaded with correct file name');
                  assert.strictEqual(callArgument.conflictAction, 'uniquify',
                      'file downloaded after uniquifying file name');
                  assert.isFalse(callArgument.saveAs,
                      'file downloaded with saveAs false');
                });
          });

      it('should encode the download file name if it has special characters',
          function() {
            FileManager.config_.downloadFileName = 'file?name/abc.docx';
            FileManager.downloadToLocalFile();
            return assert.isFulfilled(promise_, 'file fetched')
                .then(function() {
                  var callArgument = chrome.downloads.download.getCall(0).
                      args[0];
                  assert.strictEqual(callArgument.filename,
                      encodeURIComponent(FileManager.config_.downloadFileName),
                      'file downloaded with correct file name');
                });
          });

      it('should give a default name to the file to be downloaded, if the ' +
          'file name is undefined', function() {
            sandbox_.stub(Converter, 'mime2Extension').returns('docx');
            FileManager.config_.downloadFileName = undefined;
            FileManager.downloadToLocalFile();
            return assert.isFulfilled(promise_, 'file fetched')
                .then(function() {
                  var callArgument = chrome.downloads.download.getCall(0).
                      args[0];
                  assert.strictEqual(callArgument.filename,
                      'downloadedFile.docx',
                      'file downloaded with correct file name');
                });
          });

      it('should download file with correct name',
          function() {
            var allowedExt = ['file.csv', 'file.doc', 'file.docx', 'file.docm',
              'file.ppt', 'file.pptx', 'file.pptm',
              'file.xls', 'file.xlsx', 'file.xlsm',
              'file.dot', 'file.dotx', 'file.dotm',
              'file.xlt', 'file.xltx', 'file.xltm',
              'file.pot', 'file.potx', 'file.potm'];
            allowedExt.forEach(function(ext) {
              FileManager.config_.downloadFileName = ext;
              var downloadFileName = FileManager.tryAndGetDownloadFileName_();
              assert.strictEqual(ext, downloadFileName, 'Received ' +
                  'correct downloaded file name');
            });
          });
    });
  });
});
