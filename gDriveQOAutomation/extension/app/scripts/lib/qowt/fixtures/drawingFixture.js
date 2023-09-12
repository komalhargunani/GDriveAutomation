/**
 * @fileOverview Unit test fixture for Drawing
 * @author <a href="mailto:alok.guha@quickoffice.com">Alok Guha</a>
 */

define([
    'qowtRoot/fixtures/fixtureBase',
    'qowtRoot/fixtures/imageFixture'], function(FIXTURES, imageFixture) {

  'use strict';

  var x = arguments.length;


  return {

    'id': 'drawing',
    'drawingElement': function () {

      FIXTURES.idCounter++;
      var el = {
        addChild: FIXTURES.addChild,
        etp: 'drw',
        eid: FIXTURES.idCounter,
        elm:  [ imageFixture.imageElement(225,150,100,100) ],
        wst:'itx'
      };
      return el;
    }
  };
});

