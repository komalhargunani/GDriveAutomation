/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Wrapper module for all fixtures
 */
define([
  'qowtRoot/fixtures/fixtureBase',
  'qowtRoot/fixtures/responseFixture',
  'qowtRoot/fixtures/archive/_all',
  'qowtRoot/fixtures/chart/_all',
  'qowtRoot/fixtures/commands/_all',
  'qowtRoot/fixtures/sheet/_all',
  'qowtRoot/fixtures/bulletedListFixture',
  'qowtRoot/fixtures/docFixture',
  'qowtRoot/fixtures/dodgyElementFixture',
  'qowtRoot/fixtures/sectionFixture',
  'qowtRoot/fixtures/footerFixture',
  'qowtRoot/fixtures/footerItemFixture',
  'qowtRoot/fixtures/headerFixture',
  'qowtRoot/fixtures/headerItemFixture',
  'qowtRoot/fixtures/paragraphFixture',
  'qowtRoot/fixtures/nestedCharRunFixture',
  'qowtRoot/fixtures/fieldFixture',
  'qowtRoot/fixtures/hyperlinkFixture',
  'qowtRoot/fixtures/imageFixture',
  'qowtRoot/fixtures/lineSeparatorFixture',
  'qowtRoot/fixtures/metafileFixture',
  'qowtRoot/fixtures/numberedListFixture',
  'qowtRoot/fixtures/tableFixture',
  'qowtRoot/fixtures/unknownObjectFixture',
  'qowtRoot/fixtures/drawingFixture'
], function() {
  'use strict';

  var x = arguments.length;


/*
  TODO: This code pulls in all the fixture objects, variables and functions
  to a single object below, this should be changed so that the unit tests only
  require the actual fixtures they use rather than a single object with all the
  fixtures and data
*/
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
