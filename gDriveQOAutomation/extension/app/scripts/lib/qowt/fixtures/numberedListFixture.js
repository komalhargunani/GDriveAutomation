/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([
      'qowtRoot/fixtures/fixtureBase'
    ], function(
      FIXTURES) {

  'use strict';

  var x = arguments.length;


  return {

    'id': 'numberedList',

    /**
     * simple numbered list without any styling
     *
     * See qowt/comms/schema/numberedList-schema.js
     *
     */
    'listElement': function(styles, ovrid, fmtstyle, phidx) {
      var nllid = ovrid ? ovrid : ++FIXTURES.idCounter;
      var _el = {
        etp: 'nls',
        eid: nllid,
        addChild: FIXTURES.addChild,
        setStyles: FIXTURES.setStyles,
        setFormatstyle: FIXTURES.setFormatstyle,
        setPhidx: FIXTURES.setPhidx,
        elm: []
      };
      _el.setStyles(styles);
      _el.setFormatstyle(fmtstyle);
      _el.setPhidx(phidx);
      var _setListStyleType = function(listStyleType) {
        _el.lst = listStyleType; };
      var _setNumberBase = function(numberBase) { _el.num = numberBase; };
      _el.setListStyleType = _setListStyleType;
      _el.setNumberBase = _setNumberBase;
      return _el;
    }

  };

});
