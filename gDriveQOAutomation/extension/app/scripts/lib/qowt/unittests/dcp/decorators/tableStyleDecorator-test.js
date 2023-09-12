// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit test case for TableStyleDecorator
 *
 * @author kunjan.thakkar@quickoffice.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/dcp/decorators/tableStyleDecorator',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/models/point',
  'qowtRoot/utils/cssManager'
], function(TableStyleDecorator,
            TableStyleManager,
            ThemeStyleRefManager,
            FillHandler,
            PointModel,
            CssManager) {

  'use strict';

  describe('TableStyle decorator Test', function() {

    beforeEach(function() {
      PointModel.MasterSlideId = 420;
      PointModel.currentPHLevel = 'sldmt';
    });

    var _tableStyleDecorator = TableStyleDecorator.create();

    afterEach(function() {
      PointModel.MasterSlideId = undefined;
      PointModel.currentPHLevel = undefined;

      // now empty the array of cached styles
      TableStyleManager.resetTableStylesCache();
    });

    describe('table cell fill style', function() {

      it('should decorate with table fill style', function() {
        var tblStyle = {
          name: 'Medium Style 2 - Accent 1',
          styleId: '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}',
          wholeTbl: {
            tcStyle: {
              fill: {
                color: {
                  scheme: 'accent1',
                  type: 'schemeClr'
                },
                type: 'solidFill'
              }
            }
          }
        };

        var _fillHandler = FillHandler;

        spyOn(_fillHandler, 'getFillStyle').andReturn('some fill style');
        spyOn(CssManager, 'addRule');

        TableStyleManager.cacheTableStyles(tblStyle);
        TableStyleManager.computeClassPrefix(tblStyle.styleId);
        _tableStyleDecorator.decorateTableStyles(tblStyle.styleId);

        expect(CssManager.addRule.calls[0].args[0]).toEqual(
            '.tblStyl_420_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_wholeTbl_' +
            'fillStyle');
        expect(CssManager.addRule.calls[0].args[1]).toEqual('some fill style');
      });

      it('should decorate with table cell fillRef style', function() {
        var tblStyle = {
          name: 'Medium Style 2 - Accent 1',
          styleId: '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}',
          wholeTbl: {
            tcStyle: {
              fillRef: {
                idx: '0',
                clr: '#FF0000'
              }
            }
          }
        };

        var _fillHandler = FillHandler;

        spyOn(_fillHandler, 'getFillStyle').andReturn('some fill style');
        spyOn(ThemeStyleRefManager, 'getFillRefStyleForTable').andReturn(
            'some fillRef style');
        spyOn(CssManager, 'addRule');

        TableStyleManager.cacheTableStyles(tblStyle);
        TableStyleManager.computeClassPrefix(tblStyle.styleId);

        _tableStyleDecorator.decorateTableStyles(tblStyle.styleId);

        expect(CssManager.addRule.calls[0].args[0]).toEqual(
            '.tblStyl_420_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_wholeTbl_' +
            'fillStyle');
        expect(CssManager.addRule.calls[0].args[1]).toEqual('some fill style');
      });

      it(' should not decorate with table fill when fill is undefined',
          function() {
            var tblStyle = {
              name: 'Medium Style 2 - Accent 1',
              styleId: '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}',
              wholeTbl: {
                tcStyle: {
                  fill: undefined
                }
              }
            };

            var _fillHandler = FillHandler;

            spyOn(_fillHandler, 'getFillStyle').andReturn('some fill style');
            spyOn(CssManager, 'addRule');

            TableStyleManager.cacheTableStyles(tblStyle);
            TableStyleManager.computeClassPrefix(tblStyle.styleId);

            _tableStyleDecorator.decorateTableStyles(tblStyle.styleId);

            expect(CssManager.addRule).not.toHaveBeenCalled();
          });

      it(' should not decorate with tablefill when table fill is nofill',
          function() {
            var tblStyle = {
              name: 'Medium Style 2 - Accent 1',
              styleId: '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}',
              wholeTbl: {
                tcStyle: {
                  fill: {
                    type: 'noFill'
                  }
                }
              }
            };

            spyOn(CssManager, 'addRule');

            TableStyleManager.cacheTableStyles(tblStyle);
            TableStyleManager.computeClassPrefix(tblStyle.styleId);

            _tableStyleDecorator.decorateTableStyles(tblStyle.styleId);

            expect(CssManager.addRule.calls[0].args[1]).toEqual(
                'background:none;');
          });
    });

    describe('table cell text run style', function() {
      var tblStyle = {
        name: 'Medium Style 2 - Accent 1',
        styleId: '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}',
        wholeTbl: {
          tcTxStyle: {
            color: {
              clr: '#000000',
              type: 'srgbClr'
            },
            fontRef: {
              color: {
                clr: '#000000',
                type: 'srgbClr'
              },
              idx: 'minor'
            }
          }
        }
      };

      it('should call getStyleString of text body properties when text body ' +
          'properties are defined', function() {
            PointModel.currentTable.isProcessingTable = true;

            spyOn(ThemeStyleRefManager, 'getFontRefStyle').andReturn(
                'some font style');
            spyOn(CssManager, 'addRule');

            TableStyleManager.cacheTableStyles(tblStyle);
            TableStyleManager.computeClassPrefix(tblStyle.styleId);

            _tableStyleDecorator.decorateTableStyles(tblStyle.styleId);

            expect(CssManager.addRule.calls[0].args[0]).toEqual(
                '[styleid="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"] ' +
                    'span[is="qowt-point-run"]');

            var elm = document.createElement('div');
            var cssText = CssManager.addRule.calls[0].args[1];
            elm.style.cssText = cssText;

            expect(elm.style.color).toEqual('rgb(0, 0, 0)');
            expect(elm.style.lineHeight).toEqual('1.2');
          });
    });

    describe('table cell text run style with font', function() {
      var tblStyle = {
        name: 'Medium Style 2 - Accent 1',
        styleId: '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}',
        wholeTbl: {
          tcTxStyle: {
            font: {
              ea: 'EastAsian',
              cs: 'ComplexScript',
              latin: 'Latin'
            }
          }
        }
      };

      it('should call getStyleString of text body properties when text body ' +
          'font property is defined', function() {
            PointModel.currentTable.isProcessingTable = true;

            spyOn(ThemeStyleRefManager, 'getFontRefStyle').andReturn(
                'some font style');
            spyOn(CssManager, 'addRule');

            TableStyleManager.cacheTableStyles(tblStyle);
            TableStyleManager.computeClassPrefix(tblStyle.styleId);

            _tableStyleDecorator.decorateTableStyles(tblStyle.styleId);

            expect(CssManager.addRule.calls[0].args[0]).toEqual(
                '[styleid="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"] ' +
                    'span[is="qowt-point-run"]');

            var elm = document.createElement('div');
            var cssText = CssManager.addRule.calls[0].args[1];
            elm.style.cssText = cssText;
            expect(elm.style.lineHeight).toEqual('1.2');
            expect(elm.style.fontFamily).toEqual('Latin');
          });
    });

    describe('table background fill style', function() {
      var tblStyle = {
        name: 'Medium Style 2 - Accent 1',
        styleId: '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}',
        tblBg: {
          fill: {
            type: 'solidFill',
            clr: '#FF0000'
          }
        }
      };

      it('should decorate with table background fill style', function() {
        var _fillHandler = FillHandler;

        spyOn(_fillHandler, 'getFillStyle').andReturn('some fill style');
        spyOn(CssManager, 'addRule');

        TableStyleManager.cacheTableStyles(tblStyle);
        TableStyleManager.computeClassPrefix(tblStyle.styleId);

        _tableStyleDecorator.decorateTableStyles(tblStyle.styleId);

        expect(CssManager.addRule.calls[0].args[0]).toEqual(
            '.tblStyl_420_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_tblBg');
        expect(CssManager.addRule.calls[0].args[1]).toEqual('some fill style');
      });

      it('should decorate with table background fillRef style', function() {
        tblStyle.tblBg = {
          fillRef: {
            idx: '0',
            clr: '#FF0000'
          }
        };

        var _fillHandler = FillHandler;

        spyOn(_fillHandler, 'getFillStyle').andReturn('some fill style');
        spyOn(ThemeStyleRefManager, 'getFillRefStyleForTable').andReturn(
            'some fillRef style');
        spyOn(CssManager, 'addRule');

        TableStyleManager.cacheTableStyles(tblStyle);
        TableStyleManager.computeClassPrefix(tblStyle.styleId);

        _tableStyleDecorator.decorateTableStyles(tblStyle.styleId);

        expect(CssManager.addRule.calls[0].args[0]).toEqual(
            '.tblStyl_420_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_tblBg');
        expect(CssManager.addRule.calls[0].args[1]).toEqual('some fill style');
      });

      it('should not decorate with table fill when fill is undefined',
          function() {
            tblStyle.tblBg = {
              fill: undefined
            };

            var _fillHandler = FillHandler;

            spyOn(_fillHandler, 'getFillStyle').andReturn('some fill style');
            spyOn(ThemeStyleRefManager, 'getFillRefStyleForTable').andReturn(
                'some fillRef style');
            spyOn(CssManager, 'addRule');

            TableStyleManager.cacheTableStyles(tblStyle);
            TableStyleManager.computeClassPrefix(tblStyle.styleId);

            _tableStyleDecorator.decorateTableStyles(tblStyle.styleId);

            expect(CssManager.addRule).not.toHaveBeenCalled();
          });

      it(' should not decorate with tablefill when table fill is nofill',
          function() {
            tblStyle.tblBg = {
              fill: {
                type: 'noFill'
              }
            };

            spyOn(ThemeStyleRefManager, 'getFillRefStyleForTable').andReturn(
                'some fillRef style');
            spyOn(CssManager, 'addRule');

            TableStyleManager.cacheTableStyles(tblStyle);
            TableStyleManager.computeClassPrefix(tblStyle.styleId);

            _tableStyleDecorator.decorateTableStyles(tblStyle.styleId);

            expect(CssManager.addRule.calls[0].args[0]).toEqual(
                '.tblStyl_420_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_tblBg');
            expect(CssManager.addRule.calls[0].args[1]).toEqual(
                'background:none;');
          });
    });

    describe('table cell outline style', function() {

      it('should decorate with table outline style', function() {
        var tblStyle = {
          name: 'Medium Style 2 - Accent 1',
          styleId: '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}',
          wholeTbl: {
            tcStyle: {
              tcBdr: {
                bottom: {
                  ln: {
                    cmpd: 'sng',
                    fill: {
                      color: {
                        clr: '#000000',
                        type: 'srgbClr'
                      },
                      type: 'solidFill'
                    },
                    w: 12700
                  }
                },
                top: {
                  ln: {
                    cmpd: 'sng',
                    fill: {
                      color: {
                        clr: '#000000',
                        type: 'srgbClr'
                      },
                      type: 'solidFill'
                    },
                    w: 12700
                  }
                }
              }
            }
          }
        };

        spyOn(CssManager, 'addRule');

        TableStyleManager.cacheTableStyles(tblStyle);
        TableStyleManager.computeClassPrefix(tblStyle.styleId);
        _tableStyleDecorator.decorateTableStyles(tblStyle.styleId);

        expect(CssManager.addRule.calls[0].args[0]).toEqual(
            '.tblStyl_420_5C22544A-7EE6-4342-B048-85BDC9FD1C3A_wholeTbl_' +
            'top_left_lnStyle');
        expect(CssManager.addRule.calls[0].args[1]).toEqual(
            'border-top-style:solid;' +
            'border-top-width:1.3333333333333333px;' +
            'border-top-color:rgba(0,0,0,1);');
      });
    });
  });
});
