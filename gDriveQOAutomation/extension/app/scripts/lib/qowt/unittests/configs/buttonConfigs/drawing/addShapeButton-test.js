// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview UT module for add shape button.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/configs/buttonConfigs/drawing/addShapeButton'
], function(AddShapeButton) {

  'use strict';

  describe('configs/buttonConfigs/drawing/insertTextBoxButton', function() {
    describe('Basic configuration.', function() {
      it('should have config items.', function() {
        expect(AddShapeButton.items).toBeDefined();
      });
      it('should define a text label.', function() {
        expect(AddShapeButton.label).toBeDefined();
      });
      it('should define the correct action.', function() {
        expect(AddShapeButton.action).toBe('initAddShape');
      });
      it('should be opt_scrollable.', function() {
        expect(AddShapeButton.opt_scrollable).toBe(true);
      });
    });
  });
});
