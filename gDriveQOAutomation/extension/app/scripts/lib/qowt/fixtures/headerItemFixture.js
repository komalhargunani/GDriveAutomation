/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([
  'qowtRoot/fixtures/fixtureBase',
  'qowtRoot/fixtures/imageFixture'
  ], function(
    FIXTURES,
    IMAGEFIXTURES) {

  'use strict';

  var x = arguments.length;


  return {

    'id': 'headerItem',

    /**
     * Return some sample DCP for a Header Item Element
     * @param type {String} Enum(b|o|e|f) Both, Odd, Even, First
     * @return {Object} DCP
     */
    'headerItemElement': function(type) {
      var headtp = type ? type : 'b';
      var el = {
        'etp':'hdi',
        'tp':headtp,
        'addChild': FIXTURES.addChild,
        'setStyles': FIXTURES.setStyles,
        'elm': IMAGEFIXTURES.imageElement(100,100,undefined,undefined)
      };
      return el;
    }

  };

});
