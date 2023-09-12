// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview simple module to convert various file/app related
 * concepts
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  var _api = {

    app2Icon: function(app) {
      // avoid exception being thrown further down on toLowerCase on undefined
      app = app || '';

      var map = {
        'word': '../img/doc.ico',
        'sheet': '../img/xls.ico',
        'point': '../img/ppt.ico'
      };
      return map[app.toLowerCase()];
    },

    extension2Format: function(extension) {
      // avoid exception being thrown further down on toLowerCase on undefined
      extension = extension || '';

      var map = {
        'doc': 'CBF',
        'docx': 'OOXML',
        'docm': 'OOXML',
        'dot':'CBF',
        'dotx':'OOXML',
        'xls': 'CBF',
        'xlsx': 'OOXML',
        'xlsm': 'OOXML',
        'xlt':'CBF',
        'xltx':'OOXML',
        'csv': 'CSV',
        'ppt': 'CBF',
        'pptx': 'OOXML',
        'pptm': 'OOXML',
        'pot':'CBF',
        'potx':'OOXML'
      };
      return map[extension.toLowerCase()];
    },

    extension2App: function(extension) {
      // avoid exception being thrown further down on toLowerCase on undefined
      extension = extension || '';

      var map = {
        'doc': 'word',
        'docx': 'word',
        'docm': 'word',
        'dot':'word',
        'dotx':'word',
        'xls': 'sheet',
        'xlsx': 'sheet',
        'xlsm': 'sheet',
        'xlt':'sheet',
        'xltx':'sheet',
        'csv': 'sheet',
        'ppt': 'point',
        'pptx': 'point',
        'pptm': 'point',
        'pot':'point',
        'potx':'point'
      };
      return map[extension.toLowerCase()];
    },


    extension2Mime: function(extension) {
      // avoid exception being thrown further down on toLowerCase on undefined
      extension = extension || '';

      var map = {
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.' +
            'wordprocessingml.document',
        'docm': 'application/vnd.ms-word.document.macroenabled.12',
        'dot':'application/msword-template',
        'dotx':'application/vnd.openxmlformats-officedocument.' +
            'wordprocessingml.template',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.' +
            'spreadsheetml.sheet',
        'xlsm': 'application/vnd.ms-excel.sheet.macroenabled.12',
        'xlt':'application/vnd.ms-excel',
        'xltx':'application/vnd.openxmlformats-officedocument.spreadsheetml.' +
            'template',
        'csv': 'text/csv',
        'ppt': 'application/vnd.ms-powerpoint',
        'pptx': 'application/vnd.openxmlformats-officedocument.' +
            'presentationml.presentation',
        'pptm': 'application/vnd.ms-powerpoint.presentation.macroenabled.12',
        'pot':'application/vnd.ms-powerpoint',
        'potx':'application/vnd.openxmlformats-officedocument.presentationml.' +
            'template'
      };
      return map[extension.toLowerCase()];
    },


    app2FileName: function(app) {
      // avoid exception being thrown further down on toLowerCase on undefined
      app = app || '';

      var map = {
        'word': 'Document',
        'point': 'Presentation',
        'sheet': 'Spreadsheet'
      };
      return map[app.toLowerCase()];
    },


    url2App: function(url) {
      // avoid exception being thrown due to undefined url
      url = url || '';
      var app,
          extension = '',
          parsedUrl = url.match(/.*\/([^\/?]*)/);

      if (parsedUrl) {
        var fileName = parsedUrl[1];
        var parsedFile = fileName.match(/.*\.([^\.]*)$/);
        if (parsedFile) {
          extension = parsedFile[1];
        }
      }

      switch (extension.toLowerCase()) {
      case 'doc':
      case 'docx':
      case 'docm':
        app = 'word';
        break;
      case 'xls':
      case 'xlsx':
      case 'xlsm':
      case 'csv':
        app = 'sheet';
        break;
      case 'ppt':
      case 'pptx':
      case 'pptm':
        app = 'point';
        break;
      default:
        break;
      }

      return app;
    },

    mime2Extension: function (mime) {
      // make sure the mime var is a string to avoid
      // an exception being thrown further down on toLowerCase
      mime = mime || '';
      return _mimeMap[mime.toLowerCase()];
    },

    mime2App: function(mime) {
      return _api.extension2App(_api.mime2Extension(mime));
    },

    mime2Icon: function(mime) {
      return _api.app2Icon(_api.mime2App(mime));
    },

    mime2Format: function(mime) {
      return _api.extension2Format(_api.mime2Extension(mime));
    },

    name2ext: function(fileName) {
      // avoid exception being thrown due to undefined fileName
      fileName = fileName || '';
      var extension = '';

      var parsedFile = fileName.match(/.*\.([^\.]*)$/);
      if (parsedFile) {
        extension = parsedFile[1];
      }
      return extension;
    }

  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  /**
   * @private
   * A lookup of mimetypes, giving an appropriate file extension.
   * To be more tolerant all entrires are lower-cased, and all comparisons
   * should be made with lower-case keys. See CrBug 351041.
   */
  var _mimeMap = {
    /* Word processing types. */
    'application/msword': 'doc',
    'application/vnd.ms-word': 'doc',
    'application/vnd.msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
    'application/vnd.wordprocessing-openxml': 'docx',
    'application/vnd.ms-word.document.macroenabled.12': 'docm',
    'application/vnd.ms-word.document.12': 'docm',

    // this mime type is somewhat invalid i think, as it does not give
    // the right format (eg word/sheet/point). But I've seen it live out
    // there so for now we'll just map this to word...
    // see: curl -I www.thedunkirkinndenbydale.com/Xmas_Fayre_Menu_2012.docx
    'application/vnd.openxmlformats': 'docx',

    'application/msword-template':'dot',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
        'dotx',

    /* Presentation types. */
    'application/mspowerpoint': 'ppt',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'pptx',
    'application/vnd.presentation-openxml': 'pptx',
    'application/vnd.presentation-openxmlm': 'pptx',
    'application/vnd.ms-powerpoint.presentation.macroenabled.12': 'pptm',
    'application/vnd.openxmlformats-officedocument.presentationml.template':
        'potx',

    /* Spreadsheet types. */
    'application/msexcel': 'xls',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.spreadsheet-openxml': 'xlsx',
    'application/vnd.ms-excel.sheet.macroenabled.12': 'xlsm',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
        'xltx',
    'text/csv': 'csv'
  };

  return _api;
});
