/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

// wrapper module which requires all the unit test modules
define([
  'qowtRoot/fixtures/sheet/getSheetContentResponseFixture',
  'qowtRoot/fixtures/sheet/getSheetInformationResponseFixture',
  'qowtRoot/fixtures/sheet/getWorkbookInformationResponseFixture',
  'qowtRoot/fixtures/sheet/openWorkBookResponseFixture',
  'qowtRoot/fixtures/sheet/sheetCellElementFixture',
  'qowtRoot/fixtures/sheet/sheetChartElementFixture',
  'qowtRoot/fixtures/sheet/sheetFormattingFixture',
  'qowtRoot/fixtures/sheet/sheetRowElementFixture',
  'qowtRoot/fixtures/sheet/updateColumnElementFixture',
  'qowtRoot/fixtures/sheet/updateRowElementFixture'
], function() {
  'use strict';

  var x = arguments.length;


  var _fixtures = {};
  for(var i=0; i<x; i++) {
    var f = arguments[i];
    var fi;
    var hasProp = Object.prototype.hasOwnProperty;
    for(fi in f) {
      if((fi != 'id') && hasProp.call(f, fi)) {
        _fixtures[fi] = f[fi];
      }
    }
  }
  return _fixtures;

});
