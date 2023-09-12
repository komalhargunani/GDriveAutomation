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
 * ShapeProperties Handler Test
 */

define([
  'qowtRoot/dcp/pointHandlers/transform2DHandler',
  'qowtRoot/models/point',
  'qowtRoot/dcp/pointHandlers/shapePropertiesHandler'],
function(Transform2D, PointModel, ShapePropertiesHandler) {

  'use strict';

  describe('Test ShapeProperties Handler', function() {
    var _shapePropertiesHandler = ShapePropertiesHandler;
    var _groupShapePropertiesBean;
    var _shapeResponseObj;

    beforeEach(function() {
      _shapeResponseObj = {};

      _groupShapePropertiesBean =
          {
            scale: {
              x: 2,
              y: 3
            }
          };
    });

    it('should do nothing when shapeProperties is undefined', function() {
      _shapeResponseObj.spPr = undefined;
      var shapeCanvas =
          {
            height: '',
            width: ''
          };

      spyOn(Transform2D, 'handle');

      _shapePropertiesHandler.handle(_shapeResponseObj, shapeCanvas,
          _groupShapePropertiesBean);

      expect(Transform2D.handle).not.toHaveBeenCalled();
      expect('').toEqual(shapeCanvas.width);
      expect('').toEqual(shapeCanvas.height);
    });

    it('should call Transform2D handler', function() {
      var shapeTransformItem =
          {
            'ext': {
              'cx': 914400,
              'cy': 457200
            }
          };
      _shapeResponseObj.spPr =
          {
            'xfrm': shapeTransformItem,
            'geom': {
              'prst': 88
            }
          };

      var shapeDiv = document.createElement('DIV');

      spyOn(Transform2D, 'handle');

      _shapePropertiesHandler.handle(_shapeResponseObj, shapeDiv,
          _groupShapePropertiesBean);

      var shapeCanvas = shapeDiv.getElementsByTagName('canvas')[0];

      expect(Transform2D.handle).toHaveBeenCalledWith(shapeTransformItem,
          _groupShapePropertiesBean, shapeDiv);
      expect(shapeCanvas).toEqual(undefined);
    });

    it('should store the shapeProperties.xfrm in the point model',
       function() {

         PointModel.shapeDimensions = {};

         var shapeTransformItem =
         {
           'ext': {
             'cx': 914400,
             'cy': 457200
           },
           'off': {
             'x': '2133601',
             'y': '838200'
           }
         };

         _shapeResponseObj.spPr =
         {
           'xfrm': shapeTransformItem,
           'geom': {
             'prst': 88
           }
         };

         var shapeDiv = document.createElement('DIV');
         _shapePropertiesHandler.handle(_shapeResponseObj, shapeDiv,
             undefined);
         expect(PointModel.shapeDimensions).toEqual(shapeTransformItem);
       });

    it('should call handler for Transform2D handler appropriately when ' +
        'groupShapePropertiesBean is undefined', function() {
          var shapeTransformItem = {
            'ext': {
              'cx': 914400,
              'cy': 457200
            }
          };
          _shapeResponseObj.spPr = {
            'xfrm': shapeTransformItem
          };
          var shapeDiv = document.createElement('DIV');

          spyOn(Transform2D, 'handle');

          _shapePropertiesHandler.handle(_shapeResponseObj, shapeDiv,
              undefined);

          expect(Transform2D.handle).
              toHaveBeenCalledWith(shapeTransformItem, undefined, shapeDiv);
        });

    it('should scale vertically if flipV property of xfrm is true',
       function() {
         _shapeResponseObj.spPr =
         {
           'xfrm': {
             ext: {
               'cx': 3008313,
               'cy': 4691063
             },
             'flipV': true
           },
           'geom': {
             'prst': 11
           }
         };
         var shapeCanvas =
         {
           appendChild: function() {
           },
           height: '',
           width: '',
           style: {'-webkit-transform': ''}
         };

         spyOn(Transform2D, 'handle');

         _shapePropertiesHandler.handle(_shapeResponseObj, shapeCanvas);

         expect(shapeCanvas.style['-webkit-transform']).
             toEqual('scale(1,-1)');
       });

    it('should scale horizontally if flipH property of xfrm is true',
       function() {
         _shapeResponseObj.spPr =
         {
           'xfrm': {
             ext: {
               'cx': 3008313,
               'cy': 4691063
             },
             'flipH': true
           },
           'geom': {
             'prst': 11
           }
         };
         var shapeCanvas =
         {
           appendChild: function() {
           },
           height: '',
           width: '',
           style: {'-webkit-transform': ''}
         };

         spyOn(Transform2D, 'handle');

         _shapePropertiesHandler.handle(_shapeResponseObj, shapeCanvas);

         expect(shapeCanvas.style['-webkit-transform']).
             toEqual('scale(-1,1)');
       });

    it('should not scale horizontally if flipH property of xfrm is false',
       function() {
         _shapeResponseObj.spPr =
         {
           'xfrm': {
             ext: {
               'cx': 3008313,
               'cy': 4691063
             },
             'flipH': false
           },
           'geom': {
             'prst': 11
           }
         };
         var shapeCanvas =
         {
           appendChild: function() {
           },
           height: '',
           width: '',
           style: {'-webkit-transform': ''}
         };

         spyOn(Transform2D, 'handle');

         _shapePropertiesHandler.handle(_shapeResponseObj, shapeCanvas);

         expect(shapeCanvas.style['-webkit-transform']).toEqual('scale(1,1)');
       });

    it('should not scale vertically if flipV property of xfrm is false',
       function() {
         _shapeResponseObj.spPr =
         {
           'xfrm': {
             ext: {
               'cx': 3008313,
               'cy': 4691063
             },
             'flipV': false
           },
           'geom': {
             'prst': 11
           }
         };
         var shapeCanvas =
         {
           appendChild: function() {
           },
           height: '',
           width: '',
           style: {'-webkit-transform': ''}
         };

         spyOn(Transform2D, 'handle');

         _shapePropertiesHandler.handle(_shapeResponseObj, shapeCanvas);

         expect(shapeCanvas.style['-webkit-transform']).toEqual('scale(1,1)');
       });

    it('should not change outline width, when ln property is present but ' +
        'width is undefined, and lnRef style is present', function() {
          _shapeResponseObj.spPr = {
            xfrm: {
              ext: {
                cx: 3008313,
                cy: 4691063
              },
              flipV: false
            },
            geom: {
              prst: 11
            },
            ln: {
              fill: {
                type: 'solidFill',
                color: {
                  type: 'srgbClr',
                  clr: '#ff0000',
                  effects: {}
                }
              }
            }
          };

          _shapeResponseObj.style = {
            lnRef: {}
          };

          var shapeCanvas = {
            appendChild: function() {
            },
            height: '',
            width: '',
            style: {'-webkit-transform': ''}
          };

          spyOn(Transform2D, 'handle');

          _shapePropertiesHandler.handle(_shapeResponseObj, shapeCanvas);

          expect(_shapeResponseObj.spPr.ln.w).toEqual(undefined);
        });

    it('should make outline width as 1px, when ln property is present but ' +
        'width is undefined, and shape style is absent', function() {
          _shapeResponseObj.spPr = {
            xfrm: {
              ext: {
                cx: 3008313,
                cy: 4691063
              },
              flipV: false
            },
            geom: {
              prst: 11
            },
            ln: {
              fill: {
                type: 'solidFill',
                color: {
                  type: 'srgbClr',
                  clr: '#ff0000',
                  effects: {}
                }
              }
            }
          };

          var shapeCanvas = {
            appendChild: function() {
            },
            height: '',
            width: '',
            style: {'-webkit-transform': ''}
          };

          spyOn(Transform2D, 'handle');

          _shapePropertiesHandler.handle(_shapeResponseObj, shapeCanvas);

          expect(_shapeResponseObj.spPr.ln.w).toEqual(5500);
        });

    it('should make outline width as 1px, when ln property is present but ' +
        'width is undefined and line-ref style is absent', function() {
          _shapeResponseObj.spPr = {
            xfrm: {
              ext: {
                cx: 3008313,
                cy: 4691063
              },
              flipV: false
            },
            geom: {
              prst: 11
            },
            ln: {
              fill: {
                type: 'solidFill',
                color: {
                  type: 'srgbClr',
                  clr: '#ff0000',
                  effects: {}
                }
              }
            }
          };

          _shapeResponseObj.style = {
            lnRef: undefined
          };

          var shapeCanvas = {
            appendChild: function() {
            },
            height: '',
            width: '',
            style: {'-webkit-transform': ''}
          };

          spyOn(Transform2D, 'handle');

          _shapePropertiesHandler.handle(_shapeResponseObj, shapeCanvas);

          expect(_shapeResponseObj.spPr.ln.w).toEqual(5500);
        });

    it('should make outline width as 1px, when width is less than 5500',
       function() {
         _shapeResponseObj.spPr = {
           xfrm: {
             ext: {
               cx: 3008313,
               cy: 4691063
             },
             flipV: false
           },
           geom: {
             prst: 11
           },
           ln: {
             w: 5000,
             fill: {
               type: 'solidFill',
               color: {
                 type: 'srgbClr',
                 clr: '#ff0000',
                 effects: {}
               }
             }
           }
         };

         var shapeCanvas = {
           appendChild: function() {
           },
           height: '',
           width: '',
           style: {'-webkit-transform': ''}
         };

         spyOn(Transform2D, 'handle');

         _shapePropertiesHandler.handle(_shapeResponseObj, shapeCanvas);

         expect(_shapeResponseObj.spPr.ln.w).toEqual(5500);
       });
  });
});
