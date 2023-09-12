/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview little Jasmine utility module to format
 * jasmine error reporting better. Pulled out in it's own
 * file so that both E2E tests and unit tests can make
 * use of it without duplicating code.
 *
 * Note: this is not a requireJs module as we have no need
 * for any API. We merely set the Error.prepareStackTrace
 * function to our own, and can thus be loaded as a
 * requireJs dep rather than having clients require to call
 * some "enable" function.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
(function() {
  'use strict';

  var bustParamRegex = /\?bust\=\d*/;
  var extensionBit = /chrome-extension:\/\/[^/]*/;
  var localFileBit = /file:\/\/\/.*\/html-office\/crx\/app/;

  // Make sure we do not clutter the stack traces with frames
  // from Jasmine. We format the stack string the same as the
  // default chrome.
  Error.prepareStackTrace = function(error, structuredStackTrace) {
    var errorStr = error.name + ': ' + error.message + '\n';

    structuredStackTrace.forEach(function(stackFrame) {
      if (stackFrame.getFileName() &&
          stackFrame.getFileName().search('jasmine') === -1) {
        errorStr += '\tat ' + (stackFrame.getFunctionName() || '<anonymous>');

        // make the filename less verbose
        var fileName = stackFrame.getFileName();
        fileName = fileName.replace(bustParamRegex, '');
        fileName = fileName.replace(extensionBit, '');
        fileName = fileName.replace(localFileBit, '');

        var location = [
          fileName,
          stackFrame.getLineNumber(),
          stackFrame.getColumnNumber()
        ];
        errorStr += ' (' + location.join(':') + ')\n';
      }
    });
    return errorStr;
  };
  // Don't truncate stack traces.
  Error.stackTraceLimit = Infinity;
})();
