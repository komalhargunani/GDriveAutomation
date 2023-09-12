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
 * tests for point table renderer
 */
define([
  'qowtRoot/dcp/decorators/pointTableDecorator',
  'qowtRoot/dcp/pointHandlers/pointTableHandler',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager',
  'qowtRoot/dcp/decorators/tableStyleDecorator'
], function(TableDecorator,
            PointTable,
            TableStyleManager,
            TableStyleDecorator) {

  'use strict';

  describe('Point table renderer tests ', function() {
    var tableId = 1111;
    var visitable = {};
    var element = {};

    var tableStyleDecorator = {
      decorateTableStyles: function() {
      }
    };

    var node = {
      appendChild: function() {
      }
    };
    var tableProperties = {
      tableStyleId: '{78}',
      xfrm: {},
      fill: {}
    };
    var tableGrid = [];
    var tableRows = [];
    var pointTableHandler = PointTable;

    beforeEach(function() {
      tableGrid = [
        {
          'width': 914400
        },
        {
          'width': 123456
        },
        {
          'width': 789012
        }
      ];

      tableRows = [
        {
          'etp': 'pTbleR',
          'eid': 133,
          'h': 914400,
          'elm': [
            {
              'etp': 'pTbleC',
              'eid': 134,
              'tcPr': {},
              'txBody': {}
            },
            {
              'etp': 'pTbleC',
              'eid': 135,
              'tcPr': {},
              'txBody': {}
            },
            {
              'etp': 'pTbleC',
              'eid': 136,
              'tcPr': {},
              'txBody': {}
            }
          ]
        },
        {
          'etp': 'pTbleR',
          'eid': 143,
          'h': 123456,
          'elm': [
            {
              'etp': 'pTbleC',
              'eid': 144,
              'tcPr': {},
              'txBody': {}
            },
            {
              'etp': 'pTbleC',
              'eid': 145,
              'tcPr': {},
              'txBody': {}
            },
            {
              'etp': 'pTbleC',
              'eid': 146,
              'tcPr': {},
              'txBody': {}
            }
          ]
        },
        {
          'etp': 'pTbleR',
          'eid': 153,
          'h': 789012,
          'elm': [
            {
              'etp': 'pTbleC',
              'eid': 154,
              'tcPr': {},
              'txBody': {}
            },
            {
              'etp': 'pTbleC',
              'eid': 155,
              'tcPr': {},
              'txBody': {}
            },
            {
              'etp': 'pTbleC',
              'eid': 156,
              'tcPr': {},
              'txBody': {}
            }
          ]
        }
      ];

      element = {
        'eid': tableId,
        'etp': 'ptbl',
        'tblGrid': tableGrid,
        'elm': tableRows,
        nvSpPr: {
          shapeId: 'some table Id'
        }
      };
      visitable.el = element;
      visitable.node = node;

    });

    it('should return undefined if etp is not ptbl', function() {
      visitable.el.etp = 'xyz';
      var table = pointTableHandler.visit(visitable);
      expect(table).toEqual(undefined);
    });

    it('should return table element if etp is ptbl', function() {
      var table = pointTableHandler.visit(visitable);
      expect(table.localName).toEqual('table');
    });

    it('should reset table properties if etp is ptbl', function() {
      spyOn(TableStyleManager, 'resetTableProperties');
      pointTableHandler.visit(visitable);
      expect(TableStyleManager.resetTableProperties).toHaveBeenCalled();
    });

    it('should apply background style classes table element if etp is ptbl',
        function() {
          spyOn(TableStyleManager, 'applyTblBgStyleClasses');
          pointTableHandler.visit(visitable);
          expect(TableStyleManager.applyTblBgStyleClasses).toHaveBeenCalled();
        });

    it('should update table properties if etp is ptbl and styleId is defined',
        function() {
          visitable.el.etp = 'ptbl';
          visitable.el.tblPr = tableProperties;
          spyOn(TableStyleManager, 'shouldCreateCssForTableStyle').
              andReturn(false);
          spyOn(TableStyleManager, 'updateTableProperties');
          pointTableHandler.visit(visitable);
          expect(TableStyleManager.updateTableProperties).
              toHaveBeenCalledWith(visitable.el.tblPr, tableRows.length,
                  visitable.el.tblGrid.length);
        });

    //describe table decorator tests
    describe('table decorator tests ', function() {

      var decoratorLocalApi = {
        withNewTableDiv: function() {
        },
        withNewParentDiv: function() {
        },
        withTransforms: function() {
        },
        withFill: function() {
        },
        withUpdatedCellDimensionsAndFill: function() {
        }
      };

      var someTableDiv, someParentDiv;

      beforeEach(function() {

        someParentDiv = document.createElement('DIV');
        someTableDiv = document.createElement('TABLE');

        spyOn(TableDecorator, 'decorate').andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withNewTableDiv').andReturn(someTableDiv);
        spyOn(decoratorLocalApi, 'withNewParentDiv').andReturn(someParentDiv);
        spyOn(decoratorLocalApi, 'withTransforms').andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withFill').andReturn(decoratorLocalApi);
        spyOn(decoratorLocalApi, 'withUpdatedCellDimensionsAndFill').
            andReturn(decoratorLocalApi);
      });

      afterEach(function() {
        var tempParent = someParentDiv.parent;
        if (tempParent) {
          tempParent.removeChild(someParentDiv);
        }

        tempParent = someTableDiv.parent;
        if (tempParent) {
          tempParent.removeChild(someTableDiv);
        }
      });

      it('should decorate with -withNewTableDiv- and -withNewParentDiv- if ' +
          'etp is ptbl', function() {
            pointTableHandler.visit(visitable);
            expect(TableDecorator.decorate).toHaveBeenCalled();
            expect(decoratorLocalApi.withNewTableDiv).
                toHaveBeenCalledWith(visitable.el);
            expect(decoratorLocalApi.withNewParentDiv).
                toHaveBeenCalledWith(visitable.el);
          });

      it('should call decorate table styles if etp is ptbl and styleId is ' +
          'defined and the class is not created', function() {
            visitable.el.etp = 'ptbl';
            visitable.el.tblPr = tableProperties;
            var someTableStyle2 = {
              styleId: '{78}',
              tblBg: 'some other table back ground',
              wholeTbl: 'some other whole table properties'
            };
            TableStyleManager.cacheTableStyles(someTableStyle2);
            //  spyOn(TableStyleManager, 'shouldCreateCssForTableStyle')
            // .andReturn(true);
            spyOn(TableStyleDecorator, 'create').andReturn(tableStyleDecorator);
            spyOn(tableStyleDecorator, 'decorateTableStyles');
            pointTableHandler.visit(visitable);
            expect(tableStyleDecorator.decorateTableStyles).
                toHaveBeenCalledWith(visitable.el.tblPr.tableStyleId);
          });

      it('should not call decorate table styles if styleId is defined and the' +
          ' class is already created', function() {
            visitable.el.tblPr = tableProperties;

            spyOn(TableStyleDecorator, 'create').andReturn(tableStyleDecorator);
            spyOn(tableStyleDecorator, 'decorateTableStyles');
            pointTableHandler.visit(visitable);
            expect(tableStyleDecorator.decorateTableStyles).not.
                toHaveBeenCalled();
          });

      it('should decorate with transforms and fill  when table properties is' +
          ' present', function() {
            visitable.el.tblPr = tableProperties;
            pointTableHandler.visit(visitable);
            expect(decoratorLocalApi.withTransforms).
                toHaveBeenCalledWith(someParentDiv, tableProperties.xfrm);
            expect(decoratorLocalApi.withFill).
                toHaveBeenCalledWith(someTableDiv, tableProperties.fill);
         });

      it('should decorate with cell grid properties when table grid is present',
          function() {
            visitable.el.tblPr = tableProperties;
            pointTableHandler.visit(visitable);
            expect(decoratorLocalApi.withUpdatedCellDimensionsAndFill).
                toHaveBeenCalledWith(visitable.el.elm, tableGrid);
          });
    });
  });
});
