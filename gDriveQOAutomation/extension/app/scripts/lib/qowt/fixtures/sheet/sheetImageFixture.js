/*
 * Sheet Image Fixture
 */
define(['qowtRoot/fixtures/fixtureBase'], function(FIXTURES) {

  'use strict';

  var x = arguments.length;


  return {

    'id': 'sheetImage',

    'twoCellAnchorResponse': function() {
      var response = {
        imageId: "221",
        anchor: {
          type: "two",
          frm: {
            ri: 2,
            ci: 7,
            xo: 150382,
            yo: 10682
          },
          to: {
            ri: 28,
            ci: 4,
            xo: 914400,
            yo: 90177
          }
        }
      };
      return response;
    },
    'oneCellAnchorResponse': function() {
      var response = {
        imageId: "222",
        anchor: {
          type: "one",
          frm: {
            ri: 5,
            ci: 2,
            xo: 491265,
            yo: 0
          },
          ext: {
            cx: 6396025,
            cy: 3508495
          }
        }
      }
      return response;
    },
    'absCellAnchorResponse': function() {
      var response = {
        imageId: "223",
        anchor: {
          type: "abs",
          pos: {
            x: 2311400,
            y: 1729740
          },
          ext: {
            cx: 4064000,
            cy: 2702560
          }
        }
      }
      return response;
    }
  };

});
