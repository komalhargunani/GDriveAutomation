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
 * Shape handler Test
 */
define([
  'qowtRoot/dcp/decorators/shapeDecorator',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/dcp/pointHandlers/shapeHandler',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/widgets/shape/shape'
], function(ShapeDecorator,
            UnittestUtils,
            Shape,
            ThemeStyleRefManager,
            PlaceHolderPropertiesManager,
            QOWTMarkerUtils,
            ShapeWidget) {

  'use strict';

  describe('Shape handler Test', function() {
    var kSHAPE_ID = '123';
    var shapeHandler, parentDiv, v;
    var _testUtils = UnittestUtils;
    var _shapeDiv = _testUtils.createTestAppendArea();

    beforeEach(function() {
      shapeHandler = Shape;
      parentDiv = {
        appendChild: function() {}
      };
      _shapeDiv = _testUtils.createTestAppendArea();
      _shapeDiv.id = kSHAPE_ID;
      v = {
        node: parentDiv,
        el: {
          etp: 'sp',
          eid: kSHAPE_ID,
          spPr: {},
          nvSpPr: {}
        }
      };
    });

    afterEach(function() {
      shapeHandler.postTraverse();
      _testUtils.removeTestAppendArea();
    });

    it('should reset shape styles for every shape', function() {
      spyOn(ThemeStyleRefManager, 'resetShapeStyle');
      shapeHandler.visit(v);
      shapeHandler.postTraverse();
      expect(ThemeStyleRefManager.resetShapeStyle).toHaveBeenCalled();
    });

    it('should not decorate shapeDiv if placeholder type is ' +
        'grapicFrameElement (Chart, Table and Smart Art) ', function() {
          v.el.nvSpPr.phTyp = 'tbl';
          var shapeDecorator = {
            decorate: function() {
            }
          };
          var shapeWidget = {
            getWidgetElement: function() {
            }
          };
          spyOn(ShapeWidget, 'create').andReturn(shapeWidget);
          spyOn(ShapeDecorator, 'create').andReturn(shapeDecorator);
          spyOn(shapeDecorator, 'decorate');
          spyOn(shapeWidget, 'getWidgetElement').andReturn(_shapeDiv);

          shapeHandler.visit(v);

          expect(shapeDecorator.decorate).not.toHaveBeenCalled();
       });

    it('should set placeholder type and index as attributes', function() {
      v.el.nvSpPr.phTyp = 'body';
      v.el.nvSpPr.phIdx = '1';
      var shapeDecorator = {
        decorate: function() {
        }
      };
      var shapeWidget = {
        getWidgetElement: function() {
          return _shapeDiv;
        },
        setJson: function() {
        }
      };
      spyOn(ShapeWidget, 'create').andReturn(shapeWidget);
      spyOn(ShapeDecorator, 'create').andReturn(shapeDecorator);
      spyOn(shapeDecorator, 'decorate');
      shapeHandler.visit(v);
      expect(_shapeDiv.getAttribute('placeholder-type')).toEqual('body');
      expect(_shapeDiv.getAttribute('placeholder-index')).toEqual('1');
    });

    describe('verifying Shape-handler input', function() {
      it('should not create shape div when Shape JSON is undefined',
          function() {
            v = undefined;
            var shapeDiv = shapeHandler.visit(v);

            expect(shapeDiv).toEqual(undefined);
          });

      it('should not create shape div when element in shape JSON is undefined',
          function() {
            v.el = undefined;
            var shapeDiv = shapeHandler.visit(v);

            expect(shapeDiv).toEqual(undefined);
          });

      it('should not create shape div when element-type in shape JSON is ' +
          'undefined', function() {
            v.el.etp = undefined;
            var shapeDiv = shapeHandler.visit(v);

            expect(shapeDiv).toEqual(undefined);
          });

      it('should not create shape div when element-id in shape JSON is ' +
          'undefined', function() {
            v.el.eid = undefined;
            var shapeDiv = shapeHandler.visit(v);

            expect(shapeDiv).toEqual(undefined);
          });

      it('should not create shape div when element-type in shape JSON is not ' +
          '-sp- or -pic-', function() {
            v.el.etp = 'xxx';
            var shapeDiv = shapeHandler.visit(v);

            expect(shapeDiv).toEqual(undefined);
          });

      it('should set appropriate prstDash for non place holder shapes',
          function() {
            v.el.spPr = {
              ln: {}
            };
            shapeHandler.visit(v);

            expect(v.el.spPr.ln.prstDash).toEqual('solid');
          });

      it('should cache shape JSON correctly', function() {
        parentDiv.id = '111';
        var shapeNode = shapeHandler.visit(v);

        expect(shapeNode.shapeJson).toEqual(v.el);
      });

      it('should merge cascaded and explicit shape properties into shape JSON' +
          ' correctly', function() {
           v.el.nvSpPr = {
             phTyp: 'title'
           };
           var resolvedShapePr = {
             xfrm: {
               ext: {
                 cx: 952500,
                 cy: 952500
               },
               off: {
                 x: 100,
                 y: 100
               }
             }
           };
           v.el.spPr = {
             xfrm: {
               ext: {
                 cx: 952500,
                 cy: 952500
               },
               off: {
                 x: 200,
                 y: 200
               }
             }
           };
           spyOn(PlaceHolderPropertiesManager, 'getResolvedShapeProperties').
           andReturn(resolvedShapePr);

           var shapeNode = shapeHandler.visit(v);

           expect(shapeNode.shapeJson.spPr.xfrm.off.x).toEqual(200);
         });
    });

    describe('Tests for Picture handler', function() {
      beforeEach(function() {
        v.el.etp = 'pic';
        v.el.elm = [
          {
            etp: 'img',
            hgt: '10',
            wdt: '20'
          }
        ];

        v.el.spPr = {
          xfrm: {
            ext: {
              cx: 952500,
              cy: 952500
            },
            off: {
              'x': '2133601',
              'y': '838200'
            },
            rot: 30
          }
        };
      });

      it('should set the eid for the image element', function() {
        shapeHandler.visit(v);
        expect(v.el.elm[0].eid).toEqual(kSHAPE_ID + 'img');
      });

      it('should not set the eid for the image element, when not a Picture',
          function() {
            v.el.etp = 'sp';
            shapeHandler.visit(v);
            expect(v.el.elm[0].eid).toEqual(undefined);
          });

      it('should not set the eid for the image element, when no -elm- defined',
          function() {
            v.el.elm = undefined;
            shapeHandler.visit(v);
            expect(v.el.elm).toEqual(undefined);
          });

      it('should not set the eid for the image element, when empty -elm-',
          function() {
            v.el.elm = [];
            shapeHandler.visit(v);
            expect(v.el.elm[0]).toEqual(undefined);
          });

      it('should set rotation property true if rotation is not undefined and ' +
          'not equal to zero', function() {
            shapeHandler.visit(v);
            expect(v.el.elm[0].rotation).toEqual(true);
          });

      it('should set rotation property false if rotation is undefined',
          function() {
            v.el.spPr.xfrm.rot = undefined;

            shapeHandler.visit(v);
            expect(v.el.elm[0].rotation).toEqual(false);
          });

      it('should set width and height of shapeDiv to image instead of image ' +
          'width and height', function() {

            shapeHandler.visit(v);
            expect(v.el.elm[0].wdt).toEqual(100);
            expect(v.el.elm[0].hgt).toEqual(100);
          });

      it('should set width and height of shapeDiv to image, when image within' +
          ' a group shape', function() {

            v.el.grpPrp = {
              scale: {
                x: 0.5,
                y: 0.5
              },
              transform: {
                childOffset: {
                  x: '1538106',
                  // 161.48 Px
                  y: '1401704' //147.16 Px
                }
              }
            };

            shapeHandler.visit(v);
            expect(v.el.elm[0].wdt).toEqual(50);
            expect(v.el.elm[0].hgt).toEqual(50);
          });
    });

    describe('Tests related to Shape hyperlink ', function() {

      it('should set hyperlink related attributes in shapeDiv if hyperlink is' +
          ' applied to shape', function() {
            v.el.lnk = 'http://www.samplelink.com/';
            spyOn(QOWTMarkerUtils, 'addQOWTMarker');
            shapeHandler.visit(v);
            expect(QOWTMarkerUtils.addQOWTMarker).toHaveBeenCalled();
          });

      it('should not set hyperlink related attributes in shapeDiv if ' +
          'hyperlink is not applied to shape', function() {
            v.el.lnk = '';
            spyOn(QOWTMarkerUtils, 'addQOWTMarker');
            shapeHandler.visit(v);
            expect(QOWTMarkerUtils.addQOWTMarker).not.toHaveBeenCalledWith(
                _shapeDiv, 'hyperlink', '');
          });
    });

  });
});
