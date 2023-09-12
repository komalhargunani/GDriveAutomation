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
 * tests for point table decorator
 */

define([
  'qowtRoot/dcp/decorators/pointTableDecorator',
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/dcp/pointHandlers/transform2DHandler',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/utils/qowtMarkerUtils'
], function(TableDecorator,
            FillHandler,
            Transform2DHandler,
            Util,
            QOWTMarkerUtils) {

  'use strict';


  describe(' point table decorator tests ', function() {
    var handler = TableDecorator;
    var fillHandler = FillHandler;
    var table = document.createElement('TABLE');
    var parentDiv = document.createElement('DIV');
    var tableProperties = {};
    var transforms = {};
    var extents = {};
    var tableFill = {};
    var tableGrid = [];
    var tableRows = [];
    var element = {};
    var visitable = {};
    var node = {
      appendChild: function() {
      }
    };

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
        'eid': '1111',
        'etp': 'ptbl',
        'tblGrid': tableGrid,
        'elm': tableRows,
        nvSpPr: {
          shapeId: 'some table Id'
        }
      };

      visitable.el = element;
      visitable.node = node;

      tableProperties = {};
      transforms = {};
      extents = {};
      tableFill = {};
      table = document.createElement('TABLE');
      parentDiv = document.createElement('DIV');
    });

    // transform handler call
    it(' should call handle method of Transform2DHandler when table element ' +
        'is present with id', function() {
          parentDiv.id = '111';
          tableProperties.xfrm = transforms;
          spyOn(Transform2DHandler, 'handle');
          handler.decorate().withTransforms(parentDiv, tableProperties.xfrm);
          expect(Transform2DHandler.handle).toHaveBeenCalledWith(transforms,
              undefined, parentDiv);
        });

    it(' should not call handle method of Transform2DHandler when table is ' +
        'present but undefined ', function() {
          spyOn(Transform2DHandler, 'handle');
          handler.decorate().withTransforms(undefined, tableProperties.xfrm);
          expect(Transform2DHandler.handle).not.toHaveBeenCalledWith();
        });

    it(' should not call handle method of Transform2DHandler when table ' +
        'element is present  ' + 'but id is undefined ', function() {
          parentDiv.id = undefined;
          spyOn(Transform2DHandler, 'handle');
          handler.decorate().withTransforms(parentDiv, tableProperties.xfrm);
          expect(Transform2DHandler.handle).not.toHaveBeenCalledWith();
        });

    //table style height
    it(' should not call convertEmuToPixel method of Util when table ' +
        'properties are defined, and contain transforms which is defined but ' +
        'transforms are not having extents Also should not set table ' +
        'height style.', function() {
          tableProperties.xfrm = transforms;
          spyOn(Util, 'convertEmuToPixel');

          handler.decorate().withTransforms(parentDiv, tableProperties.xfrm);
          expect(Util.convertEmuToPixel).not.toHaveBeenCalled();
          expect(table.style.height).toEqual('');
        });

    it(' should not call convertEmuToPixel method of Util when table ' +
        'properties are defined, and contain transforms which is defined ' +
        'and transforms are having extents but undefined Also should not set ' +
        'table height style.', function() {
          transforms.ext = undefined;
          tableProperties.xfrm = transforms;
          spyOn(Util, 'convertEmuToPixel');

          handler.decorate().withTransforms(parentDiv, tableProperties.xfrm);
          expect(Util.convertEmuToPixel).not.toHaveBeenCalled();
          expect(table.style.height).toEqual('');
        });

    it(' should not call convertEmuToPixel method of Util when table ' +
        'properties  are defined, and contain transforms which is defined ' +
        'and transforms are having extents but extents not containing ' +
        'cy(height) Also should not set table height style.', function() {
          transforms.ext = extents;
          tableProperties.xfrm = transforms;
          spyOn(Util, 'convertEmuToPixel');

          handler.decorate().withTransforms(parentDiv, tableProperties.xfrm);
          expect(Util.convertEmuToPixel).not.toHaveBeenCalled();
          expect(table.style.height).toEqual('');
        });

    it(' should not call convertEmuToPixel method of Util when table ' +
        'properties are defined, and contain transforms which is defined ' +
        'and transforms are having extents and extents  contain cy(height) ' +
        'but undefined Also should not set table height style.', function() {
          extents = {
            'cy': undefined
          };
          transforms.ext = extents;
          tableProperties.xfrm = transforms;
          spyOn(Util, 'convertEmuToPixel');

          handler.decorate().withTransforms(parentDiv, tableProperties.xfrm);
          expect(Util.convertEmuToPixel).not.toHaveBeenCalled();
          expect(table.style.height).toEqual('');
        });

    it(' should not call convertEmuToPixel method of Util when table ' +
        'properties are defined, and contain transforms which is defined ' +
        'and transforms are having extents and extents  contain cx(Width) ' +
        'but undefined Also should not set table height style.', function() {
          extents = {
            'cx': undefined
          };
          transforms.ext = extents;
          tableProperties.xfrm = transforms;
          spyOn(Util, 'convertEmuToPixel');

          handler.decorate().withTransforms(parentDiv, tableProperties.xfrm);
          expect(Util.convertEmuToPixel).not.toHaveBeenCalled();
          expect(table.style.width).toEqual('');
        });


    // fill handler  transforms extents table
    it(' should call handleUsingHTML method of FillHandler when table ' +
        'element and table properties are present and contains fill and ' +
        'transforms having extents', function() {
          extents = {
            'cx': 914400,
            'cy': 914400
          };

          var offsets = {
            'x': 914400,
            'y': 914400
          };

          transforms.ext = extents;
          transforms.off = offsets;
          tableProperties.xfrm = transforms;
          tableFill = {
            'type': 'solidFill'
          };
          tableProperties.fill = tableFill;

          spyOn(fillHandler, 'handleUsingHTML');
          handler.decorate().withFill(table, tableProperties.fill);
          expect(fillHandler.handleUsingHTML).toHaveBeenCalledWith(tableFill,
              table);

        });

    it(' should not call handleUsingHTML method of FillHandler when table ' +
        'element is undefined', function() {
          extents = {
            'cy': 914400
          };
          transforms.ext = extents;
          tableProperties.xfrm = transforms;
          tableFill = {
            'type': 'solidFill'
          };
          tableProperties.fill = tableFill;
          table = undefined;

          spyOn(fillHandler, 'handleUsingHTML');
          handler.decorate().withFill(table, tableProperties.fill);
          expect(fillHandler.handleUsingHTML).not.toHaveBeenCalled();
        });

    it(' should not call handleUsingHTML method of FillHandler when table ' +
        'properties are defined containing fill, but fill is undefined',
        function() {
          extents = {
            'cy': 914400
          };
          transforms.ext = extents;
          tableProperties.xfrm = transforms;
          tableFill = {
            'type': 'solidFill'
          };
          tableProperties.fill = undefined;

          spyOn(fillHandler, 'handleUsingHTML');
          handler.decorate().withFill(table, tableProperties.fill);
          expect(fillHandler.handleUsingHTML).not.toHaveBeenCalled();
        });

    //withNewTableDiv
    it('should call createElement method of document', function() {
      var tableElement = {
        style: {},
        setAttribute: function() {},
        getAttribute: function() {
          return null;
        },
        appendChild: function() {}
      };
      spyOn(document, 'createElement').andReturn(tableElement);
      handler.decorate().withNewTableDiv(visitable.el);
      expect(document.createElement.callCount).toEqual(1);
      expect(document.createElement.calls[0].args[0]).toEqual('TABLE');
    });

    //withNewParentDiv
    it('should call createElement method of document', function() {
      var tableElement = {
        style: {},
        setAttribute: function() {},
        getAttribute: function() {
          return null;
        },
        appendChild: function() {}
      };
      spyOn(document, 'createElement').andReturn(tableElement);
      spyOn(QOWTMarkerUtils, 'addQOWTMarker');
      handler.decorate().withNewParentDiv(visitable.el);
      expect(document.createElement.callCount).toEqual(1);
      expect(document.createElement.calls[0].args[0]).toEqual('DIV');
    });

    it('should set z-order for table', function() {
      table = handler.decorate().withNewParentDiv(visitable.el);
      expect(table.style['z-index']).toEqual('0');
    });

    it('should attach correct css to table parent element', function() {
      table = handler.decorate().withNewParentDiv(visitable.el);
      expect(table.className).toEqual('qowt-point-position-absolute');
    });

    it('should add correct div type to table parent element', function() {
      table = handler.decorate().withNewParentDiv(visitable.el);
      expect(table.className).toEqual('qowt-point-position-absolute');
      expect(table.getAttribute('qowt-divType')).toEqual('table');
    });

    //with Updated Cell Dimensions And Fill
    it('should create height and width fields for every cell and update it ' +
        'with correct values', function() {
          table = handler.decorate().withUpdatedCellDimensionsAndFill(
              visitable.el.elm, visitable.el.tblGrid);
          expect(tableRows[0].elm[0].height).toEqual(914400);
          expect(tableRows[0].elm[0].width).toEqual(914400);

          expect(tableRows[0].elm[1].height).toEqual(914400);
          expect(tableRows[0].elm[1].width).toEqual(123456);

          expect(tableRows[0].elm[2].height).toEqual(914400);
          expect(tableRows[0].elm[2].width).toEqual(789012);

          expect(tableRows[1].elm[0].height).toEqual(123456);
          expect(tableRows[1].elm[0].width).toEqual(914400);

          expect(tableRows[1].elm[1].height).toEqual(123456);
          expect(tableRows[1].elm[1].width).toEqual(123456);

          expect(tableRows[1].elm[2].height).toEqual(123456);
          expect(tableRows[1].elm[2].width).toEqual(789012);

          expect(tableRows[2].elm[0].height).toEqual(789012);
          expect(tableRows[2].elm[0].width).toEqual(914400);

          expect(tableRows[2].elm[1].height).toEqual(789012);
          expect(tableRows[2].elm[1].width).toEqual(123456);

          expect(tableRows[2].elm[2].height).toEqual(789012);
          expect(tableRows[2].elm[2].width).toEqual(789012);
       });

    it('should create height and width fields for cells and update it with ' +
        'correct values except for cell which is vertically merged in other ' +
        'cell and merged cell will have effective height', function() {
          /**
           * 00 01 02
           * 10 11 12
           * 20    22
           *
           * here 21 is merged in 11 so 11 will have rowSpan = 2
           * and 21 will have vMerge = true
           */

          tableRows[1].elm[1].rowSpan = 2;
          tableRows[2].elm[1].vMerge = true;

          table = handler.decorate().withUpdatedCellDimensionsAndFill(
              visitable.el.elm, visitable.el.tblGrid);
          expect(tableRows[0].elm[0].height).toEqual(914400);
          expect(tableRows[0].elm[0].width).toEqual(914400);

          expect(tableRows[0].elm[1].height).toEqual(914400);
          expect(tableRows[0].elm[1].width).toEqual(123456);

          expect(tableRows[0].elm[2].height).toEqual(914400);
          expect(tableRows[0].elm[2].width).toEqual(789012);

          expect(tableRows[1].elm[0].height).toEqual(123456);
          expect(tableRows[1].elm[0].width).toEqual(914400);

          expect(tableRows[1].elm[1].height).toEqual(912468);
          expect(tableRows[1].elm[1].width).toEqual(123456);

          expect(tableRows[1].elm[2].height).toEqual(123456);
          expect(tableRows[1].elm[2].width).toEqual(789012);

          expect(tableRows[2].elm[0].height).toEqual(789012);
          expect(tableRows[2].elm[0].width).toEqual(914400);

          expect(tableRows[2].elm[1].height).toEqual(undefined);
          expect(tableRows[2].elm[1].width).toEqual(undefined);

          expect(tableRows[2].elm[2].height).toEqual(789012);
          expect(tableRows[2].elm[2].width).toEqual(789012);
        });

    it(' should create height and width fields for cells and update it with ' +
        'correct values except for cell which is horizontally merged in ' +
        'other cell and merged cell will have effective width', function() {
          /**
           * 00 01 02
           * 10 11
           * 20 21 22
           *
           * here 12 is merged in 11 so 11 will have gridSpan = 2
           * and 12 will have hMerge = true
           */

          tableRows[1].elm[1].gridSpan = 2;
          tableRows[1].elm[2].hMerge = true;

          table = handler.decorate().withUpdatedCellDimensionsAndFill(
              visitable.el.elm, visitable.el.tblGrid);
          expect(tableRows[0].elm[0].height).toEqual(914400);
          expect(tableRows[0].elm[0].width).toEqual(914400);

          expect(tableRows[0].elm[1].height).toEqual(914400);
          expect(tableRows[0].elm[1].width).toEqual(123456);

          expect(tableRows[0].elm[2].height).toEqual(914400);
          expect(tableRows[0].elm[2].width).toEqual(789012);

          expect(tableRows[1].elm[0].height).toEqual(123456);
          expect(tableRows[1].elm[0].width).toEqual(914400);

          expect(tableRows[1].elm[1].height).toEqual(123456);
          expect(tableRows[1].elm[1].width).toEqual(912468);

          expect(tableRows[1].elm[2].height).toEqual(undefined);
          expect(tableRows[1].elm[2].width).toEqual(undefined);

          expect(tableRows[2].elm[0].height).toEqual(789012);
          expect(tableRows[2].elm[0].width).toEqual(914400);

          expect(tableRows[2].elm[1].height).toEqual(789012);
          expect(tableRows[2].elm[1].width).toEqual(123456);

          expect(tableRows[2].elm[2].height).toEqual(789012);
          expect(tableRows[2].elm[2].width).toEqual(789012);
       });

    it(' should create height and width fields for cells and update it with ' +
        'correct values except for cell which is horizontally and vertically ' +
        'merged in other cell and merged cell will have effective ' +
        'height and width', function() {
          /**
           * 00 01 02
           * 10 11
           * 20
           *
           * 11 will have gridSpan = 2 and rowSpan = 2
           * 12 will have hMerge = true
           * 21 will have hMerge = true
           * 22 will have hMerge = true and vMerge = true
           */
          tableRows[1].elm[1].gridSpan = 2;
          tableRows[1].elm[1].rowSpan = 2;
          tableRows[1].elm[2].hMerge = true;
          tableRows[2].elm[1].hMerge = true;
          tableRows[2].elm[2].hMerge = true;
          tableRows[2].elm[2].vMerge = true;

          table = handler.decorate().withUpdatedCellDimensionsAndFill(
              visitable.el.elm, visitable.el.tblGrid);
          expect(tableRows[0].elm[0].height).toEqual(914400);
          expect(tableRows[0].elm[0].width).toEqual(914400);

          expect(tableRows[0].elm[1].height).toEqual(914400);
          expect(tableRows[0].elm[1].width).toEqual(123456);

          expect(tableRows[0].elm[2].height).toEqual(914400);
          expect(tableRows[0].elm[2].width).toEqual(789012);

          expect(tableRows[1].elm[0].height).toEqual(123456);
          expect(tableRows[1].elm[0].width).toEqual(914400);

          expect(tableRows[1].elm[1].height).toEqual(912468);
          expect(tableRows[1].elm[1].width).toEqual(912468);

          expect(tableRows[1].elm[2].height).toEqual(undefined);
          expect(tableRows[1].elm[2].width).toEqual(undefined);

          expect(tableRows[2].elm[0].height).toEqual(789012);
          expect(tableRows[2].elm[0].width).toEqual(914400);

          expect(tableRows[2].elm[1].height).toEqual(undefined);
          expect(tableRows[2].elm[1].width).toEqual(undefined);

          expect(tableRows[2].elm[2].height).toEqual(undefined);
          expect(tableRows[2].elm[2].width).toEqual(undefined);
        });
  });
});
