define([
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/drawing/theme/themeManager',
  'qowtRoot/models/point'
], function(ColorUtility,
            ThemeManager,
            PointModel) {

  'use strict';

  describe('Color Utility Test', function() {
    var sandbox_;

    var themeColorData = {
      'dk1': 'white'
    };

    var dummyMasterSchemeData = [{
      name: 'dk1',
      value: 'red'
    }];

    var dummyLayoutSchemeData = [{
      name: 'dk1',
      value: 'blue'
    }];

    var dummySlideSchemeData = [{
      name: 'dk1',
      value: 'black'
    }];

    beforeEach(function() {
      sandbox_ = sinon.sandbox.create();
      PointModel.SlideId = '111';

      PointModel.slideColorMap[PointModel.SlideId] = dummySlideSchemeData;
      PointModel.slideLayoutMap[PointModel.SlideLayoutId] = {
        clrMap: dummyLayoutSchemeData};
      PointModel.masterLayoutMap[PointModel.MasterSlideId] = {
        clrMap: dummyMasterSchemeData};
    });

    afterEach(function() {
      PointModel.ThemeId = undefined;
      PointModel.slideColorMap = {};
      PointModel.SlideLayoutId = undefined;
      PointModel.slideLayoutMap = {};
      PointModel.masterLayoutMap = {};
      PointModel.masterLayoutId = undefined;
      sandbox_.restore();
      sandbox_ = undefined;
    });

    it('should get getThemeEquivalentOfSchemeColor with the optional level' +
        ' while fetching the hex equivalent of scheme color', function() {
          sandbox_.stub(ThemeManager, 'getColorTheme').returns(themeColorData);
          sandbox_.stub(ColorUtility, 'getThemeEquivalentOfSchemeColor');

          ColorUtility.getHexEquivalentOfSchemeColor('dk1', 'master');
          assert.isTrue(ColorUtility.getThemeEquivalentOfSchemeColor.calledOnce,
              'getThemeEquivalentOfSchemeColor called');
          assert.isTrue(ColorUtility.getThemeEquivalentOfSchemeColor.
              calledWith('dk1', 'master'),
              'getThemeEquivalentOfSchemeColor called with correct parameters');
        });

    it('should return scheme color value from master map when level is' +
        ' specified as "master"', function() {
         var resolvedSchemeColor = ColorUtility.getThemeEquivalentOfSchemeColor(
             'dk1', 'master');
         assert.strictEqual(resolvedSchemeColor, 'red');
        });

    it('should return scheme color value from layout map when level is' +
        ' specified as "layout"', function() {
          var resolvedSchemeColor = ColorUtility.
              getThemeEquivalentOfSchemeColor('dk1', 'layout');
          assert.strictEqual(resolvedSchemeColor, 'blue');
        });

    it('should return scheme color value from slide map when level is' +
        ' undefined', function() {
          var resolvedSchemeColor = ColorUtility.
              getThemeEquivalentOfSchemeColor('dk1');
          assert.strictEqual(resolvedSchemeColor, 'black');
        });
  });
});
