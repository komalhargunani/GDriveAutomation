define([
  'qowtRoot/errors/qowtException'
], function(
  QOWTException) {

  'use strict';

  /**
   * An error that is raised when a PDF file format is detected.  We get reports
   * of unsupported files with .doc or .docx extensions from users that are
   * really PDF files
   * @constructor
   *
   * @param {String|Object} opt_msg optional string or config object to pass
   *                                to base QOWTException c'tor.
   */
  var PDFFileFormat = function(/* opt_msg */) {
    // unique details for this error; set these before base calling the
    // QOWTException c'tor so the this.message is initialised correctly
    this.title = 'file_type_unsupported_msg';
    this.details = 'file_pdf_type_rename_msg';
    this.gaState = 'UnsupportedFileFormat';

    QOWTException.apply(this, arguments);
    this.name = 'PDFFileFormat';
    Error.captureStackTrace(this, PDFFileFormat);
  };

  PDFFileFormat.prototype = Object.create(QOWTException.prototype);
  PDFFileFormat.prototype.constructor = PDFFileFormat;

  return PDFFileFormat;
});
