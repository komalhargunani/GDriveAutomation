/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/dcp/decorators/groupShapeDecorator',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/dcp/pointHandlers/transform2DHandler'
], function(GroupShapeDecorator,
            UnittestUtils,
            QOWTMarkerUtils,
            Transform2D) {

  'use strict';

  describe('Group Shape Decorator Test', function() {
    var _groupShapeDecorator = GroupShapeDecorator.create();

    var _testAppendArea = UnittestUtils.createTestAppendArea();

    describe('decorate withNewDiv', function() {
      it('should decorate with a new div for group shape', function() {
        var newId = 'someId';
        var idFromXML = '123xml';
        var nonVisualShapeProperties = {
          shapeId: idFromXML
        };
        spyOn(QOWTMarkerUtils, 'addQOWTMarker');
        var someGroupShapeDiv =
            _groupShapeDecorator.decorate().withNewDiv(
                newId, nonVisualShapeProperties).getDecoratedDiv();

        expect(someGroupShapeDiv.nodeName).toEqual('DIV');
        expect(someGroupShapeDiv.id).toEqual(newId);
        expect(someGroupShapeDiv.getAttribute('qowt-divType')).toEqual(
            'groupShape');
        expect(QOWTMarkerUtils.addQOWTMarker).toHaveBeenCalledWith(
            someGroupShapeDiv, 'shape-Id', nonVisualShapeProperties.shapeId);
        expect(someGroupShapeDiv.style.position).toEqual('absolute');
      });

      it('should not display object when it is hidden', function() {
        var idFromXML = '123xml';
        var nonVisualShapeProperties = {
          isHidden: true,
          shapeId: idFromXML
        };
        var newId = 'someId';
        var someGroupShapeDiv = _groupShapeDecorator.decorate().withNewDiv(
            newId, nonVisualShapeProperties).getDecoratedDiv();
        expect(someGroupShapeDiv.style.display).toEqual('none');
      });

      it('should display object when not hidden', function() {
        var idFromXML = '123xml';
        var nonVisualShapeProperties = {
          shapeId: idFromXML
        };
        var newId = 'someId';
        var someGroupShapeDiv = _groupShapeDecorator.decorate().withNewDiv(
            newId, nonVisualShapeProperties).getDecoratedDiv();
        expect(someGroupShapeDiv.style.display).not.toBe('none');
      });
    });

    describe('decorate withGroupShapeProperties', function() {
      var groupShapeObj = {};
      var shape1, shape2;

      beforeEach(function() {
        groupShapeObj.grpSpPr = {
          xfrm: {
            off: {
              x: '1',
              y: '2'
            },
            ext: {
              cx: '11',
              cy: '22'
            },
            chOff: {
              x: '10',
              y: '20'
            },
            chExt: {
              cx: '11',
              cy: '11'
            },
            rot: '90'
          }
        };

        groupShapeObj.grpPrp = undefined;

        shape1 = {
          etp: 'sp',
          eid: '1001'
        };

        shape2 = {
          etp: 'sp',
          eid: '1002'
        };

        groupShapeObj.elm = [
          shape1,
          shape2
        ];
      });

      it('should not call Transfrom2D Handler when grpSpPr is undefined',
          function() {
            var someGroupShapeDiv = _testAppendArea;

            var groupShapeObj = {
              grpSpPr: undefined
            };

            spyOn(Transform2D, 'handle');

            _groupShapeDecorator.decorate(someGroupShapeDiv).
                withGroupShapeProperties(groupShapeObj);

            expect(Transform2D.handle).not.toHaveBeenCalled();
          });

      it('should decorate group shape rotation appropriately,when ' +
          'non-nested group-shape', function() {
            var someGroupShapeDiv = _testAppendArea;

            var expectedStyle = 'rotate(90deg) scale(1, 1)';

            _groupShapeDecorator.decorate(someGroupShapeDiv).
                withGroupShapeProperties(groupShapeObj);

            expect(someGroupShapeDiv.style['-webkit-transform']).toEqual(
                expectedStyle);
          });

      it('should not flip group shape when vertical flip is false', function() {
        var someGroupShapeDiv = _testAppendArea;

        groupShapeObj.grpSpPr.xfrm.flipV = false;
        groupShapeObj.grpSpPr.xfrm.rot = '0';

        var expectedStyle = 'scale(1, 1)';

        _groupShapeDecorator.decorate(someGroupShapeDiv).
            withGroupShapeProperties(groupShapeObj);

        expect(someGroupShapeDiv.style['-webkit-transform']).toEqual(
            expectedStyle);
      });

      it('should not flip group shape when horizontal flip is false',
          function() {
            var someGroupShapeDiv = _testAppendArea;

            var expectedStyle = 'scale(1, 1)';
            groupShapeObj.grpSpPr.xfrm.flipH = false;
            groupShapeObj.grpSpPr.xfrm.rot = '0';

            _groupShapeDecorator.decorate(someGroupShapeDiv).
                withGroupShapeProperties(groupShapeObj);

            expect(someGroupShapeDiv.style['-webkit-transform']).toEqual(
                expectedStyle);
          });

      it('should flip group shape when vertical and horizontal flip is true',
          function() {
            var someGroupShapeDiv = _testAppendArea;

            groupShapeObj.grpSpPr.xfrm.flipH = true;
            groupShapeObj.grpSpPr.xfrm.flipV = true;
            groupShapeObj.grpSpPr.xfrm.rot = '0';

            var expectedStyle = 'scale(-1, -1)';

            _groupShapeDecorator.decorate(someGroupShapeDiv).
                withGroupShapeProperties(groupShapeObj);

            expect(someGroupShapeDiv.style['-webkit-transform']).
                toEqual(expectedStyle);
          });

      it('should set group-properties of the group-shape elements and create ' +
          'shape appropriately, when non-nested group-shape', function() {
            var someGroupShapeDiv = _testAppendArea;

            _groupShapeDecorator.decorate(someGroupShapeDiv).
                withGroupShapeProperties(groupShapeObj);

            var expectedShape1 = {
              etp: 'sp',
              eid: '1001',
              grpPrp: {
                transform: {
                  childOffset: {
                    x: '10',
                    y: '20'
                  }
                },
                scale: {
                  x: 1,
                  y: 2
                }
              }
            };
            expect(shape1).toEqual(expectedShape1);

            var expectedShape2 = {
              etp: 'sp',
              eid: '1002',
              grpPrp: {
                transform: {
                  childOffset: {
                    x: '10',
                    y: '20'
                  }
                },
                scale: {
                  x: 1,
                  y: 2
                }
              }
            };
            expect(shape2).toEqual(expectedShape2);
          });

      it('should set group-properties of the group-shape elements and create ' +
          'shape appropriately, when nested group-shape', function() {
            var someGroupShapeDiv = _testAppendArea;

            groupShapeObj.grpPrp = {
              transform: {
                childOffset: {
                  x: '101',
                  y: '202'
                }
              },
              scale: {
                x: 1,
                y: 2
              }
            };

            _groupShapeDecorator.decorate(someGroupShapeDiv).
                withGroupShapeProperties(groupShapeObj);

            var expectedShape1 = {
              etp: 'sp',
              eid: '1001',
              grpPrp: {
                transform: {
                  childOffset: {
                    x: '10',
                    y: '20'
                  }
                },
                scale: {
                  x: 1,
                  y: 4 // v.el.grpSpPr.xfrm.ext.cy * v.el.grpSpPr.xfrm.chExt.cy
                }
              }
            };
            expect(shape1).toEqual(expectedShape1);

            var expectedShape2 = {
              etp: 'sp',
              eid: '1002',
              grpPrp: {
                transform: {
                  childOffset: {
                    x: '10',
                    y: '20'
                  }
                },
                scale: {
                  x: 1,
                  y: 4 // v.el.grpSpPr.xfrm.ext.cy * v.el.grpSpPr.xfrm.chExt.cy
                }
              }
            };
            expect(shape2).toEqual(expectedShape2);
          });

      it('should set the parents group fill property, if the nested ' +
          'groupshape has grpFill set as its fill property.', function() {
            var grpShpNested = {
              etp: 'grpsp',
              eid: '1003',
              grpSpPr: {
                fill: {
                  type: 'grpFill'
                }
              }
            };
            grpShpNested.elm = [
              shape1,
              shape2
            ];
            var shape3 = {
              etp: 'sp',
              eid: '1004',
              spPr: {
                fill: {
                  type: 'grpFill'
                }
              }
            };
            var grpShpObject = {
              etp: 'grpsp',
              eid: '1005',
              grpSpPr: {
                fill: {
                  type: 'grpFill'
                }
              },
              grpPrp: {
                fill: {
                  type: 'solidFill'
                }
              }
            };
            grpShpObject.elm = [
              grpShpNested,
              shape3
            ];
            var someGroupShapeDiv = _testAppendArea;
            _groupShapeDecorator.decorate(someGroupShapeDiv).
                withGroupShapeProperties(grpShpObject);
            expect(grpShpNested.grpPrp.fill.type).toEqual('solidFill');
          });
    });

    describe('decorate getDecoratedDiv', function() {
      it('should return the decorated div', function() {
        var someGroupShapeDiv = _testAppendArea;

        var expectedGroupShapeDiv = _groupShapeDecorator.decorate(
            someGroupShapeDiv).getDecoratedDiv();

        expect(expectedGroupShapeDiv).toEqual(someGroupShapeDiv);
      });
    });
  });
});
