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
 * Preset map tests
 * @author rahul.tarafdar@synerzip.com (Rahul Tarafdar)
 * Date: Mar 28, 2011
 */

define([
  'qowtRoot/drawing/geometry/presetMap',
  'qowtRoot/drawing/geometry/presets/rect'
], function(PresetMap, Rect) {

  'use strict';

  describe('Preset Map test ', function() {

    var presetMap = PresetMap;

    it('should get undefined if preset shape id passed is out of range ' +
        '( 0 to 186)', function() {
          var shapeData = presetMap.getPresetData(-1);
          expect(shapeData).toEqual(undefined);

          shapeData = presetMap.getPresetData(187);
          expect(shapeData).toEqual(undefined);
        });

    it('should get undefined if preset shape id passed is undefined',
        function() {
          var shapeData = presetMap.getPresetData(undefined);
          expect(shapeData).toEqual(undefined);
        });

    it('should get undefined if preset shape id passed is not a number',
        function() {
          var shapeData = presetMap.getPresetData('someNonNumberValue');
          expect(shapeData).toEqual(undefined);
        });

    it('should get the same shape data n number of times for a given valid ' +
        'preset shape id', function() {
          var shapeData1 = presetMap.getPresetData('0');
          var shapeData2 = presetMap.getPresetData('0');
          expect(shapeData1).toEqual(shapeData2);
        });

    it('should get data for rect preset shape if preset data 88 is passed',
        function() {
          var rectPresetShapeData = Rect;
          var shapeData = presetMap.getPresetData('88');
          expect(shapeData).toEqual(rectPresetShapeData);
        });
  });
});
