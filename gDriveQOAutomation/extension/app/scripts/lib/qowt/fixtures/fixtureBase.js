/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([], function() {

  'use strict';

  var x = arguments.length;


  var FIXTURES = {};
  FIXTURES.id = 'fixtureBase';
  FIXTURES.idCounter = 1;
  FIXTURES.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit,' +
    'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi' +
    'ut aliquip ex ea commodo consequat. Duis aute irure dolor in' +
    'reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla' +
    'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa' +
    'qui officia deserunt mollit anim id est laborum.';
  FIXTURES.ipsum = FIXTURES.lorem.split(' ');

  /*Grid defaults*/
  FIXTURES.GRID_defaultRowHeight = 26;
  FIXTURES.GRID_defaultColumnWidth = 75;
  FIXTURES.GRID_defaultFont = "Verdana";
  FIXTURES.GRID_defaultFontSize = 18;
  FIXTURES.GRID_numberOfCols = 128;
  FIXTURES.GRID_numberOfRows = 400;

  /**
   * Adds a child element to the current elements 'elm' array
   * It then returns the element itself, such that calls to this method can be
   * daisy chained.
   *
   * Fixtures need to add a method to themselves and set this function
   * This makes fixtures slightly bigger than a real DCP packet, but it should
   * still be good enough for testing.
   */
  FIXTURES.addChild = function(obj) {
    if(this.elm) {
      this.elm.push(obj);
    }
    return this;
  };

  FIXTURES.setStyles = function(styles) {
    if(styles) {
      for(var st in styles) {
        this[st] = styles[st];
      }
    }
    return this;
  };

  FIXTURES.setFormatstyle = function(fmtstyle) {
    if(fmtstyle) {
      for(var st in fmtstyle) {
        this[st] = fmtstyle[st];
      }
    }
    return this;
  };

  FIXTURES.setPhidx = function(phidx) {
    if(phidx) {
      for(var st in phidx) {
        this[st] = phidx[st];
      }
    }
    return this;
  };

  return FIXTURES;

});
