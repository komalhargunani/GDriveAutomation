/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/models/point',
  'qowtRoot/dcp/pointHandlers/pointTableCellHandler',
  'qowtRoot/utils/idGenerator',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager',
  'qowtRoot/dcp/decorators/outlineDecorator'
], function(PointModel,
            TableCellHandler,
            IdGenerator,
            TableStyleManager,
            OutlineDecorator) {

  'use strict';

  /**
   * tests for point table cell renderer
   */
  describe('QOWT/dcp/pointHandlers/PointTableCellHandler.js', function() {

    var _visitable = {};
    var _bodyProperties;

    var node = {
      appendChild: function() {
      }
    };

    beforeEach(function() {
      _bodyProperties = {lIns: 9114, rIns: 9114, tIns: 9114, bIns: 9114};
      _visitable = {
        node: node,
        el: {
          etp: 'pTbleC',
          eid: '111',
          txBody: {
            bodyPr: {}
          }
        }
      };
    });

    describe('verifying input to pointTableCellHandler', function() {
      it('should return undefined if visitable JSON is undefined', function() {
        var cell = TableCellHandler.visit(undefined);
        expect(cell).toEqual(undefined);
      });

      it('should return undefined if etp is undefined', function() {
        _visitable.el.etp = undefined;
        var cell = TableCellHandler.visit(_visitable);
        expect(cell).toEqual(undefined);
      });

      it('should return undefined if eid is undefined', function() {
        _visitable.el.eid = undefined;
        var cell = TableCellHandler.visit(_visitable);
        expect(cell).toEqual(undefined);
      });

      it('should return undefined if element in JSON is undefined', function() {
        _visitable.el = undefined;
        var cell = TableCellHandler.visit(_visitable);
        expect(cell).toEqual(undefined);
      });

      it('should return undefined if etp is not pTbleC', function() {
        _visitable.el.etp = 'xyz';
        var cell = TableCellHandler.visit(_visitable);
        expect(cell).toEqual(undefined);
      });

      it('should call createElement method of document if etp is pTbleC',
          function() {
            var cellElement = {
              style: {},
              setAttribute: function() {
              },
              getAttribute: function() {
                return null;
              },
              appendChild: function() {

              }
            };

            spyOn(document, 'createElement').andReturn(cellElement);
            TableCellHandler.visit(_visitable);
            expect(document.createElement).toHaveBeenCalledWith('TD');
          });

      it('should find tablePartStyles to be applied if etp is pTbleC',
          function() {
            spyOn(TableStyleManager, 'findTblPartStyleToApply');
            TableCellHandler.visit(_visitable);
            expect(TableStyleManager.findTblPartStyleToApply).
                toHaveBeenCalled();
          });

      it('should apply table style classes if etp is pTbleC', function() {
        spyOn(TableStyleManager, 'applyTblCellStyleClasses');
        TableCellHandler.visit(_visitable);
        expect(TableStyleManager.applyTblCellStyleClasses).toHaveBeenCalled();
      });

    });

    it('should reset -isProcessingTable- flag on postTraverse', function() {
      PointModel.currentTable.isProcessingTable = true;
      TableCellHandler.postTraverse(_visitable);
      expect(PointModel.currentTable.isProcessingTable).toEqual(false);
    });

    it('should set merge attribute if hMerge is true', function() {
      _visitable.el.hMerge = true;
      var cell = TableCellHandler.visit(_visitable);
      expect(cell.getAttribute('merge')).toEqual('true');
    });

    it('should set merge attribute if vMerge is true', function() {
      _visitable.el.vMerge = true;
      var cell = TableCellHandler.visit(_visitable);
      expect(cell.getAttribute('merge')).toEqual('true');
    });

    describe('verify shape JSON', function() {
      beforeEach(function() {
        _visitable.el.width = '101';
        _visitable.el.height = '201';
        _visitable.el.txBody = {
          'eid': '786',
          'elm': 'some para info',
          'bodyPr': _bodyProperties
        };
      });

      it('should set the shape JSON appropriately', function() {
        TableCellHandler.visit(_visitable);

        var expectedShapeJson = {
          'etp': 'sp',
          'eid': 'cellShape111',
          'nvSpPr': {},
          'spPr': {
            'geom': {
              'prst': 88
            },
            'xfrm': {
              'off': {
                'x': '0',
                'y': '0'
              },
              'ext': {
                'cx': '101',
                'cy': '201'
              }
            },
            'isShapeWithinTable': true
          },
          'height': '201',
          'elm': [
            {
              'etp': 'txBody',
              'eid': '786',
              'elm': 'some para info',
              'bodyPr': _bodyProperties
            }
          ]
        };

        expect(1, _visitable.el.elm.length);
        expect(expectedShapeJson).toEqual(_visitable.el.elm[0]);
      });

      it('should set the shape JSON fill element, when table cell properties ' +
          'present', function() {
            _visitable.el.tcPr = {
              fill: 'some fill'
            };

            TableCellHandler.visit(_visitable);

            var expectedShapeJson = {
              'etp': 'sp',
              'eid': 'cellShape111',
              'nvSpPr': {},
              'spPr': {
                'geom': {
                  'prst': 88
                },
                'xfrm': {
                  'off': {
                    'x': '0',
                    'y': '0'
                  },
                  'ext': {
                    'cx': '101',
                    'cy': '201'
                  }
                },
                fill: 'some fill',
                'isShapeWithinTable': true
              },
              'height': '201',
              'elm': [
                {
                  'etp': 'txBody',
                  'eid': '786',
                  'elm': 'some para info',
                  'bodyPr': _bodyProperties
                }
              ]
            };

            expect(1, _visitable.el.elm.length);
            expect(expectedShapeJson).toEqual(_visitable.el.elm[0]);
          });

      it('should decorate with shape properties with proper prstDash ' +
          'fallback when prstDash is undefined', function() {
            _visitable.el.tcPr = {
              lnB: {
                prstDash: undefined
              }
            };

            TableCellHandler.visit(_visitable);

            expect(_visitable.el.tcPr.lnB.prstDash).toEqual('solid');
          });

      it('should decorate with default outline when all borders are ' +
          'undefined and table does not refer to any table style', function() {
            _visitable.el.tcPr = {};

            var defaultBorder = {
              prstDash: 'solid',
              fill: {
                color: {
                  clr: '#000000',
                  type: 'srgbClr'
                },
                type: 'solidFill'
              },
              w: 12700
            };
            TableCellHandler.visit(_visitable);

            expect(_visitable.el.tcPr.lnT).toEqual(defaultBorder);
            expect(_visitable.el.tcPr.lnB).toEqual(defaultBorder);
            expect(_visitable.el.tcPr.lnL).toEqual(defaultBorder);
            expect(_visitable.el.tcPr.lnR).toEqual(defaultBorder);
          });

      it('should decorate with default outline when any border is ' +
          'undefined and table does not refer to any table style', function() {
            _visitable.el.tcPr = {
              lnB: {
                prstDash: 'solid',
                fill: {
                  color: {
                    clr: '#FFFFFF',
                    type: 'srgbClr'
                  },
                  type: 'solidFill'
                },
                w: 12700
              },
              lnL: {
                prstDash: 'solid',
                fill: {
                  color: {
                    clr: '#FFFFFF',
                    type: 'srgbClr'
                  },
                  type: 'solidFill'
                },
                w: 12700
              }
            };

            var defaultBorder = {
              prstDash: 'solid',
              fill: {
                color: {
                  clr: '#000000',
                  type: 'srgbClr'
                },
                type: 'solidFill'
              },
              w: 12700
            };
            TableCellHandler.visit(_visitable);

            expect(_visitable.el.tcPr.lnT).toEqual(defaultBorder);
            expect(_visitable.el.tcPr.lnR).toEqual(defaultBorder);
          });

      it('should call Outline Decorator with table cell borders when table ' +
          'cell properties present', function() {
            var decoratorApi = {
              handleUsingHTML: function() {
              }
            };
            spyOn(OutlineDecorator, 'create').andReturn(decoratorApi);
            spyOn(decoratorApi, 'handleUsingHTML');
            TableCellHandler.visit(_visitable);
            expect(decoratorApi.handleUsingHTML).toHaveBeenCalled();
          });

      it('should call Outline Decorator with default borders when table cell ' +
          'properties are not present', function() {
            _visitable.el.tcPr = undefined;
            var decoratorApi = {
              handleUsingHTML: function() {
              }
            };
            spyOn(OutlineDecorator, 'create').andReturn(decoratorApi);
            spyOn(decoratorApi, 'handleUsingHTML');
            TableCellHandler.visit(_visitable);
            expect(decoratorApi.handleUsingHTML).toHaveBeenCalled();
          });

      it('should get the -eid- of txBody from the generated uniqueId',
          function() {
            _visitable.el.txBody.eid = undefined;
            spyOn(IdGenerator, 'getUniqueId').andReturn('420');

            TableCellHandler.visit(_visitable);

            var expectedShapeJson = {
              'etp': 'sp',
              'eid': 'cellShape111',
              'nvSpPr': {},
              'spPr': {
                'geom': {
                  'prst': 88
                },
                'xfrm': {
                  'off': {
                    'x': '0',
                    'y': '0'
                  },
                  'ext': {
                    'cx': '101',
                    'cy': '201'
                  }
                },
                'isShapeWithinTable': true
              },
              'height': '201',
              'elm': [
                {
                  'etp': 'txBody',
                  'eid': 'txBody420',
                  'elm': 'some para info',
                  'bodyPr': _bodyProperties
                }
              ]
            };

            expect(1, _visitable.el.elm.length);
            expect(expectedShapeJson).toEqual(_visitable.el.elm[0]);
          });
    });
  });
});
