// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for point tableCellBorderDefinitions
 *
 * @see src/drawing/styles/tableStyles/tableCellBorderDefinitions.js
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/models/point',
  'qowtRoot/drawing/styles/tableStyles/tableCellBorderDefinitions'
], function(PointModel, TableCellBorderDefinitions) {

  'use strict';

  describe('TableCellBorderDefinitions test', function() {

    describe('cellBdrDefinitionPerPosition', function() {

      describe('For -WholeTbl- part type ', function() {

        it('should return 9 cell position defintions for -WholeTbl- part type',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.wholeTbl;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(9);
            });

        it('for -top_left- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:insideV, bottom:insideH]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.wholeTbl;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.top_left;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });

        it('for -top_right- cell position, cell border should be defined ' +
            'like this - [top: top, left : insideV, right:right, ' +
            'bottom:insideH]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.wholeTbl;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.top_right;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });


        it('for -top_center- cell position, cell border should be defined ' +
            'like this - [top: top, left : insideV, right:insideV, ' +
            'bottom:insideH]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.wholeTbl;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.top_center;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });

        it('for -left- cell position, cell border should be defined like ' +
            'this - [top: insideH, left : left, right:insideV, ' +
            'bottom:insideH]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.wholeTbl;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.left;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });

        it('for -right- cell position, cell border should be defined like ' +
            'this - [top: insideH, left : insideV, right:right, ' +
            'bottom:insideH]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.wholeTbl;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.right;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });

        it('for -center- cell position, cell border should be defined like ' +
            'this - [top: insideH, left : insideV, right:insideV, ' +
            'bottom:insideH]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.wholeTbl;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.center;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });

        it('for -bottom_left- cell position, cell border should be defined ' +
            'like this - [top: insideH, left : left, right:insideV, ' +
            'bottom:bottom]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.wholeTbl;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.bottom_left;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -bottom_right- cell position, cell border should be defined ' +
            'like this - [top: insideH, left : insideV, right:right, ' +
            'bottom:bottom]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.wholeTbl;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.bottom_right;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -bottom_center- cell position, cell border should be defined ' +
            'like this - [top: insideH, left : insideV, right:insideV, ' +
            'bottom:bottom]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.wholeTbl;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.bottom_center;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

      });

      describe('For -band1H- part type ', function() {

        it('should return 3 cell position defintions for -band1H- part type',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band1H;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(3);
            });

        it('for -left- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:insideV, ' +
            'bottom:bottom]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band1H;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.left;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -right- cell position, cell border should be defined like ' +
            'this - [top: top, left : insideV, right:right, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band1H;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.right;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -center- cell position, cell border should be defined like ' +
            'this - [top: top, left : insideV, right:insideV, ' +
            'bottom:bottom]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band1H;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.center;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

      });

      describe('For -band2H- part type ', function() {

        it('should return 3 cell position defintions for -band2H- part type',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band2H;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(3);
            });

        it('for -left- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:insideV, ' +
            'bottom:bottom]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band2H;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.left;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -right- cell position, cell border should be defined like ' +
            'this - [top: top, left : insideV, right:right, ' +
            'bottom:bottom]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band2H;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.right;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -center- cell position, cell border should be defined like ' +
            'this - [top: top, left : insideV, right:insideV, ' +
            'bottom:bottom]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band2H;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.center;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

      });

      describe('For -firstRow- part type ', function() {

        it('should return 3 cell position defintions for -frstRow- part type',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.firstRow;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(3);
            });

        it('for -left- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:insideV, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.firstRow;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.left;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -right- cell position, cell border should be defined like ' +
            'this - [top: top, left : insideV, right:right, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.firstRow;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.right;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -center- cell position, cell border should be defined like ' +
            'this - [top: top, left : insideV, right:insideV, ' +
            'bottom:bottom]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.firstRow;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.center;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

      });

      describe('For -lastRow- part type ', function() {

        it('should return 3 cell position defintions for -lastRow- part type',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.lastRow;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(3);
            });

        it('for -left- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:insideV, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.lastRow;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.left;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -right- cell position, cell border should be defined like ' +
            'this - [top: top, left : insideV, right:right, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.lastRow;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.right;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -center- cell position, cell border should be defined like ' +
            'this - [top: top, left : insideV, right:insideV, ' +
            'bottom:bottom]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.lastRow;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.center;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('insideV');
              expect(bdrDefinition.right).toEqual('insideV');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

      });

      describe('For -band1V- part type ', function() {

        it('should return 3 cell position defintions for -band1V- part type',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band1V;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(3);
            });

        it('for -top- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:right, bottom:insideH]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band1V;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.top;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });

        it('for -bottom- cell position, cell border should be defined like ' +
            'this - [top: insideH, left : left, right:right, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band1V;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.bottom;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -center- cell position, cell border should be defined like ' +
            'this - [top: insideH, left : left, right:right, ' +
            'bottom:insideH]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band1V;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.center;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });
      });

      describe('For -band2V- part type ', function() {

        it('should return 3 cell position defintions for -band2V- part type',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band2V;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(3);
            });

        it('for -top- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:right, bottom:insideH]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band2V;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.top;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });

        it('for -bottom- cell position, cell border should be defined like ' +
            'this - [top: insideH, left : left, right:right, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band2V;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.bottom;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -center- cell position, cell border should be defined like ' +
            'this - [top: insideH, left : left, right:right, ' +
            'bottom:insideH]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.band2V;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.center;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });
      });

      describe('For -firstCol- part type ', function() {

        it('should return 3 cell position defintions for -firstCol- part type',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.firstCol;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(3);
            });

        it('for -top- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:right, bottom:insideH]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.firstCol;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.top;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });

        it('for -bottom- cell position, cell border should be defined like ' +
            'this - [top: insideH, left : left, right:right, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.firstCol;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.bottom;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -center- cell position, cell border should be defined like ' +
            'this - [top: insideH, left : left, right:right, ' +
            'bottom:insideH]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.firstCol;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.center;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });
      });

      describe('For -lastCol- part type ', function() {

        it('should return 3 cell position defintions for -lastCol- part type',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.lastCol;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(3);
            });

        it('for -top- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:right, bottom:insideH]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.lastCol;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.top;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });

        it('for -bottom- cell position, cell border should be defined like ' +
            'this - [top: insideH, left : left, right:right, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.lastCol;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.bottom;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });

        it('for -center- cell position, cell border should be defined like ' +
            'this - [top: insideH, left : left, right:right, ' +
            'bottom:insideH]  )', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.lastCol;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.center;
              expect(bdrDefinition.top).toEqual('insideH');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('insideH');
            });

      });

      describe('For -seCell- part type ', function() {

        it('should return single cell position defintions for -seCell- part ' +
            'type', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.seCell;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(1);
            });

        it('for -corner- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:right, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.seCell;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.corner;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });
      });

      describe('For -swCell- part type ', function() {

        it('should return single cell position defintions for -swCell- ' +
            'part type', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.swCell;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(1);
            });

        it('for -corner- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:right, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.swCell;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.corner;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });
      });

      describe('For -neCell- part type ', function() {

        it('should return single cell position defintions for -neCell- ' +
            'part type', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.neCell;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(1);
            });

        it('for -corner- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:right, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.neCell;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.corner;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });
      });

      describe('For -nwCell- part type ', function() {

        it('should return single cell position defintions for -nwCell- part ' +
            'type', function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.nwCell;

              var count = Object.keys(cellBdrDefinitionsAsPerPosition).length;
              expect(count).toEqual(1);
            });

        it('for -corner- cell position, cell border should be defined like ' +
            'this - [top: top, left : left, right:right, bottom:bottom]  )',
            function() {
              var cellBdrDefinitionsAsPerPosition = TableCellBorderDefinitions.
                  cellBdrDefinitionPerPosition.nwCell;
              var bdrDefinition = cellBdrDefinitionsAsPerPosition.corner;
              expect(bdrDefinition.top).toEqual('top');
              expect(bdrDefinition.left).toEqual('left');
              expect(bdrDefinition.right).toEqual('right');
              expect(bdrDefinition.bottom).toEqual('bottom');
            });
      });
    });


    describe('partTypeToCellPositionMap', function() {

      beforeEach(function() {
        PointModel.currentTable.noOfRows = 3;
        PointModel.currentTable.noOfCols = 3;
      });

      describe('For -WholeTbl- part type ', function() {

        it('should return cellPosition as -top-left-  if currentRow = 0 and ' +
            'currnetCol = 0', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.wholeTbl.computeCellPosition(0, 0);
              expect(cellPosition).toEqual('top_left');
            });

        it('should return cellPosition as -top-right-  if currentRow = 0 and ' +
            'currnetCol = 2', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.wholeTbl.computeCellPosition(0, 2);
              expect(cellPosition).toEqual('top_right');
            });


        it('should return cellPosition as -top-center-  if currentRow = 0 ' +
            'and currnetCol = 1', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.wholeTbl.computeCellPosition(0, 1);
              expect(cellPosition).toEqual('top_center');
            });

        it('should return cellPosition as -left-  if currentRow = 1 ' +
            'and currnetCol = 0', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.wholeTbl.computeCellPosition(1, 0);
              expect(cellPosition).toEqual('left');
            });

        it('should return cellPosition as -right-  if currentRow = 1 and ' +
            'currnetCol = 2', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.wholeTbl.computeCellPosition(1, 2);
              expect(cellPosition).toEqual('right');
            });

        it('should return cellPosition as -center-  if currentRow = 1 and ' +
            'currnetCol = 1', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.wholeTbl.computeCellPosition(1, 1);
              expect(cellPosition).toEqual('center');
            });

        it('should return cellPosition as -bottom_left-  if currentRow = 2 ' +
            'and currnetCol = 0', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.wholeTbl.computeCellPosition(2, 0);
              expect(cellPosition).toEqual('bottom_left');
            });

        it('should return cellPosition as -bottom_right-  if currentRow = 2 ' +
            'and currnetCol = 2', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.wholeTbl.computeCellPosition(2, 2);
              expect(cellPosition).toEqual('bottom_right');
            });

        it('should return cellPosition as -bottom_center-  if ' +
            'currentRow = 2 and currnetCol = 1', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.wholeTbl.computeCellPosition(2, 1);
              expect(cellPosition).toEqual('bottom_center');
            });

      });

      describe('For -band1H- part type ', function() {

        it('should return cellPosition as -left-  if currentRow = 1 and ' +
            'currnetCol = 0', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.band1H.computeCellPosition(1, 0);
              expect(cellPosition).toEqual('left');
            });

        it('should return cellPosition as -right-  if currentRow = 1 and ' +
            'currnetCol = 2', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.band1H.computeCellPosition(1, 2);
              expect(cellPosition).toEqual('right');
            });

        it('should return cellPosition as -center-  if currentRow = 1 and ' +
            'currnetCol = 1', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.band1H.computeCellPosition(1, 1);
              expect(cellPosition).toEqual('center');
            });

      });

      describe('For -band2H- part type ', function() {

        it('should return cellPosition as -left-  if currentRow = 1 and ' +
            'currnetCol = 0', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.band2H.computeCellPosition(1, 0);
              expect(cellPosition).toEqual('left');
            });

        it('should return cellPosition as -right-  if currentRow = 1 and ' +
            'currnetCol = 2', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.band2H.computeCellPosition(1, 2);
              expect(cellPosition).toEqual('right');
            });

        it('should return cellPosition as -center-  if currentRow = 1 and ' +
            'currnetCol = 1', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.band2H.computeCellPosition(1, 1);
              expect(cellPosition).toEqual('center');
            });

      });

      describe('For -firstRow- part type ', function() {

        it('should return cellPosition as -left-  if currentRow = 1 and ' +
            'currnetCol = 0', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.firstRow.computeCellPosition(1, 0);
              expect(cellPosition).toEqual('left');
            });

        it('should return cellPosition as -right-  if currentRow = 1 and ' +
            'currnetCol = 2', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.firstRow.computeCellPosition(1, 2);
              expect(cellPosition).toEqual('right');
            });

        it('should return cellPosition as -center-  if currentRow = 1 and ' +
            'currnetCol = 1', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.firstRow.computeCellPosition(1, 1);
              expect(cellPosition).toEqual('center');
            });

      });

      describe('For -lastRow- part type ', function() {

        it('should return cellPosition as -left-  if currentRow = 1 and ' +
            'currnetCol = 0', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.lastRow.computeCellPosition(1, 0);
              expect(cellPosition).toEqual('left');
            });

        it('should return cellPosition as -right-  if currentRow = 1 and ' +
            'currnetCol = 2', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.lastRow.computeCellPosition(1, 2);
              expect(cellPosition).toEqual('right');
            });

        it('should return cellPosition as -center-  if currentRow = 1 and ' +
            'currnetCol = 1', function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.lastRow.computeCellPosition(1, 1);
              expect(cellPosition).toEqual('center');
            });

      });

      describe('For -band1V- part type ', function() {

        it('should return cellPosition as -top-  if currentRow = 0',
            function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.band1V.computeCellPosition(0, 0);
              expect(cellPosition).toEqual('top');
            });

        it('should return cellPosition as -bottom-  if currentRow = 2',
            function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.band1V.computeCellPosition(2, 0);
              expect(cellPosition).toEqual('bottom');
            });

        it('should return cellPosition as -center-  if currentRow = 1',
            function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.band1V.computeCellPosition(1, 0);
              expect(cellPosition).toEqual('center');
            });

      });

      describe('For -band2V- part type ', function() {

        it('should return cellPosition as -top-  if currentRow = 0',
            function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.band2V.computeCellPosition(0, 0);
              expect(cellPosition).toEqual('top');
            });

        it('should return cellPosition as -bottom-  if currentRow = 2',
            function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.band2V.computeCellPosition(2, 0);
              expect(cellPosition).toEqual('bottom');
            });

        it('should return cellPosition as -center-  if currentRow = 1',
            function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.band2V.computeCellPosition(1, 0);
              expect(cellPosition).toEqual('center');
            });

      });

      describe('For -firstCol- part type ', function() {

        it('should return cellPosition as -top-  if currentRow = 0',
            function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.firstCol.computeCellPosition(0, 0);
              expect(cellPosition).toEqual('top');
            });

        it('should return cellPosition as -bottom-  if currentRow = 2',
            function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.firstCol.computeCellPosition(2, 0);
              expect(cellPosition).toEqual('bottom');
            });

        it('should return cellPosition as -center-  if currentRow = 1',
            function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.firstCol.computeCellPosition(1, 0);
              expect(cellPosition).toEqual('center');
            });

      });

      describe('For -lastCol- part type ', function() {

        it('should return cellPosition as -top-  if currentRow = 0',
            function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.lastCol.computeCellPosition(0, 0);
              expect(cellPosition).toEqual('top');
            });

        it('should return cellPosition as -bottom-  if currentRow = 2',
            function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.lastCol.computeCellPosition(2, 0);
              expect(cellPosition).toEqual('bottom');
            });

        it('should return cellPosition as -center-  if currentRow = 1',
            function() {
              var cellPosition = TableCellBorderDefinitions.
                  partTypeToCellPositionMap.lastCol.computeCellPosition(1, 0);
              expect(cellPosition).toEqual('center');
            });

      });

      describe('For -seCell- part type ', function() {

        it('should return cellPosition as -corner- ', function() {
          var cellPosition = TableCellBorderDefinitions.
              partTypeToCellPositionMap.seCell.computeCellPosition(0, 0);
          expect(cellPosition).toEqual('corner');
        });

      });

      describe('For -swCell- part type ', function() {

        it('should return cellPosition as -corner- ', function() {
          var cellPosition = TableCellBorderDefinitions.
              partTypeToCellPositionMap.swCell.computeCellPosition(0, 0);
          expect(cellPosition).toEqual('corner');
        });

      });

      describe('For -neCell- part type ', function() {

        it('should return cellPosition as -corner- ', function() {
          var cellPosition = TableCellBorderDefinitions.
              partTypeToCellPositionMap.neCell.computeCellPosition(0, 0);
          expect(cellPosition).toEqual('corner');
        });

      });

      describe('For -nwCell- part type ', function() {

        it('should return cellPosition as -corner- ', function() {
          var cellPosition = TableCellBorderDefinitions.
              partTypeToCellPositionMap.nwCell.computeCellPosition(0, 0);
          expect(cellPosition).toEqual('corner');
        });
      });
    });
  });
});
