// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview test cases for modifyShapeFill file
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/commands/drawing/modifyShapeFill',
  'qowtRoot/unittests/commands/quickpoint/edit/editCommandStandardAsserts',
  'qowtRoot/widgets/shape/shape',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/unittests/__unittest-util'
], function(ModifyShapeFill, EditCommandStandardAsserts,
            ShapeWidget, PlaceHolderPropertiesManager,
            SlidesContainer, UnitTestUtils) {
  'use strict';

  var _context, _cmd, _shapeWidget, shapeNode, shapeJson;

  beforeEach(function() {
    _context = {
      id: '111',
      action: 'modifyShapeFillColor',
      command: {
        name: 'modShapeFill',
        eid: '111',
        fill: {
          'color': {
            'clr': '#ffff00',
            'effects': [
              {
                'name': 'alpha',
                'value': 100000
              }
            ],
            'type': 'srgbClr'
          },
          'type': 'solidFill'
        },
        sn: 1
      }
    };

    shapeJson = {
      nvSpPr: {
        phTyp: 'title',
        phIdx: 0
      },
      spPr: {
        fill: {
          'color': {
            'clr': '#ffff00',
            'effects': [
              {
                'name': 'alpha',
                'value': 100000
              }
            ],
            'type': 'srgbClr'
          },
          'type': 'solidFill'
        }
      }
    };
    shapeNode = UnitTestUtils.createTestAppendArea();
    shapeNode.shapeJson = shapeJson;

    // Mock a shape widget
    _shapeWidget = {
      isPlaceholderShape: function() {
        return true;
      },
      setFill: function() {
      },
      getFill: function() {
      },
      getWidgetElement: function() {
      },
      getJson: function() {
      },
      setJson: function() {
      },
      updatePlaceholderProperties: function() {
      }
    };

    spyOn(ShapeWidget, 'create').andReturn(_shapeWidget);
    spyOn(_shapeWidget, 'setFill');
    spyOn(_shapeWidget, 'getFill');
    spyOn(_shapeWidget, 'setJson');
    spyOn(_shapeWidget, 'getJson').andReturn(shapeJson);
    spyOn(_shapeWidget, 'getWidgetElement').andReturn(shapeNode);

    var dummySlideWidget = {
      getSlideIndex: function() {
        return 1;
      },
      getLayoutId: function() {
        return 1;
      }
    };
    spyOn(SlidesContainer, 'getCurrentSlideWidget').andReturn(dummySlideWidget);

    _cmd = ModifyShapeFill.create(_context);
  });

  afterEach(function() {
    UnitTestUtils.removeTestAppendArea();
    shapeNode = undefined;
    _cmd = undefined;
  });

  describe('modify-shape-fill command test', function() {

    it('should return modifyShapeFill command', function() {
      expect(_cmd.name).toBe('modShapeFill');
      expect(_cmd.isOptimistic()).toBeTruthy();
      expect(_cmd.callsService()).toBeTruthy();
    });

    describe('dcpData', function() {

      it('must be implemented', function() {
        expect(_cmd.dcpData).toBeDefined();
        expect(typeof(_cmd.dcpData)).toBe('function');
      });
      it('must return a JSON object', function() {
        var data = _cmd.dcpData();
        expect(data).toBeDefined();
        expect(typeof(data)).toBe('object');
      });
      it('must define the name property', function() {
        var data = _cmd.dcpData();
        expect(data.name).toBe('modShapeFill');
      });
      it('must define the fill property', function() {
        var data = _cmd.dcpData();
        expect(data.fill).toBeDefined();
        expect(typeof(data.fill)).toBe('object');
      });
      it('must define the sn property', function() {
        var data = _cmd.dcpData();
        expect(data.sn).toBeDefined();
        expect(typeof(data.sn)).toBe('number');
      });
    });

    it('should call function setFill for modifyShapeFillColor action',
        function() {
          _context.action = 'modifyShapeFillColor';
          _cmd = ModifyShapeFill.create(_context);
          _cmd.changeHtml();

          expect(_shapeWidget.setFill).toHaveBeenCalled();
        });

    describe('EditCommandStandardAsserts', function() {

      it('standard point edit command asserts', function() {
        EditCommandStandardAsserts.standard(_cmd);
      });
      it('should pass standard optimistic asserts (callService)', function() {
        EditCommandStandardAsserts.asOptimistic(_cmd, true);
        EditCommandStandardAsserts.asCallsService(_cmd, true);
      });
    });

    describe('Modify shape fill undo initiated command', function() {
      it('should pass standard edit command assert for undo initiated command',
          function() {
            _context.command.type = 'dcpCommand';
            _cmd = ModifyShapeFill.create(_context);

            EditCommandStandardAsserts.standard(_cmd);
            EditCommandStandardAsserts.asCallsService(_cmd, false);
            EditCommandStandardAsserts.asOptimistic(_cmd, true, false);
          });

      it('should update placeholder shape fill correctly', function() {
        _context.command.type = 'dcpCommand';
        _context.command.fill = undefined;
        var resolvedSpPr = {
          fill: {
            'color': {
              'clr': '#ffff00',
              'effects': [
                {
                  'name': 'alpha',
                  'value': 100000
                }
              ],
              'type': 'srgbClr'
            },
            'type': 'solidFill'
          }
        };

        spyOn(PlaceHolderPropertiesManager, 'getResolvedShapeProperties').
            andReturn(resolvedSpPr);
        _cmd = ModifyShapeFill.create(_context);

        _cmd.changeHtml();

        expect(SlidesContainer.getCurrentSlideWidget).
            toHaveBeenCalled();
        expect(PlaceHolderPropertiesManager.getResolvedShapeProperties).
            toHaveBeenCalled();
      });
    });
  });
});
