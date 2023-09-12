/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit tests for the shapeHelper module.
 *
 * @author wasim.pathan@synerzip.com (Wasim Pathan)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/helpers/helper',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/widgets/factory'
], function(
    PubSub,
    Helper,
    TypeUtils,
    WidgetFactory) {

  'use strict';

  describe('Shape helper tests', function() {

    var helper = new Helper();
    helper.activate('shape');
    var element = document.activeElement;
    element.setAttribute('qowt-divType', 'shape');

    it('should take a snapshot of the existing shape selection', function() {
      element.id = 'E15';
      var expectedSnapshot = {
        eid: 'E15'
      };

      expect(JSON.stringify(helper.snapshot())).toBe(
          JSON.stringify(expectedSnapshot));
    });

    it('should restore the snapshot if the current snapshot does not match ' +
        'our stored snapshot', function() {
          element.id = 'E16';
          var snapshot = {
            eid: 'E15'
          };
          var dummyShapeWidget = {
            select: function() {}
          };
          spyOn(WidgetFactory, 'create').andReturn(dummyShapeWidget);
          spyOn(TypeUtils, 'isFunction').andCallThrough();
          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(dummyShapeWidget, 'select');

          helper.restoreSnapshot(snapshot);

          expect(WidgetFactory.create).toHaveBeenCalledWith(
              {fromId: snapshot.eid});
          expect(TypeUtils.isFunction).toHaveBeenCalledWith(
              dummyShapeWidget.select);
          expect(PubSub.publish).toHaveBeenCalledWith(
              'qowt:clearSlideSelection');
          expect(dummyShapeWidget.select).toHaveBeenCalled();
        });

    it('should not restore the snapshot if the current snapshot and ' +
        'our stored snapshot are equal', function() {
          var snapshot = {
            eid: 'E16'
          };
          var dummyShapeWidget = {
            select: function() {}
          };
          spyOn(WidgetFactory, 'create').andReturn(dummyShapeWidget);
          spyOn(TypeUtils, 'isFunction').andCallThrough();
          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(dummyShapeWidget, 'select');

          // In our previous test, we had restored the snapshot with eid 'E16',
          // so we are using the same eid to make current and stored snapshots
          // equal.
          helper.restoreSnapshot(snapshot);

          expect(WidgetFactory.create).not.toHaveBeenCalled();
          expect(TypeUtils.isFunction).not.toHaveBeenCalledWith();
          expect(PubSub.publish).not.toHaveBeenCalledWith();
          expect(dummyShapeWidget.select).not.toHaveBeenCalled();
        });
  });
});
