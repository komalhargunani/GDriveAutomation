// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview UT module for shape item widget.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/point/shapeItem'
], function(
    PubSub,
    ShapeItem) {

  'use strict';

  describe('shapeItem Widget Factory', function() {

    var _kDummyDiv, dummyDiv, shapeItemWidget, shapeItemElement, config;
    var evt = document.createEvent('Event');
    evt.initEvent('click', true, false);

    beforeEach(function() {
      _kDummyDiv = {
        node: 'div'
      };
      config = {
        'value': 88,
        'action': 'initAddShape'
      };
      dummyDiv = document.createElement(_kDummyDiv.node);
      shapeItemWidget = ShapeItem.create(config);
      shapeItemWidget.appendTo(dummyDiv);
    });

    afterEach(function() {
      shapeItemWidget = undefined;
      config = undefined;
      dummyDiv = undefined;
      shapeItemElement = undefined;
    });

    describe('API', function() {

      it('should support widget factory creation', function() {
        expect(shapeItemWidget).not.toBe(undefined);
      });

      it('should create proper roles and attach classes ' +
          'to shapeItem created', function() {
            shapeItemElement = shapeItemWidget.getNode();
            expect(shapeItemElement.classList.contains(
                   'qowt-shape-item')).toBe(true);
            expect(shapeItemElement.getAttribute('role')).toBe('gridcell');
          });

      it('should publish request action on click of the shapeItem node',
          function() {
            var requestActionContext = {
              'action': 'initAddShape',
              'context': {
                'set': true,
                'prstId': 88
              }
            };
            spyOn(PubSub, 'publish').andCallThrough();
            shapeItemElement = shapeItemWidget.getNode();
            shapeItemElement.dispatchEvent(evt);
            expect(PubSub.publish.mostRecentCall.args[1]).
                toEqual(requestActionContext);
          });

      it('should throw error when appendTo called with undefined node',
          function() {
           var node;
           expect(function() {
              shapeItemWidget.appendTo(node);
           }).toThrow('ShapeItem.appendTo() - missing node parameter!');
          });

      it('should throw error when removeFrom called with undefined node',
          function() {
           var node;
           expect(function() {
              shapeItemWidget.removeFrom(node);
           }).toThrow('ShapeItem.removeFrom() - missing node parameter!');
          });
    });
  });
  return {};
});


