
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview phantomjs bootstrap to load our unit test page
 * and listen out for log messages tagged with 'PHANTON: '.
 *
 * See the src/unittests/controller.js which sends those messages
 * to allow us to run our unit tests both from the commandline AND
 * from the browser
 *
 * NOTE: this is all very crude, but it works for now...
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

'use strict';

var system = require('system');

if (system.args.length === 1) {
    console.log('usage phantomjs phantomTest.js myTestPage.html');
    phantom.exit(1);
}

var url = system.args[1];
var verbose = system.args[2] === "verbose";

var page = require('webpage').create();

page.onError = function (msg, trace) {
  console.log(msg);
  trace.forEach(function(item) {
      console.log('  ', item.file, ':', item.line);
  });
  phantom.exit(1);
};

page.onConsoleMessage = function (msg) {
  if (verbose) {
    console.log(msg);
  }
  if (msg.indexOf('PHANTOM:') !== -1) {
    msg = msg.replace('PHANTOM:', '');
    console.log(msg);

    if (msg.indexOf("Tester done - passed") !== -1) {
      phantom.exit(0);
    }
    if (msg.indexOf("Tester done - failed") !== -1) {
      phantom.exit(1);
    }
  }
};

page.open(url);
