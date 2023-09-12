define([
  'qowtRoot/drawing/geometry/canvasPainter',
  'qowtRoot/models/point',
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/dcp/decorators/outlineDecorator',
  'qowtRoot/variants/utils/resourceLocator'
], function(CanvasPainter, PointModel, FillHandler, OutlineDecorator,
            ResourceLocator) {

  'use strict';

  describe('Canvas Painter Test', function() {
    var canvasPainter = CanvasPainter;

    it('should test behaviour when alpha is present but color is not present',
        function() {
          PointModel.SlideLayoutId = '111layout';
          PointModel.SlideMasterId = '111master';
          PointModel.slideLayoutMap[PointModel.SlideLayoutId] =
              {clrMap: undefined};
          PointModel.masterLayoutMap[PointModel.MasterSlideId] =
              {clrMap: undefined};

          var canvas = {
            getContext: function() {},
            style: {
              'border-style': '',
              'border-width': '',
              'border-color': '',
              left: 5,
              top: 5
            }
          };

          var paths = [[{
            'name': 'lineTo',
            'args': [10, 20]
          }, {
            'name': 'moveTo',
            'args': [15, 25]
          }, {
            'name': 'closePath',
            'args': []
          }],
          [{
            'name': 'lineTo',
            'args': [10, 20]
          }, {
            'name': 'moveTo',
            'args': [15, 25]
          }]];

          paths.topMargin = 0;
          paths.leftMargin = 0;
          paths.rightMargin = 0;
          paths.bottomMargin = 0;

          var fillColorBean = {
            type: 'solidFill',
            color: {
              type: 'schemeClr',
              scheme: 'accent1',
              effects: {}
            },
            outlineFill: {}
          };

          var context = {
            fillStyle: '',
            fill: function() {},
            translate: function() {}
          };

          var shapeTransformExtents = {
            cx: 9525,
            cy: 9525
          };

          spyOn(canvas, 'getContext').andReturn(context);
          spyOn(context, 'fill');
          spyOn(context, 'translate');

          canvasPainter.paintCanvas(canvas, paths, fillColorBean,
              shapeTransformExtents);

          expect(context.fillStyle).not.toEqual('rgba(255,255,255,0.7)');

          expect(context.fill).not.toHaveBeenCalled();
        });

    describe('Canvas Painter Test: Fill and Stroke attributes in path',
        function() {
          var _fillHandler, _outlineHandler;
          var _fillColorBean, _paths, _context, _canvas, _image;

          beforeEach(function() {
            _outlineHandler = {
              handleUsingHTML: function() {}
            };
            _fillHandler = FillHandler;

            _fillColorBean = {
              fill: 'some fill properties',
              outlineFill: 'some outline fill properties'
            };

            _paths = [[{
              'name': 'lineTo',
              'args': [10, 20]
            }, {
              'name': 'moveTo',
              'args': [15, 25]
            }, {
              'name': 'closePath',
              'args': []
            }]];

            _context = {
              strokeStyle: '',
              fillStyle: '',
              lineWidth: 0,
              globalCompositeOperation: '',
              fill: function() {},
              setLineDash: function() {},
              stroke: function() {},
              lineTo: function() {},
              moveTo: function() {},
              closePath: function() {},
              translate: function() {},
              drawImage: function() {},
              restore: function() {}
            };

            spyOn(OutlineDecorator, 'create').andReturn(_outlineHandler);

            spyOn(_outlineHandler, 'handleUsingHTML');

            _canvas = {
              getContext: function() {
                return _context;
              },
              style: { 'border-style': '', 'border-width': '',
                'border-color': '' }
            };

            _image = {
              addEventListener: function() {
              },
              src: '',
              width: 100,
              height: 100
            };

          });

          it('should call fill handler and context stroke, when path-fill is ' +
              '-not none-, and -stroke is true-', function() {
                _fillColorBean.outlineFill = {
                  type: 'solidFill',
                  data: 'some fill data'
                };

                _paths[0].fill = 'lighten';  //non 'none' path-fill
                _paths[0].stroke = 'true';

                spyOn(_fillHandler, 'fillCanvasContext');
                spyOn(_context, 'stroke');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_fillHandler.fillCanvasContext).toHaveBeenCalledWith(
                    _canvas, _context, _fillColorBean.fill, 'lighten',
                    undefined);
                expect(_context.stroke).toHaveBeenCalled();
              });

          it('should call fill handler and context stroke, when path-fill is ' +
              '-not none-, and -stroke is true- and path has more than one ' +
              'closePath', function() {
                _fillColorBean.outlineFill = {
                  type: 'solidFill',
                  data: 'some fill data'
                };

                _paths = [[
                  {'name': 'beginPath', 'args': []},
                  {'name': 'moveTo', 'args': [0, 76]},
                  {'name': 'save', 'args': []},
                  {'name': 'scale', 'args': [1.1053, 1]},
                  {'name': 'arc', 'args': [75.9974667511083, 76, 76, 3.1416,
                       9.4248, false]},
                  {'name': 'restore', 'args': []},
                  {'name': 'closePath', 'args': []}
                ], [
                  {'name': 'beginPath', 'args': []},
                  {'name': 'moveTo', 'args': [49, 54]},
                  {'name': 'save', 'args': []},
                  {'name': 'scale', 'args': [1.125, 1]},
                  {'name': 'arc', 'args': [51.55555555555556, 54, 8, 3.1416,
                       9.4248, false]},
                  {'name': 'restore', 'args': []},
                  {'name': 'moveTo', 'args': [103, 54]},
                  {'name': 'save', 'args': []},
                  {'name': 'scale', 'args': [1.125, 1]},
                  {'name': 'arc', 'args': [99.55555555555556, 54, 8, 3.1416,
                       9.4248, false]},
                  {'name': 'restore', 'args': []}
                ], [
                  {'name': 'beginPath', 'args': []},
                  {'name': 'moveTo', 'args': [39, 110]},
                  {'name': 'quadraticCurveTo', 'args': [84, 138, 130, 110]}
                ], [
                  {'name': 'beginPath', 'args': []},
                  {'name': 'moveTo', 'args': [0, 76]},
                  {'name': 'save', 'args': []},
                  {'name': 'scale', 'args': [1.1053, 1]},
                  {'name': 'arc', 'args': [75.9974667511083, 76, 76, 3.1416,
                       9.4248, false]},
                  {'name': 'restore', 'args': []},
                  {'name': 'closePath', 'args': []}
                ]];

                _paths[0].fill = undefined;  //non 'none' path-fill
                _paths[0].stroke = 'false';

                _paths[1].fill = 'darkenLess';  //non 'none' path-fill
                _paths[1].stroke = undefined;

                _paths[2].fill = 'none';  //non 'none' path-fill
                _paths[2].stroke = undefined;

                _paths[3].fill = 'none';  //non 'none' path-fill
                _paths[3].stroke = undefined;

                spyOn(_fillHandler, 'fillCanvasContext');
                spyOn(_context, 'stroke');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_fillHandler.fillCanvasContext.calls[0].args[3]).
                    toEqual(undefined);
                expect(_fillHandler.fillCanvasContext.calls[1].args[3]).
                    toEqual('darkenLess');
                expect(_fillHandler.fillCanvasContext.callCount).toEqual(2);
                expect(_context.stroke).toHaveBeenCalled();
              });

          it('should call fill handler and context stroke, when path-fill is ' +
              '-not none-, and -stroke is undefined-', function() {
                _fillColorBean.outlineFill = {
                  type: 'solidFill',
                  data: 'some fill data'
                };

                _paths[0].fill = 'lighten';  //non 'none' path-fill
                _paths[0].stroke = undefined;

                spyOn(_fillHandler, 'fillCanvasContext');
                spyOn(_context, 'stroke');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_fillHandler.fillCanvasContext).toHaveBeenCalledWith(
                    _canvas, _context, _fillColorBean.fill, 'lighten',
                    undefined);
                expect(_context.stroke).toHaveBeenCalled();
              });

          it('should call fill handler and not outlineFill handler, when ' +
              'path-fill is -not none-, and -stroke is false-', function() {
                _paths[0].fill = 'lighten';  //non 'none' path-fill
                _paths[0].stroke = 'false';

                spyOn(_fillHandler, 'fillCanvasContext');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_fillHandler.fillCanvasContext).toHaveBeenCalledWith(
                    _canvas, _context, _fillColorBean.fill, 'lighten',
                    undefined);

                expect(_outlineHandler.handleUsingHTML).not.toHaveBeenCalled();
              });

          it('should call context stroke and fill handler, when path-fill is ' +
              '-none-, and -stroke is true-', function() {
                _fillColorBean.outlineFill = {
                  type: 'solidFill',
                  data: 'some fill data'
                };

                _paths[0].fill = 'none';  //'none' path-fill
                _paths[0].stroke = 'true';

                spyOn(_fillHandler, 'fillCanvasContext');
                spyOn(_context, 'stroke');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_fillHandler.fillCanvasContext).not.toHaveBeenCalled();
                expect(_context.stroke).toHaveBeenCalled();
              });

          it('should call context stroke and fill handler, when path-fill is ' +
              '-none-, and -stroke is undefined-', function() {
                _fillColorBean.outlineFill = {
                  type: 'solidFill',
                  data: 'some fill data'
                };

                _paths[0].fill = 'none';  //'none' path-fill
                _paths[0].stroke = undefined;

                spyOn(_fillHandler, 'fillCanvasContext');
                spyOn(_context, 'stroke');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_fillHandler.fillCanvasContext).not.toHaveBeenCalled();
                expect(_context.stroke).toHaveBeenCalled();
              });

          it('should call neither outlineFill handler nor fill handler, when ' +
              'path-fill is -none-, and -stroke is false-', function() {
                _paths[0].fill = 'none';  //'none' path-fill
                _paths[0].stroke = false;

                spyOn(_fillHandler, 'fillCanvasContext');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_fillHandler.fillCanvasContext).not.toHaveBeenCalled();
                expect(_outlineHandler.handleUsingHTML).not.toHaveBeenCalled();
              });

          it('should stroke if closePath is present in path commands',
              function() {
                _fillColorBean.outlineFill = {
                  type: 'solidFill',
                  data: 'some fill data'
                };

                spyOn(_fillHandler, 'fillCanvasContext');
                spyOn(_context, 'stroke');

                _paths[0].fill = 'lighten';


                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_fillHandler.fillCanvasContext.callCount).toEqual(1);
                expect(_context.stroke).toHaveBeenCalled();
              });

          it('should get correct canvas width when left and right margins' +
              ' are defined.', function() {
                _canvas.width = 50;
                _canvas.height = 50;

                _paths = [[{
                  'name': 'moveTo',
                  'args': [-200, 300]
                }, {
                  'name': 'lineTo',
                  'args': [-100, 10]
                }, {
                  'name': 'lineTo',
                  'args': [100, 10]
                }, {
                  'name': 'lineTo',
                  'args': [100, 100]
                }, {
                  'name': 'lineTo',
                  'args': [100, 10]
                }, {
                  'name': 'closePath',
                  'args': []
                }]];

                _paths.topMargin = 0;
                _paths.leftMargin = 200;
                _paths.rightMargin = 150;
                _paths.bottomMargin = 0;

                spyOn(_fillHandler, 'fillCanvasContext');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_canvas.width).toEqual(400);
              });

          it('should get correct canvas height when top and bottom margins' +
              ' are defined.', function() {
                _canvas.width = 50;
                _canvas.height = 50;

                _paths = [[{
                  'name': 'moveTo',
                  'args': [-200, 300]
                }, {
                  'name': 'lineTo',
                  'args': [100, -100]
                }, {
                  'name': 'lineTo',
                  'args': [200, 100]
                }, {
                  'name': 'lineTo',
                  'args': [100, 200]
                }, {
                  'name': 'closePath',
                  'args': []
                }]];

                _paths.topMargin = 100;
                _paths.leftMargin = 0;
                _paths.rightMargin = 0;
                _paths.bottomMargin = 150;

                spyOn(_fillHandler, 'fillCanvasContext');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_canvas.height).toEqual(300);
              });

          it('should not scale canvas when width and height of canvas is' +
              ' greater than width and height of shape Div for geometries' +
              ' other than custom geometry.', function() {
                _canvas.width = 150;
                _canvas.height = 150;

                _paths = [[{
                  'name': 'moveTo',
                  'args': [-200, 300]
                }, {
                  'name': 'lineTo',
                  'args': [100, -100]
                }, {
                  'name': 'lineTo',
                  'args': [200, 100]
                }, {
                  'name': 'lineTo',
                  'args': [100, 200]
                }, {
                  'name': 'closePath',
                  'args': []
                }]];

                _paths.topMargin = 0;
                _paths.leftMargin = 0;
                _paths.rightMargin = 0;
                _paths.bottomMargin = 0;

                spyOn(_fillHandler, 'fillCanvasContext');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_canvas.style['-webkit-transform']).toEqual(undefined);
                expect(_canvas.style['-webkit-transform-origin']).
                    toEqual(undefined);
              });

          it('should not scale canvas when width of canvas is less than width' +
              ' of shape Div for custom geometry.', function() {
                _canvas.width = 5;
                _canvas.height = 150;

                _paths = [[{
                  'name': 'moveTo',
                  'args': [-200, 300]
                }, {
                  'name': 'lineTo',
                  'args': [100, -100]
                }, {
                  'name': 'lineTo',
                  'args': [200, 100]
                }, {
                  'name': 'lineTo',
                  'args': [100, 200]
                }, {
                  'name': 'closePath',
                  'args': []
                }]];

                _paths.topMargin = 0;
                _paths.leftMargin = 0;
                _paths.rightMargin = 0;
                _paths.bottomMargin = 0;

                spyOn(_fillHandler, 'fillCanvasContext');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_canvas.style['-webkit-transform']).toEqual(undefined);
                expect(_canvas.style['-webkit-transform-origin']).
                    toEqual(undefined);
              });

          it('should not scale canvas when height of canvas is less than' +
              ' height of shape Div for custom geometry.', function() {
                _canvas.width = 150;
                _canvas.height = 5;

                _paths = [[{
                  'name': 'moveTo',
                  'args': [-200, 300]
                }, {
                  'name': 'lineTo',
                  'args': [100, -100]
                }, {
                  'name': 'lineTo',
                  'args': [200, 100]
                }, {
                  'name': 'lineTo',
                  'args': [100, 200]
                }, {
                  'name': 'closePath',
                  'args': []
                }]];

                _paths.topMargin = 0;
                _paths.leftMargin = 0;
                _paths.rightMargin = 0;
                _paths.bottomMargin = 0;

                spyOn(_fillHandler, 'fillCanvasContext');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_canvas.style['-webkit-transform']).toEqual(undefined);
                expect(_canvas.style['-webkit-transform-origin']).
                    toEqual(undefined);
              });

          it('should not scale canvas when width and height of canvas is' +
              ' less than width and height of shape Div for custom geometry.',
              function() {
                _canvas.width = 5;
                _canvas.height = 5;

                _paths = [[{
                  'name': 'moveTo',
                  'args': [-200, 300]
                }, {
                  'name': 'lineTo',
                  'args': [100, -100]
                }, {
                  'name': 'lineTo',
                  'args': [200, 100]
                }, {
                  'name': 'lineTo',
                  'args': [100, 200]
                }, {
                  'name': 'closePath',
                  'args': []
                }]];

                _paths.topMargin = 0;
                _paths.leftMargin = 0;
                _paths.rightMargin = 0;
                _paths.bottomMargin = 0;

                spyOn(_fillHandler, 'fillCanvasContext');

                canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

                expect(_canvas.style['-webkit-transform']).toEqual(undefined);
                expect(_canvas.style['-webkit-transform-origin']).
                    toEqual(undefined);
              });

          it('should stroke if closePath is not present in path commands.',
             function() {

               _fillColorBean.outlineFill = {
                 type: 'solidFill',
                 data: 'some fill data'
               };

               _paths = [[{
                 'name': 'moveTo',
                 'args': [40, 10]
               }, {
                 'name': 'lineTo',
                 'args': [80, 10]
               }, {
                 'name': 'lineTo',
                 'args': [80, 40]
               }, {
                 'name': 'lineTo',
                 'args': [40, 10]
               }, {
                 'name': 'closePath',
                 'args': []
               }],
               [{
                 'name': 'moveTo',
                 'args': [40, 10]
               }, {
                 'name': 'lineTo',
                 'args': [80, 10]
               }, {
                 'name': 'lineTo',
                 'args': [80, 40]
               }, {
                 'name': 'lineTo',
                 'args': [40, 10]
               }]];

               _paths[0].fill = 'lighten';

               spyOn(_fillHandler, 'fillCanvasContext');
               spyOn(_context, 'stroke');

               canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

               expect(_fillHandler.fillCanvasContext.callCount).toEqual(2);
               expect(_context.stroke).toHaveBeenCalled();
             });

          it('should check arc function correctly handles the boolean values.',
             function() {
               _paths = [[{
                 'name': 'moveTo',
                 'args': [15, 25]
               }, {
                 'name': 'arc',
                 'args': ['10', '20', '12', '3.1', '0', false]
               }, {
                 'name': 'arc',
                 'args': ['10', '20', '12', '3.1', '0', true]
               }]];
               _paths[0].fill = 'none';
               _paths[0].stroke = 'false';

               _context.arc = function() {
               };

               spyOn(_fillHandler, 'fillCanvasContext');
               spyOn(_context, 'arc');

               canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

               expect(_context.arc.callCount).toEqual(2);
               expect(_context.arc.calls[0].args).toEqual(
                   ['10', '20', '12', '3.1', '0', false]);
               expect(_context.arc.calls[1].args).toEqual(
                   ['10', '20', '12', '3.1', '0', true]);
             });

          it('should add image load listener when fill is blip fill.',
             function() {
               _paths = [[
                 'moveTo(40,10)',
                 'lineTo(80,10)',
                 'lineTo(80,40)',
                 'lineTo(40,10)',
                 'closePath()'
               ], [
                 'moveTo(40,10)',
                 'lineTo(80,10)',
                 'lineTo(80,40)',
                 'lineTo(40,10)',
                 'closePath()'
               ]];

               _fillColorBean.fill = {
                 'type': 'blipFill',
                 'blip': {
                   'etp': 'img',
                   'src': 'image source data'
                 }
               };

               spyOn(document, 'createElement').andReturn(_image);
               spyOn(_image, 'addEventListener');

               canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

               _image.addEventListener.calls[0].args[1].call();
             });

          it('should modify source for image when fill type is blip fill',
             function() {
               _paths = [[
                 'moveTo(40,10)',
                 'lineTo(80,10)',
                 'lineTo(80,40)',
                 'lineTo(40,10)',
                 'closePath()'
               ], [
                 'moveTo(40,10)',
                 'lineTo(80,10)',
                 'lineTo(80,40)',
                 'lineTo(40,10)',
                 'closePath()'
               ]];

               _fillColorBean.fill = {
                 'type': 'blipFill',
                 'blip': {
                   'etp': 'img',
                   'src': 'image source data'
                 }
               };

               spyOn(document, 'createElement').andReturn(_image);

               spyOn(ResourceLocator, 'pathToUrl').andReturn('qualifiedPath');

               canvasPainter.paintCanvas(_canvas, _paths, _fillColorBean);

               expect(_image.src).toEqual('qualifiedPath');
             });
        });
  });
});
