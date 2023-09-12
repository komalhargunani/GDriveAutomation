// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test case for TableStyleClassFactory
 *
 * @see src/drawing/Styles/TableStyles/TableStyleClassFactory.js
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/drawing/styles/tableStyles/tableStyleClassFactory'
], function(TableStyleClassFactory) {

  'use strict';

  describe('TableStyle Class Factory', function() {
    var _tableStyleClassFactory = TableStyleClassFactory;

    describe('getCellFillStyleClassName', function() {

      it('should return proper cell fill class-name when table part style is ' +
          '-tblBg-', function() {
            var className = _tableStyleClassFactory.tblBg.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_tblBg_fillStyle');
          });

      it('should return proper cell fill class-name when table part style is ' +
          '-wholeTbl-', function() {
            var className = _tableStyleClassFactory.wholeTbl.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_wholeTbl_fillStyle');
          });
      it('should return proper cell fill class-name when table part style is ' +
          '-band1H-', function() {
            var className = _tableStyleClassFactory.band1H.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_band1H_fillStyle');
          });
      it('should return proper cell fill class-name when table part style is ' +
          '-band2H-', function() {
            var className = _tableStyleClassFactory.band2H.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_band2H_fillStyle');
          });
      it('should return proper cell fill class-name when table part style is ' +
          '-band1V-', function() {
            var className = _tableStyleClassFactory.band1V.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_band1V_fillStyle');
          });

      it('should return proper cell fill class-name when table part style is ' +
          '-band2V-', function() {
            var className = _tableStyleClassFactory.band2V.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_band2V_fillStyle');
          });

      it('should return proper cell fill class-name when table part style is ' +
          '-lastCol-', function() {
            var className = _tableStyleClassFactory.lastCol.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_lastCol_fillStyle');
          });

      it('should return proper cell fill class-name when table part style is ' +
          '-firstCol-', function() {
            var className = _tableStyleClassFactory.firstCol.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_firstCol_fillStyle');
          });

      it('should return proper cell fill class-name when table part style is ' +
          '-lastRow-', function() {
            var className = _tableStyleClassFactory.lastRow.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_lastRow_fillStyle');
          });

      it('should return proper cell fill class-name when table part style is ' +
          '-seCell-', function() {
            var className = _tableStyleClassFactory.seCell.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_seCell_fillStyle');
          });

      it('should return proper cell fill class-name when table part style is ' +
          '-swCell-', function() {
            var className = _tableStyleClassFactory.swCell.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_swCell_fillStyle');
          });

      it('should return proper cell fill class-name when table part style is ' +
          '-firstRow-', function() {
            var className = _tableStyleClassFactory.firstRow.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_firstRow_fillStyle');
          });

      it('should return proper cell fill class-name when table part style is ' +
          '-neCell-', function() {
            var className = _tableStyleClassFactory.neCell.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_neCell_fillStyle');
          });

      it('should return proper cell fill class-name when table part style is ' +
          '-nwCell-', function() {
            var className = _tableStyleClassFactory.nwCell.
                getCellFillStyleClassName('weirdTblClassPrefix');
            expect(className).toEqual('weirdTblClassPrefix_nwCell_fillStyle');
          });

      describe('getCellTxRunStyleClassName for WholeTbl table style part type',
          function() {

            it('should return proper cell text style class-name when table ' +
                'part style is -tblBg-', function() {
                  var className = _tableStyleClassFactory.tblBg.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_tblBg_txStyle');
                });

            it('should return proper cell text style class-name when table ' +
                'part style is -wholeTbl-', function() {
                  var className = _tableStyleClassFactory.wholeTbl.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_wholeTbl_txStyle');
                });
            it('should return proper cell text style class-name when table ' +
                'part style is -band1H-', function() {
                  var className = _tableStyleClassFactory.band1H.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_band1H_txStyle');
                });
            it('should return proper cell text style class-name when table ' +
                'part style is -band2H-', function() {
                  var className = _tableStyleClassFactory.band2H.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_band2H_txStyle');
                });
            it('should return proper cell text style class-name when table ' +
                'part style is -band1V-', function() {
                  var className = _tableStyleClassFactory.band1V.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_band1V_txStyle');
                });

            it('should return proper cell text style class-name when table ' +
                'part style is -band2V-', function() {
                  var className = _tableStyleClassFactory.band2V.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_band2V_txStyle');
                });

            it('should return proper cell text style class-name when table ' +
                'part style is -lastCol-', function() {
                  var className = _tableStyleClassFactory.lastCol.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_lastCol_txStyle');
                });

            it('should return proper cell text style class-name when table ' +
                'part style is -firstCol-', function() {
                  var className = _tableStyleClassFactory.firstCol.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_firstCol_txStyle');
                });

            it('should return proper cell text style class-name when table ' +
                'part style is -lastRow-', function() {
                  var className = _tableStyleClassFactory.lastRow.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_lastRow_txStyle');
                });

            it('should return proper cell text style class-name when table ' +
                'part style is -seCell-', function() {
                  var className = _tableStyleClassFactory.seCell.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_seCell_txStyle');
                });

            it('should return proper cell text style class-name when table ' +
                'part style is -swCell-', function() {
                  var className = _tableStyleClassFactory.swCell.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_swCell_txStyle');
                });

            it('should return proper cell text style class-name when table ' +
                'part style is -firstRow-', function() {
                  var className = _tableStyleClassFactory.firstRow.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_firstRow_txStyle');
                });

            it('should return proper cell text style class-name when table ' +
                'part style is -neCell-', function() {
                  var className = _tableStyleClassFactory.neCell.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_neCell_txStyle');
                });

            it('should return proper cell text style class-name when table ' +
                'part style is -nwCell-', function() {
                  var className = _tableStyleClassFactory.nwCell.
                      getCellTxRunStyleClassName('weirdTblClassPrefix');
                  expect(className).toEqual(
                      'weirdTblClassPrefix_nwCell_txStyle');
                });

          });



      describe('getCellOutlineStyleClassName', function() {

        it('should return proper class-name for left border when table part ' +
            'style is -wholeTbl-', function() {
              var className = _tableStyleClassFactory.wholeTbl.
                  getCellOutlineStyleClassName('weirdTblClassPrefix', 'left');
              expect(className).toEqual(
                  'weirdTblClassPrefix_wholeTbl_left_lnStyle');
           });

        it('should return proper class-name for right border when table ' +
            'part style is -wholeTbl-', function() {
              var className = _tableStyleClassFactory.wholeTbl.
                  getCellOutlineStyleClassName('weirdTblClassPrefix', 'right');
              expect(className).toEqual(
                  'weirdTblClassPrefix_wholeTbl_right_lnStyle');
           });

        it('should return proper class-name for top border when table part ' +
            'style is -wholeTbl-', function() {
              var className = _tableStyleClassFactory.wholeTbl.
                  getCellOutlineStyleClassName('weirdTblClassPrefix', 'top');
              expect(className).toEqual(
                  'weirdTblClassPrefix_wholeTbl_top_lnStyle');
            });

        it('should return proper class-name for bottom border when table ' +
            'part style is -wholeTbl-', function() {
              var className = _tableStyleClassFactory.wholeTbl.
                  getCellOutlineStyleClassName('weirdTblClassPrefix', 'bottom');
              expect(className).toEqual(
                  'weirdTblClassPrefix_wholeTbl_bottom_lnStyle');
           });

        it('should return proper class-name for insideH border when table ' +
            'part style is -wholeTbl-', function() {
              var className = _tableStyleClassFactory.wholeTbl.
                  getCellOutlineStyleClassName('weirdTblClassPrefix',
                      'insideH');
              expect(className).toEqual(
                  'weirdTblClassPrefix_wholeTbl_insideH_lnStyle');
            });

        it('should return proper class-name for insideV border when table ' +
            'part style is -wholeTbl-', function() {
              var className = _tableStyleClassFactory.wholeTbl.
                  getCellOutlineStyleClassName('weirdTblClassPrefix',
                      'insideV');
              expect(className).toEqual(
                  'weirdTblClassPrefix_wholeTbl_insideV_lnStyle');
            });

      });

    });


  });
});
