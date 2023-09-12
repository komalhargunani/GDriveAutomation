define([
  'qowtRoot/errors/qowtException'
], function(
  QOWTException) {

  'use strict';

  /**
   * An error that is raised when an RTF file format is detected.  We get
   * reports of unsupported files with .doc or .docx extensions from users that
   * are really RTF files.  This error allows us to have clearer feedback
   * reports and provide better messaging to users.
   * @constructor
   *
   * @param {String|Object} opt_msg optional string or config object to pass
   *                                to base QOWTException c'tor.
   */
  var RTFFileFormat = function(/* opt_msg */) {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialised correctly
    this.title = 'file_type_unsupported_msg';
    this.details = 'file_rtf_type_rename_msg';
    this.gaState = 'UnsupportedFileFormat';

    QOWTException.apply(this, arguments);
    this.name = 'RTFFileFormat';
    Error.captureStackTrace(this, RTFFileFormat);
  };

  RTFFileFormat.prototype = Object.create(QOWTException.prototype);
  RTFFileFormat.prototype.constructor = RTFFileFormat;

  return RTFFileFormat;
});
