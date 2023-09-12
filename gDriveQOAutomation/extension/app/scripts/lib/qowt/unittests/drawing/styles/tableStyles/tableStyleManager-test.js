// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test fot point TableStyleManager
 *
 * @see src/drawing/Styles/TableStyles/TableStyleManager.js
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/models/point',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager'
], function(PointModel, TableStyleManager) {

  'use strict';


  describe('TableStyle Manager test', function() {

    var tableProperties = {
      bandRow: true,
      firstRow: true,
      tableStyleId: '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}'
    };

    it('should apply proper table style classes to cell', function() {

      var htmlElement = {
        className: ''
      };

      PointModel.MasterSlideId = '786';
      PointModel.currentPHLevel = 'sldmt';

      TableStyleManager.computeClassPrefix(tableProperties.tableStyleId);
      TableStyleManager.updateTableProperties(tableProperties, 3, 3);

      PointModel.currentTable.currentRow = 0;
      PointModel.currentTable.currentCol = 0;

      TableStyleManager.findTblPartStyleToApply();

      TableStyleManager.applyTblCellStyleClasses(htmlElement,
          TableStyleManager.styleType.cellFillStyle);

      expect(htmlElement.className).toEqual(
          ' tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_firstRow' +
              '_fillStyle tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A' +
              '_band2H_fillStyle ' +
              'tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_wholeTbl' +
              '_fillStyle');

      PointModel.MasterSlideId = undefined;
    });

    it('should apply proper table style classes to cell when it has rowSpan',
        function() {

          var htmlElement = {
            className: ''
          };

          PointModel.MasterSlideId = '786';
          PointModel.currentPHLevel = 'sldmt';

          TableStyleManager.computeClassPrefix(tableProperties.tableStyleId);
          TableStyleManager.updateTableProperties(tableProperties, 3, 3);

          PointModel.currentTable.currentRow = 0;
          PointModel.currentTable.currentCol = 0;

          TableStyleManager.findTblPartStyleToApply();

          TableStyleManager.applyTblCellStyleClasses(htmlElement,
              TableStyleManager.styleType.cellOutlineStyle, 2);

          expect(htmlElement.className).toEqual(
              ' tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_firstRow_' +
                  'left_lnStyle ' +
                  'tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_firstRow_' +
                  'left_lnStyle ' +
                  'tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_band2H_' +
                  'left_lnStyle ' +
                  'tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_band2H_' +
                  'left_lnStyle ' +
                  'tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_wholeTbl_' +
                  'top_left_lnStyle ' +
                  'tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_wholeTbl_' +
                  'left_lnStyle');

          PointModel.MasterSlideId = undefined;
        });

    it('should apply proper table style classes to cell when it has colSpan',
        function() {

          var htmlElement = {
            className: ''
          };

          PointModel.MasterSlideId = '786';
          PointModel.currentPHLevel = 'sldmt';

          TableStyleManager.updateTableProperties(tableProperties, 3, 3);

          PointModel.currentTable.currentRow = 0;
          PointModel.currentTable.currentCol = 0;

          TableStyleManager.findTblPartStyleToApply();

          TableStyleManager.applyTblCellStyleClasses(htmlElement,
              TableStyleManager.styleType.cellOutlineStyle, 2, 2);

          expect(htmlElement.className).toEqual(
              ' tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_firstRow_' +
              'left_lnStyle tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A' +
              '_firstRow_left_lnStyle ' +
              'tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_firstRow_' +
              'center_lnStyle' +
              ' tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_band2H_' +
              'left_lnStyle tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A' +
              '_band2H_left_lnStyle' +
              ' tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_band2H_' +
              'center_lnStyle ' +
              'tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_wholeTbl_' +
              'top_left_lnStyle' +
              ' tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_wholeTbl_' +
              'left_lnStyle tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A' +
              '_wholeTbl_top_center_lnStyle');

          PointModel.MasterSlideId = undefined;
        });

    it('should apply proper table background style classes to table',
        function() {

          PointModel.currentTable.currentRow = 0;
          PointModel.currentTable.currentCol = 0;

          var htmlElement = {
            className: ''
          };

          PointModel.MasterSlideId = '786';

          TableStyleManager.computeClassPrefix(tableProperties.tableStyleId);
          TableStyleManager.updateTableProperties(tableProperties, 3, 3);

          TableStyleManager.applyTblBgStyleClasses(htmlElement,
              TableStyleManager.styleType.tblBgFillStyle);

          expect(htmlElement.className).toEqual(
              ' tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_tblBg');

          PointModel.MasterSlideId = undefined;
        });

    it('should not apply table background style classes to table if ' +
        'tableStyleClassPrefix is undefined', function() {

          PointModel.currentTable.currentRow = 0;
          PointModel.currentTable.currentCol = 0;

          var htmlElement = {
            className: ''
          };

          PointModel.MasterSlideId = '786';

          TableStyleManager.resetTableProperties();
          TableStyleManager.updateTableProperties(tableProperties, 3, 3);

          TableStyleManager.applyTblBgStyleClasses(htmlElement,
              TableStyleManager.styleType.tblBgFillStyle);

          expect(htmlElement.className).toEqual('');

          PointModel.MasterSlideId = undefined;
        });

    it('should set proper classPrefix when called -computeClassPrefix- and ' +
        'current PhTyp is slide master', function() {
          PointModel.MasterSlideId = '786';
          PointModel.currentPHLevel = 'sldmt';

          TableStyleManager.computeClassPrefix(tableProperties.tableStyleId);
          var classPrefix = TableStyleManager.getClassPrefix();
          expect(classPrefix).toEqual(
              'tblStyl_786_5C22544A-7EE6-4342-B048-85BDC9FD1C3A');

          PointModel.slideColorMap = {};
        });

    it('should set proper classPrefix when called -computeClassPrefix- and ' +
        'color map is defined at slide layout level', function() {
          PointModel.MasterSlideId = '786';
          PointModel.SlideLayoutId = '186';

          PointModel.currentPHLevel = 'sldlt';
          PointModel.slideLayoutMap['186'] = {};
          PointModel.slideLayoutMap['186'].clrMap = 'clrMap';
          TableStyleManager.computeClassPrefix(tableProperties.tableStyleId);
          var classPrefix = TableStyleManager.getClassPrefix();
          expect(classPrefix).toEqual(
              'tblStyl_786_186_5C22544A-7EE6-4342-B048-85BDC9FD1C3A');

          PointModel.slideColorMap = {};
        });

    it('should set proper classPrefix when called -computeClassPrefix- and ' +
        'color map is defined at slide level', function() {
          PointModel.MasterSlideId = '786';
          PointModel.SlideLayoutId = '186';
          PointModel.SlideId = '286';

          PointModel.currentPHLevel = 'sld';
          PointModel.slideColorMap['286'] = 'clrMap';

          TableStyleManager.computeClassPrefix(tableProperties.tableStyleId);
          var classPrefix = TableStyleManager.getClassPrefix();
          expect(classPrefix).toEqual(
              'tblStyl_786_186_286_5C22544A-7EE6-4342-B048-85BDC9FD1C3A');

          PointModel.slideColorMap = {};
        });

    it('should return cached table style', function() {
      var someTableStyle = {
        styleId: '123',
        tblBg: 'some table back ground',
        wholeTbl: 'some whole table properties'
      };

      TableStyleManager.cacheTableStyles(someTableStyle);

      var returnedTableStyle = TableStyleManager.getCachedTableStyles('123');

      expect(someTableStyle).toEqual(returnedTableStyle);
    });

    it('should return cached table style, when multiple table styles',
       function() {
         var someTableStyle1 = {
           styleId: '123',
           tblBg: 'some table back ground',
           wholeTbl: 'some whole table properties'
         };
         TableStyleManager.cacheTableStyles(someTableStyle1);

         var someTableStyle2 = {
           styleId: '456',
           tblBg: 'some other table back ground',
           wholeTbl: 'some other whole table properties'
         };
         TableStyleManager.cacheTableStyles(someTableStyle2);

         var returnedTableStyle = TableStyleManager.getCachedTableStyles('123');

         expect(someTableStyle1).toEqual(returnedTableStyle);
       });

    it('should reset all table properties when resetTableProperties is called',
       function() {
         TableStyleManager.resetTableProperties();

         expect(PointModel.currentTable.tableProps.firstRow).toEqual(false);
         expect(PointModel.currentTable.tableProps.firstCol).toEqual(false);
         expect(PointModel.currentTable.tableProps.lastRow).toEqual(false);
         expect(PointModel.currentTable.tableProps.lastCol).toEqual(false);
         expect(PointModel.currentTable.tableProps.bandRow).toEqual(false);
         expect(PointModel.currentTable.tableProps.bandCol).toEqual(false);

         expect(PointModel.currentTable.noOfRows).toEqual(undefined);
         expect(PointModel.currentTable.noOfCols).toEqual(undefined);

         expect(PointModel.currentTable.currentRow).toEqual(undefined);
         expect(PointModel.currentTable.currentCol).toEqual(undefined);

         expect(PointModel.currentTable.isTableStyleDefined).toEqual(true);
       });
  });
});
