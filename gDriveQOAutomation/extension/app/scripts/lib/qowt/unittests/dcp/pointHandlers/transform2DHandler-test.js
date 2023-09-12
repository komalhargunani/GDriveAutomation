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
  'qowtRoot/dcp/pointHandlers/transform2DHandler'

], function(Transform2DHandler) {

  'use strict';

  /**
   * 2D Graphic Transform Handler Test
   */
  describe('2D Graphic Transform Handler Test', function() {
    var shapeDiv = document.createElement('DIV');

    afterEach(function() {
      shapeDiv.style.top = '';
      shapeDiv.style.left = '';
      shapeDiv.style.width = '';
      shapeDiv.style.height = '';
    });

    it('should return undefined if transformation JSON is undefined',
        function() {
          var groupShapeTransformPropertiesBean =
              Transform2DHandler.handle(undefined);

          expect(groupShapeTransformPropertiesBean).toEqual(undefined);
        });

    it('should apply correct css style when its a shape-group not contained ' +
        'in any shape-group, that is, transform with child offset element ' +
        'and groupShapePropertiesBean is undefined', function() {
          var transformItem = {
            'id': '222',
            'off': {
              'x': '12700',
              'y': '25400'
            },
            'ext': {
              'cx': '28575',
              'cy': '38100'
            },
            'chOff': {
              'x': '165100',
              'y': '304800'
            }
          };

          var groupShapeTransformPropertiesBean =
              Transform2DHandler.handle(transformItem, undefined, shapeDiv);

          expect(shapeDiv.style.top).toEqual('2pt');
          expect(shapeDiv.style.left).toEqual('1pt');
          expect(shapeDiv.style.width).toEqual('3px');
          expect(shapeDiv.style.height).toEqual('4px');

          var expectedGroupShapeTransformPropertiesBean = {
            childOffset: {
              x: '165100',
              y: '304800'
            }
          };
          expect(groupShapeTransformPropertiesBean).
              toEqual(expectedGroupShapeTransformPropertiesBean);
        });

    it('should apply correct css style when its a shape-group contained in ' +
        'another shape-group, that is, transform with child offset element ' +
        'and groupShapePropertiesBean is defined', function() {
          var transformItem = {
            'id': '222',
            'off': {
              'x': '127000',
              'y': '254000'
            },
            'ext': {
              'cx': '28575',
              'cy': '38100'
            },
            'chOff': {
              'x': '165100',
              'y': '304800'
            }
          };

          var groupShapePropertiesBean = {
            transform: {
              childOffset: {
                x: 25400,
                y: 38100
              }
            },
            scale: {
              x: 1,
              y: 2
            }
          };

          var groupShapeTransformPropertiesBean = Transform2DHandler.handle(
              transformItem, groupShapePropertiesBean, shapeDiv);

          expect(shapeDiv.style.top).toEqual('34pt');
          expect(shapeDiv.style.left).toEqual('8pt');
          expect(shapeDiv.style.width).toEqual('3px');
          expect(shapeDiv.style.height).toEqual('4px');

          var expectedGroupShapeTransformPropertiesBean = {
            childOffset: {
              x: '165100',
              y: '304800'
            }
          };
          expect(groupShapeTransformPropertiesBean).
              toEqual(expectedGroupShapeTransformPropertiesBean);
        });

    it('should apply correct css style when its a shape not contained in any ' +
        'shape-group, that is, transform without child offset element and ' +
        'groupShapePropertiesBean is undefined', function() {
          var transformItem = {
            'id': '222',
            'off': {
              'x': '12700',
              'y': '25400'
            },
            'ext': {
              'cx': '28575',
              'cy': '38100'
            }
          };

          var groupShapeTransformPropertiesBean = Transform2DHandler.handle(
              transformItem, undefined, shapeDiv);

          expect(shapeDiv.style.top).toEqual('2pt');
          expect(shapeDiv.style.left).toEqual('1pt');
          expect(shapeDiv.style.width).toEqual('3px');
          expect(shapeDiv.style.height).toEqual('4px');
          expect(groupShapeTransformPropertiesBean).toEqual({});
        });

    it('should apply correct css style when its a shape contained in a ' +
        'shape-group,that is, transform without child offset element and ' +
        'groupShapePropertiesBean is defined', function() {
          var transformItem = {
            'id': '222',
            'off': {
              'x': '127000',
              'y': '254000'
            },
            'ext': {
              'cx': '28575',
              'cy': '38100'
            }
          };

          var groupShapePropertiesBean = {
            transform: {
              childOffset: {
                x: 25400,
                y: 38100
              }
            },
            scale: {
              x: 1,
              y: 2
            }
          };

          var groupShapeTransformPropertiesBean = Transform2DHandler.handle(
              transformItem, groupShapePropertiesBean, shapeDiv);

          expect(shapeDiv.style.top).toEqual('34pt');
          expect(shapeDiv.style.left).toEqual('8pt');
          expect(shapeDiv.style.width).toEqual('3px');
          expect(shapeDiv.style.height).toEqual('4px');
          expect(groupShapeTransformPropertiesBean).toEqual({});
        });

    it('should apply correct css style when its a shape having x offset ' +
        'zero, and groupShapePropertiesBean is undefined', function() {
          var transformItem = {
            'id': '222',
            'off': {
              'x': '12700',
              'y': '25400'
            },
            'ext': {
              'cx': 0,
              'cy': 38100
            }
          };

          Transform2DHandler.handle(transformItem, undefined, shapeDiv);

          expect(shapeDiv.style.top).toEqual('2pt');
          expect(shapeDiv.style.left).toEqual('1pt');
          expect(shapeDiv.style.width).toEqual('0px');
          expect(shapeDiv.style.height).toEqual('4px');
        });

    it('should apply correct css style when its a shape having x offset ' +
        'zero, and groupShapePropertiesBean is defined', function() {
          var transformItem = {
            'id': '222',
            'off': {
              'x': '12700',
              'y': '25400'
            },
            'ext': {
              'cx': 0,
              'cy': 38100
            }
          };

          var groupShapePropertiesBean = {
            transform: {
              childOffset: {
                x: 25400,
                y: 38100
              }
            },
            scale: {
              x: 1,
              y: 2
            }
          };

          var groupShapeTransformPropertiesBean = Transform2DHandler.handle(
              transformItem, groupShapePropertiesBean, shapeDiv);

          expect(shapeDiv.style.top).toEqual('-2pt');
          expect(shapeDiv.style.left).toEqual('-1pt');
          expect(shapeDiv.style.width).toEqual('0px');
          expect(shapeDiv.style.height).toEqual('4px');

          expect(groupShapeTransformPropertiesBean).toEqual({});
        });

    it('should apply correct css style when its a shape having y offset zero',
        function() {
          var transformItem = {
            'id': '222',
            'off': {
              'x': '12700',
              'y': '25400'
            },
            'ext': {
              'cx': 28575,
              'cy': 0
            }
          };

          Transform2DHandler.handle(transformItem, undefined, shapeDiv);

          expect(shapeDiv.style.top).toEqual('2pt');
          expect(shapeDiv.style.left).toEqual('1pt');
          expect(shapeDiv.style.width).toEqual('3px');
          expect(shapeDiv.style.height).toEqual('0px');
        });

    it('should not apply any css style when its a shape having y offset ' +
        'undefined', function() {
          var transformItem = {
            'id': '222',
            'off': {
              'x': '12700',
              'y': '25400'
            },
            'ext': {
              'cx': 28575,
              'cy': undefined
            }
          };

          Transform2DHandler.handle(transformItem, undefined, shapeDiv);

          expect(shapeDiv.style.top).not.toEqual('2pt');
          expect(shapeDiv.style.left).not.toEqual('1pt');
          expect(shapeDiv.style.width).not.toEqual('3px');
          expect(shapeDiv.style.height).not.toEqual('0px');
        });

    it('should not apply any css style when its a shape having x offset ' +
        'undefined', function() {
          var transformItem = {
            'id': '222',
            'off': {
              'x': '12700',
              'y': '25400'
            },
            'ext': {
              'cx': undefined,
              'cy': 38100
            }
          };

          Transform2DHandler.handle(transformItem, undefined, shapeDiv);

          expect(shapeDiv.style.top).not.toEqual('2pt');
          expect(shapeDiv.style.left).not.toEqual('1pt');
          expect(shapeDiv.style.width).not.toEqual('0px');
          expect(shapeDiv.style.height).not.toEqual('4px');
        });
  });
});
