/**
 * @fileoverview test cases for config files
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/configs/word',
  'qowtRoot/configs/sheet',
  'qowtRoot/configs/point'
], function(WordConfig, SheetConfig, PointConfig) {

  'use strict';

  describe('Configs', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('should each have an independent instance of the Common Config so as ' +
        'not to override each others definitions', function() {
          expect(WordConfig.MAIN_TOOLBAR).not.toEqual(SheetConfig.MAIN_TOOLBAR);
          expect(PointConfig.MAIN_TOOLBAR).not.toEqual(WordConfig.MAIN_TOOLBAR);
          expect(PointConfig.MAIN_TOOLBAR).not.toEqual(
              SheetConfig.MAIN_TOOLBAR);
        });
  });
});

