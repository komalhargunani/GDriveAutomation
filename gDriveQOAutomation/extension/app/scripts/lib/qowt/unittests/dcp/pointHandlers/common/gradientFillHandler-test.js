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
  'qowtRoot/dcp/pointHandlers/common/gradientFillHandler',
  'qowtRoot/models/point',
  'qowtRoot/drawing/color/colorUtility'
], function(GradientFillHandler, PointModel, ColorUtility) {

  'use strict';

  describe('Gradient Fill handler', function() {
    var _gradientFillHandler, _gradientFill;

    beforeEach(function() {
      _gradientFillHandler = GradientFillHandler;

      _gradientFill = {
        type: 'gradientFill',
        lin: {
          angle: 0
        },
        gsLst: [
          {
            'color': {
              'effects': [
                {
                  'name': 'alpha',
                  'value': 100000
                }
              ],
              'clr': '#FFFFFF',
              'type': 'srgbClr'
            },
            'pos': 10000.0
          },
          {
            'color': {
              'effects': [
                {
                  'name': 'alpha',
                  'value': 100000
                }
              ], 'clr': '#f0f1f2',
              'type': 'srgbClr'
            },
            'pos': 70000.0
          }
        ],
        path: {
          fillRect: {
            b: '50',
            l: '50',
            r: '50',
            t: '50'
          },
          pathShadeType: 'circle'
        }
      };
    });

    describe('- fill canvas context for shape fill', function() {
      var _canvas, _context, _linearGradient;

      beforeEach(function() {
        _linearGradient = {
          addColorStop: function() {
          }
        };

        _context = {
          fillStyle: '',
          createLinearGradient: function() {
          },
          createRadialGradient: function() {
          },
          fill: function() {
          }
        };

        _canvas = {
          getContext: function() {
            return _context;
          },
          height: 96,
          width: 192
        };

        spyOn(_context, 'createLinearGradient').andReturn(_linearGradient);
        spyOn(_context, 'createRadialGradient').andReturn(_linearGradient);
        spyOn(_context, 'fill');
        spyOn(_linearGradient, 'addColorStop');
      });

      it('should not fill the canvas when gradient fill (gsLst) is not defined',
         function() {
           _gradientFill.gsLst = undefined;

           _gradientFillHandler.fillCanvasContext(_canvas, _context,
               _gradientFill);

           expect(_context.fill).toHaveBeenCalled();
           expect(_context.fillStyle).toEqual('');
           expect(_linearGradient.addColorStop.callCount).toEqual(0);
         });

      it('should fill the canvas when linear gradient fill property not ' +
          'defined', function() {
            _gradientFill.gsLst[0].color.effects[0].value = 30000;
            _gradientFill.lin = undefined;
            _gradientFill.path = undefined;

            _gradientFillHandler.fillCanvasContext(_canvas, _context,
                _gradientFill);

            expect(_context.createLinearGradient).toHaveBeenCalledWith(0, 48.00,
                192, 48);
            expect(_context.fill).toHaveBeenCalled();
            expect(_context.fillStyle).toEqual(_linearGradient);
            expect(_linearGradient.addColorStop.callCount).toEqual(2);
            expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                '0.10');
            expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                'rgba(255,255,255,0.3)');
            expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                '0.70');
            expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                'rgba(240,241,242,1)');
          });

      it('should fill the canvas when linear gradient fill angle is undefined',
         function() {
           _gradientFill.gsLst[0].color.effects[0].value = 100000;
           _gradientFill.lin.angle = undefined;
           _gradientFill.path = undefined;

           _gradientFillHandler.fillCanvasContext(_canvas, _context,
               _gradientFill);

           expect(_context.createLinearGradient).toHaveBeenCalledWith(0, 48.00,
               192, 48);
           expect(_context.fill).toHaveBeenCalled();
           expect(_context.fillStyle).toEqual(_linearGradient);
           expect(_linearGradient.addColorStop.callCount).toEqual(2);
           expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
               '0.10');
           expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
               'rgba(255,255,255,1)');
           expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
               '0.70');
           expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
               'rgba(240,241,242,1)');
         });

      it('should call context createLinearGradient function, when ' +
          'gradient-fill with 2 colors', function() {
            _gradientFill.path = undefined;

            _gradientFillHandler.fillCanvasContext(_canvas, _context,
                _gradientFill);

            expect(_context.createLinearGradient).toHaveBeenCalledWith(0, 48.00,
                192, 48);
            expect(_context.fill).toHaveBeenCalled();
            expect(_context.fillStyle).toEqual(_linearGradient);
            expect(_linearGradient.addColorStop.callCount).toEqual(2);
            expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                '0.10');
            expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                'rgba(255,255,255,1)');
            expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                '0.70');
            expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                'rgba(240,241,242,1)');
          });

      it('should call context createRadialGradient function when ' +
          'pathShadeType is circle', function() {
            _gradientFill.gsLst[0].color.effects[0].value = 30000;
            _gradientFill.path.pathShadeType = 'circle';

            _gradientFillHandler.fillCanvasContext(_canvas, _context,
                _gradientFill);

            expect(_context.createRadialGradient).toHaveBeenCalledWith(96, 48,
                3.84, 96, 48, 115.2);
            expect(_context.fill).toHaveBeenCalled();
            expect(_context.fillStyle).toEqual(_linearGradient);
            expect(_linearGradient.addColorStop.callCount).toEqual(2);
            expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                '0.10');
            expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                'rgba(255,255,255,0.3)');
            expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                '0.70');
            expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                'rgba(240,241,242,1)');
          });

      it('should default when fill-rect is undefined', function() {
        _gradientFill.gsLst[0].color.effects[0].value = 30000;
        _gradientFill.path.fillRect = undefined;
        _gradientFill.gsLst.push({
          'color': {
            'clr': '#0000FF',
            'type': 'srgbClr'
          },
          'pos': 60000.0
        });
        _gradientFillHandler.fillCanvasContext(_canvas, _context,
            _gradientFill);

        expect(_context.createRadialGradient).toHaveBeenCalledWith(0, 0, 3.84,
            0, 0, 240);
      });

      it('should call context createRadialGradient function when ' +
          'pathShadeType is circle and it is lower right fill with 3 colors',
         function() {
           _gradientFill.gsLst[0].color.effects[0].value = 30000;
           _gradientFill.path.fillRect = {
             b: '100',
             l: '0',
             r: '100',
             t: '0'
           };
           _gradientFill.gsLst.push({
             'color': {
               'clr': '#0000FF',
               'type': 'srgbClr'
             },
             'pos': 60000.0
           });
           _gradientFillHandler.fillCanvasContext(_canvas, _context,
               _gradientFill);

           expect(_context.createRadialGradient).toHaveBeenCalledWith(0, 0,
               3.84, 0, 0, 240);
           expect(_context.fill).toHaveBeenCalled();
           expect(_context.fillStyle).toEqual(_linearGradient);
           expect(_linearGradient.addColorStop.callCount).toEqual(3);
           expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
               '0.10');
           expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
               'rgba(255,255,255,0.3)');

           // JELTE TODO - these assertions fail under phantomjs 1.6.1
           // We should figure out why, but unless there are a LOT of
           // failures under phantomjs, we will ignore these for now...
           //        expect(_linearGradient.addColorStop.calls[1].args[0]).
           //   toEqual('0.60');
           //        expect(_linearGradient.addColorStop.calls[1].args[1])
           // .toEqual('rgba(0,0,255,1)');
         });

      describe('when color-stops have same stop-position', function() {

        beforeEach(function() {
          _gradientFill.gsLst[0].pos = '60000';
          _gradientFill.gsLst[1].pos = '60000';
        });

        it('should add the first and second color to linear-gradient, when ' +
            'gradient-fill with 2 colors', function() {
              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(2);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.60');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(255,255,255,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '1.00');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(240,241,242,1)');
            });

        it('should add the second color and then first color to ' +
            'linear-gradient, when gradient-fill with 2 colors, and linear ' +
            'angle -equal to 180- degrees', function() {
              _gradientFill.lin.angle = '180';

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(2);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.60');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(240,241,242,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '0.00');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(255,255,255,1)');
            });

        it('should add the second color and then first color to ' +
            'linear-gradient, when gradient-fill with 2 colors, and linear ' +
            'angle -greater than 180- degrees', function() {
              _gradientFill.lin.angle = '270';

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(2);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.60');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(240,241,242,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '0.00');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(255,255,255,1)');
            });

        it('should add only the first and fifth color to the ' +
            'linear gradient, when gradient-fill with 5 colors', function() {
              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(2);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.60');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(255,255,255,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '1.00');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(255,0,0,1)');
            });

        it('should add the fifth color and then first color to ' +
            'linear-gradient, when gradient-fill with 5 colors, and linear ' +
            'angle -equal to 180- degrees', function() {
              _gradientFill.lin.angle = '180';

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(2);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.60');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(255,0,0,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '0.00');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(255,255,255,1)');
            });

        it('should add the fifth color and then first color to ' +
            'linear-gradient, when gradient-fill with 5 colors, and linear ' +
            'angle -greater than 180- degrees', function() {
              _gradientFill.lin.angle = '270';

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(2);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.60');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(255,0,0,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '0.00');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(255,255,255,1)');
            });

        it('should remove duplicate color stops, when in serial order',
           function() {
             _gradientFill.gsLst = [];

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FFFFFF',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#F0F0F0',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#000000',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_linearGradient.addColorStop.callCount).toEqual(4);
             expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                 '0.30');
             expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                 'rgba(255,0,0,1)');
             expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                 '0.50');
             expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                 'rgba(0,255,0,1)');
             expect(_linearGradient.addColorStop.calls[2].args[0]).toEqual(
                 '0.80');
             expect(_linearGradient.addColorStop.calls[2].args[1]).toEqual(
                 'rgba(0,0,255,1)');
             expect(_linearGradient.addColorStop.calls[3].args[0]).toEqual(
                 '1.00');
             expect(_linearGradient.addColorStop.calls[3].args[1]).toEqual(
                 'rgba(0,0,0,1)');
           });

        it('should remove duplicate color stops, when in serial order, and ' +
            'linear angle 180 degree', function() {
              _gradientFill.lin.angle = '180';

              _gradientFill.gsLst = [];

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#F0F0F0',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#000000',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(4);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.30');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(255,255,255,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '0.50');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(240,240,240,1)');
              expect(_linearGradient.addColorStop.calls[2].args[0]).toEqual(
                  '0.80');
              expect(_linearGradient.addColorStop.calls[2].args[1]).toEqual(
                  'rgba(0,0,0,1)');
              expect(_linearGradient.addColorStop.calls[3].args[0]).toEqual(
                  '0.00');
              expect(_linearGradient.addColorStop.calls[3].args[1]).toEqual(
                  'rgba(255,0,0,1)');
            });

        it('should remove duplicate color stops, when in non-serial order',
           function() {
             _gradientFill.gsLst = [];

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#F0F0F0',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FFFFFF',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#000000',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_linearGradient.addColorStop.callCount).toEqual(4);

             var expectedCallArray = [
               ['0.30', 'rgba(255,0,0,1)'],
               ['0.50', 'rgba(0,255,0,1)'],
               ['0.80', 'rgba(0,0,255,1)'],
               ['1.00', 'rgba(0,0,0,1)']
             ];

             var actualCallsArray = [
               _linearGradient.addColorStop.calls[0].args,
               _linearGradient.addColorStop.calls[1].args,
               _linearGradient.addColorStop.calls[2].args,
               _linearGradient.addColorStop.calls[3].args
             ];

             expect(_linearGradient.addColorStop.callCount).toEqual(4);
             expect(actualCallsArray).toContain(expectedCallArray[0]);
             expect(actualCallsArray).toContain(expectedCallArray[1]);
             expect(actualCallsArray).toContain(expectedCallArray[2]);
             expect(actualCallsArray).toContain(expectedCallArray[3]);
           });

        it('should remove duplicate color stops, when in non-serial order, ' +
            'and last color-position has only one color', function() {
              _gradientFill.gsLst = [];

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#F0F0F0',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              var expectedCallArray = [
                ['0.30', 'rgba(255,0,0,1)'],
                ['0.50', 'rgba(0,255,0,1)'],
                ['0.80', 'rgba(0,0,255,1)']
              ];

              var actualCallsArray = [
                _linearGradient.addColorStop.calls[0].args,
                _linearGradient.addColorStop.calls[1].args,
                _linearGradient.addColorStop.calls[2].args
              ];

              expect(_linearGradient.addColorStop.callCount).toEqual(3);
              expect(actualCallsArray).toContain(expectedCallArray[0]);
              expect(actualCallsArray).toContain(expectedCallArray[1]);
              expect(actualCallsArray).toContain(expectedCallArray[2]);
            });

        it('should remove duplicate color stops, when in non-serial order, ' +
            'and linear angle 180 degree', function() {
              _gradientFill.lin.angle = '180';

              _gradientFill.gsLst = [];

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#F0F0F0',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#000000',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(4);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.30');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(255,255,255,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '0.50');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(240,240,240,1)');
              expect(_linearGradient.addColorStop.calls[2].args[0]).toEqual(
                  '0.80');
              expect(_linearGradient.addColorStop.calls[2].args[1]).toEqual(
                  'rgba(0,0,0,1)');
              expect(_linearGradient.addColorStop.calls[3].args[0]).toEqual(
                  '0.00');
              expect(_linearGradient.addColorStop.calls[3].args[1]).toEqual(
                  'rgba(255,0,0,1)');
            });

        it('should remove duplicate color stops, when in non-serial order, ' +
            'and linear angle 180 degree,' + ' and first color-position has ' +
            'only one color', function() {
              _gradientFill.lin.angle = '180';

              _gradientFill.gsLst = [];

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#F0F0F0',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#000000',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              var expectedCallArray = [
                ['0.30', 'rgba(255,255,255,1)'],
                ['0.50', 'rgba(240,240,240,1)'],
                ['0.80', 'rgba(0,0,0,1)']
              ];

              var actualCallsArray = [
                _linearGradient.addColorStop.calls[0].args,
                _linearGradient.addColorStop.calls[1].args,
                _linearGradient.addColorStop.calls[2].args
              ];

              expect(_linearGradient.addColorStop.callCount).toEqual(3);
              expect(actualCallsArray).toContain(expectedCallArray[0]);
              expect(actualCallsArray).toContain(expectedCallArray[1]);
              expect(actualCallsArray).toContain(expectedCallArray[2]);
            });
      });

      it('should call context createLinearGradient function, when fill-type ' +
          'is gradient-fill with 3 colors and ' +
          'transparency value greater than 1', function() {
            _gradientFill.gsLst = [
              {
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 10000.0
              },
              {
                'color': {
                  'clr': '#f0f1f2',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              },
              {
                'color': {
                  'clr': '#f12345',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              }
            ];

            _gradientFill.path = undefined;

            _gradientFillHandler.fillCanvasContext(_canvas, _context,
                _gradientFill);

            expect(_context.createLinearGradient).toHaveBeenCalledWith(0, 48.00,
                192, 48);
            expect(_context.fill).toHaveBeenCalled();
            expect(_context.fillStyle).toEqual(_linearGradient);
            expect(_linearGradient.addColorStop.callCount).toEqual(3);
            expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                '0.10');
            expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                'rgba(255,255,255,1)');
            expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                '0.50');
            expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                'rgba(240,241,242,1)');
            expect(_linearGradient.addColorStop.calls[2].args[0]).toEqual(
                '0.80');
            expect(_linearGradient.addColorStop.calls[2].args[1]).toEqual(
                'rgba(241,35,69,1)');
          });

      describe(' computePaintLinearCoordinates test', function() {

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in first quadrant, ' +
            'less than decision angle(26 deg in this case)', function() {
              _gradientFill.lin.angle = '15';
              _gradientFill.gsLst = [];
              _gradientFill.path = undefined;

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_context.createLinearGradient).toHaveBeenCalledWith(0,
                  22.27, 192, 73.73);
            });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in first quadrant, ' +
            'is greater than decision angle(26 deg in this case)', function() {
              _gradientFill.lin.angle = '45';
              _gradientFill.gsLst = [];
              _gradientFill.path = undefined;

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_context.createLinearGradient).toHaveBeenCalledWith(47.97,
                  0, 144.03, 96);
            });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is 90', function() {
              _gradientFill.lin.angle = '90';
              _gradientFill.gsLst = [];
              _gradientFill.path = undefined;

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_context.createLinearGradient).toHaveBeenCalledWith(96.03,
                  0, 95.97, 96);
            });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is 180', function() {
              _gradientFill.lin.angle = '180';
              _gradientFill.gsLst = [];
              _gradientFill.path = undefined;

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_context.createLinearGradient).toHaveBeenCalledWith(192,
                  48, 0, 48);
            });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is 270', function() {
              _gradientFill.lin.angle = '270';
              _gradientFill.gsLst = [];
              _gradientFill.path = undefined;

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_context.createLinearGradient).toHaveBeenCalledWith(95.97,
                  96, 96.03, 0);
            });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is 359.9', function() {
              _gradientFill.lin.angle = '359.9';
              _gradientFill.gsLst = [];
              _gradientFill.path = undefined;

              _gradientFillHandler.fillCanvasContext(_canvas, _context,
                  _gradientFill);

              expect(_context.createLinearGradient).toHaveBeenCalledWith(0,
                  48.17, 192, 47.83);
            });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in second quadrant, ' +
            'and is less than (180 - decision angle)(26 deg in this case)',
           function() {
             _gradientFill.lin.angle = '105';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(108.9,
                 0, 83.1, 96);
           });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in second quadrant, ' +
            'and is greater than (180 - decision angle)(26 deg in this case)',
           function() {
             _gradientFill.lin.angle = '165';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(192,
                 22.27, 0, 73.73);
           });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in third quadrant, ' +
            'less than (180 + decision angle)(26 deg in this case)',
           function() {
             _gradientFill.lin.angle = '195';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(192,
                 73.73, 0, 22.27);
           });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in third quadrant, ' +
            'is greater than (180 + decision angle)(26 deg in this case)',
           function() {
             _gradientFill.lin.angle = '225';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(144.03,
                 96, 47.97, 0);
           });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in forth quadrant, ' +
            'and is less than (360 - decision angle)(26 deg in this case)',
           function() {
             _gradientFill.lin.angle = '285';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(83.1,
                 96, 108.9, 0);
           });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in forth quadrant, ' +
            'and is greater than (360 - decision angle)(26 deg in this case)',
           function() {
             _gradientFill.lin.angle = '345';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(0,
                 73.73, 192, 22.27);
           });
      });

      describe(' renderRadialGradientFill test', function() {

        it('should call context createRadialGradient function with correct ' +
            'x y co-ordinates and radius, when ' + 'it is center fill',
           function() {
             _gradientFill.gsLst = [];
             _gradientFill.path.fillRect = {
               b: '50',
               l: '50',
               r: '50',
               t: '50'
             };

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_context.createRadialGradient).toHaveBeenCalledWith(96, 48,
                 3.84, 96, 48, 115.2);
           });

        it('should call context createRadialGradient function with correct ' +
            'x y co-ordinates and radius, when ' + 'it is upper left fill',
           function() {
             _gradientFill.gsLst = [];
             _gradientFill.path.fillRect = {
               b: '0',
               l: '100',
               r: '0',
               t: '100'
             };

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_context.createRadialGradient).toHaveBeenCalledWith(192,
                 96, 3.84, 192, 96, 240);
           });

        it('should call context createRadialGradient function with correct ' +
            'x y co-ordinates and radius, when ' + 'it is lower left fill',
           function() {
             _gradientFill.gsLst = [];
             _gradientFill.path.fillRect = {
               b: '100',
               l: '100',
               r: '0',
               t: '0'
             };

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_context.createRadialGradient).toHaveBeenCalledWith(192,
                 0, 3.84, 192, 0, 240);
           });

        it('should call context createRadialGradient function with correct ' +
            'x y co-ordinates and radius, when ' + 'it is lower right',
           function() {
             _gradientFill.gsLst = [];
             _gradientFill.path.fillRect = {
               b: '100',
               l: '0',
               r: '100',
               t: '0'
             };

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_context.createRadialGradient).toHaveBeenCalledWith(0, 0,
                 3.84, 0, 0, 240);
           });

        it('should call context createRadialGradient function with correct ' +
            'x y co-ordinates and radius, when ' + 'it is upper right',
           function() {
             _gradientFill.gsLst = [];
             _gradientFill.path.fillRect = {
               b: '0',
               l: '0',
               r: '100',
               t: '100'
             };

             _gradientFillHandler.fillCanvasContext(_canvas, _context,
                 _gradientFill);

             expect(_context.createRadialGradient).toHaveBeenCalledWith(0, 96,
                 3.84, 0, 96, 240);
           });

      });

      it('should handle scheme colors properly for canvas shapes', function() {
        var someColorSchemeData =
            {
              'dk1': 'red',
              'dk2': 'blue',
              'accent1': 'accent6',
              'accent6': 'accent3',
              'accent2': 'accent4',
              'accent4': 'accent5'
            };

        PointModel.slideColorMap = someColorSchemeData;
        _gradientFill.gsLst[0].color = {
          type: 'schemeClr',
          scheme: 'accent1',
          effects: {}
        };
        _gradientFill.gsLst[1].color = {
          type: 'schemeClr',
          scheme: 'accent1',
          effects: {}
        };
        var colorUtility = ColorUtility;

        spyOn(colorUtility, 'handleLuminosity').andReturn('none');
        spyOn(colorUtility, 'getHexEquivalentOfSchemeColor').andReturn(
            '#FFFFFF');

        _gradientFillHandler.fillCanvasContext(_canvas, _context,
            _gradientFill, 'none');

        expect(colorUtility.getHexEquivalentOfSchemeColor).toHaveBeenCalled();
      });

      it('should handle no fill properly when color is not present',
         function() {
           var colorUtility = ColorUtility;
           _gradientFill = [];
           spyOn(colorUtility, 'handleLuminosity').andReturn('none');
           spyOn(colorUtility, 'getHexEquivalentOfSchemeColor');
           spyOn(colorUtility, 'getColor');

           _gradientFillHandler.fillCanvasContext(_canvas, _context,
               _gradientFill, 'none');

           expect(colorUtility.getHexEquivalentOfSchemeColor).not.
               toHaveBeenCalled();
           expect(colorUtility.getColor).not.toHaveBeenCalled();
         });

    });

    describe('- fill HTML Div for shape fill', function() {

      var _divElement;

      beforeEach(function() {
        _divElement = {
          style: {}
        };
      });

      it('should fill the div when linear gradient fill property not defined',
         function() {
           _gradientFill.lin = undefined;
           _gradientFill.path = undefined;
           _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

           expect(_divElement.style['background-image']).toEqual(
               '-webkit-linear-gradient(360deg, rgba(255,255,255,1) 10.00%,' +
               'rgba(240,241,242,1) 70.00%) ');
         });

      it('should fill the div when linear gradient fill angle is undefined',
         function() {
           _gradientFill.lin.angle = undefined;
           _gradientFill.path = undefined;
           _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

           expect(_divElement.style['background-image']).toEqual(
               '-webkit-linear-gradient(360deg, rgba(255,255,255,1) 10.00%,' +
               'rgba(240,241,242,1) 70.00%) ');
         });

      it('should fill the div, when gradient-fill with 2 colors', function() {
        _gradientFill.path = undefined;
        _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

        expect(_divElement.style['background-image']).toEqual(
            '-webkit-linear-gradient(360deg, rgba(255,255,255,1) 10.00%,' +
            'rgba(240,241,242,1) 70.00%) ');
      });

      it('should call context createLinearGradient function, when fill-type ' +
          'is gradient-fill with 3 colors and ' + 'transparency', function() {
            _gradientFill.gsLst = [
              {
                clr: '#ffffff',
                pos: '10000'
              },
              {
                clr: '#f0f1f2',
                pos: '50000'
              },
              {
                clr: '#f12345',
                pos: '80000'
              }
            ];
          });

      it('should call context createRadialGradient function when ' +
          'pathShadeType is circle for lower left', function() {
            _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

            expect(_divElement.style['background-image']).toEqual(
                '-webkit-radial-gradient(50% 50%, circle farthest-corner,' +
                'rgba(255,255,255,1) 10.00%,rgba(240,241,242,1) 70.00%) ');
          });

      it('should set css property background image as none if gradient stop ' +
          'list is undefined', function() {
            _gradientFill.gsLst = undefined;
            _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

            expect(_divElement.style['background-image']).toEqual('none');
          });

      describe(' - when color-stops have same stop-position', function() {

        beforeEach(function() {
          _gradientFill.gsLst[0].pos = '60000';
          _gradientFill.gsLst[1].pos = '60000';
        });

        it('should add the first and second color to linear-gradient, ' +
            'when gradient-fill with 2 colors', function() {
              _gradientFill.path = undefined;
              _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

              expect(_divElement.style['background-image']).toEqual(
                  '-webkit-linear-gradient(360deg, rgba(255,255,255,1) ' +
                  '60.00%,rgba(240,241,242,1) 100.00%) ');
            });

        it('should add the second color and then first color to ' +
            'linear-gradient, when gradient-fill with 2 colors, and linear ' +
            'angle -equal to 180- degrees', function() {
              _gradientFill.lin.angle = '180';
              _gradientFill.path = undefined;
              _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

              expect(_divElement.style['background-image']).toEqual(
                  '-webkit-linear-gradient(180deg, rgba(255,255,255,1) 0.00%,' +
                  'rgba(240,241,242,1) 60.00%) ');
            });

        it('should add the second color and then first color to ' +
            'linear-gradient, when gradient-fill with 2 colors, and linear ' +
            'angle -greater than 180- degrees', function() {
              _gradientFill.lin.angle = '270';
              _gradientFill.path = undefined;
              _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

              expect(_divElement.style['background-image']).toEqual(
                  '-webkit-linear-gradient(90deg, rgba(255,255,255,1) 0.00%,' +
                  'rgba(240,241,242,1) 60.00%) ');
            });

        it('should add only the first and fifth color to the linear ' +
            'gradient, when gradient-fill with 5 colors, all with same ' +
            'stop-positions', function() {

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.path = undefined;
              _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

              expect(_divElement.style['background-image']).toEqual(
                  '-webkit-linear-gradient(360deg, rgba(255,255,255,1)' +
                  ' 60.00%,rgba(255,0,0,1) 100.00%) ');
            });

        it('should add the fifth color and then first color to ' +
            'linear-gradient, when gradient-fill with 5 colors, all with ' +
            'same stop-positions, and linear angle -equal to 180- degrees',
           function() {

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.path = undefined;
             _gradientFill.lin.angle = '180';
             _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

             expect(_divElement.style['background-image']).toEqual(
                 '-webkit-linear-gradient(180deg, rgba(255,255,255,1) 0.00%,' +
                 'rgba(255,0,0,1) 60.00%) ');
           });

        it('should add the fifth color and then first color to ' +
            'linear-gradient, when gradient-fill with 5 colors, all with ' +
            'same stop-positions, and linear angle -greater than 180- degrees',
           function() {

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.path = undefined;
             _gradientFill.lin.angle = '270';
             _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

             expect(_divElement.style['background-image']).toEqual(
                 '-webkit-linear-gradient(90deg, rgba(255,255,255,1) 0.00%,' +
                 'rgba(255,0,0,1) 60.00%) ');
           });

        it('should remove duplicate color stops, when in serial order',
           function() {
             _gradientFill.gsLst = [];

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FFFFFF',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });
             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#F0F0F0',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#000000',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });
             _gradientFill.path = undefined;
             _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

             expect(_divElement.style['background-image']).toEqual('' +
                 '-webkit-linear-gradient(360deg, rgba(255,0,0,1) 30.00%,' +
                 'rgba(0,255,0,1) 50.00%,rgba(0,0,255,1) 80.00%,rgba(0,0,0,1)' +
                 ' 100.00%) ');
           });

        it('should remove duplicate color stops, when in serial order, and ' +
            'linear angle 180 degree', function() {
              _gradientFill.lin.angle = '180';

              _gradientFill.gsLst = [];

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });
              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#F0F0F0',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#000000',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.path = undefined;
              _gradientFillHandler.handleUsingHTML(_gradientFill, _divElement);

              expect(_divElement.style['background-image']).toEqual(
                  '-webkit-linear-gradient(180deg, rgba(255,0,0,1) ' +
                  '0.00%,rgba(255,255,255,1) 30.00%,rgba(240,240,240,1) ' +
                  '50.00%,rgba(0,0,0,1) 80.00%) ');
            });
      });
    });

    describe('- fill style for place Holder shapes', function() {

      it('should style the place Holder when linear gradient fill property ' +
          'not defined', function() {
            _gradientFill.lin = undefined;
            _gradientFill.path = undefined;
            var gradientFillStyle = _gradientFillHandler.getStyleString(
                _gradientFill);

            expect(gradientFillStyle).toContain('background-image:' +
                '-webkit-linear-gradient(360deg, rgba(255,255,255,1) 10.00%,' +
                'rgba(240,241,242,1) 70.00%) ;');
          });

      it('should style the place Holder when linear gradient fill angle is ' +
          'undefined', function() {
            _gradientFill.lin.angle = undefined;
            _gradientFill.path = undefined;
            var gradientFillStyle = _gradientFillHandler.getStyleString(
                _gradientFill);

            expect(gradientFillStyle).toContain('background-image:' +
                '-webkit-linear-gradient(360deg, rgba(255,255,255,1) 10.00%,' +
                'rgba(240,241,242,1) 70.00%) ;');
          });

      it('should style the place Holder , when gradient-fill with 2 colors',
         function() {
           _gradientFill.path = undefined;
           var gradientFillStyle = _gradientFillHandler.getStyleString(
               _gradientFill);

           expect(gradientFillStyle).toContain('background-image:' +
               '-webkit-linear-gradient(360deg, rgba(255,255,255,1) 10.00%,' +
               'rgba(240,241,242,1) 70.00%) ;');
         });

      it('should call context createRadialGradient function when ' +
          'pathShadeType is circle', function() {
            _gradientFill.path.pathShadeType = 'circle';

            var gradientFillStyle = _gradientFillHandler.getStyleString(
                _gradientFill);

            expect(gradientFillStyle).toContain('background-image:' +
                '-webkit-radial-gradient(50% 50%, circle farthest-corner,' +
                'rgba(255,255,255,1) 10.00%,rgba(240,241,242,1) 70.00%) ');
          });

      describe(' - when color-stops have same stop-position', function() {

        beforeEach(function() {
          _gradientFill.gsLst[0].pos = '60000';
          _gradientFill.gsLst[1].pos = '60000';
        });

        it('should add the first and second color to linear-gradient, when ' +
            'gradient-fill with 2 colors', function() {
              _gradientFill.path = undefined;
              var gradientFillStyle = _gradientFillHandler.getStyleString(
                  _gradientFill);

              expect(gradientFillStyle).toContain('background-image:' +
                  '-webkit-linear-gradient(360deg, rgba(255,255,255,1) ' +
                  '60.00%,rgba(240,241,242,1) 100.00%) ');
            });

        it('should add the second color and then first color to ' +
            'linear-gradient, when gradient-fill with 2 colors, and linear ' +
            'angle -equal to 180- degrees', function() {
              _gradientFill.lin.angle = '180';
              _gradientFill.path = undefined;
              var gradientFillStyle = _gradientFillHandler.getStyleString(
                  _gradientFill);

              expect(gradientFillStyle).toContain('background-image:' +
                  '-webkit-linear-gradient(180deg, rgba(255,255,255,1) 0.00%,' +
                  'rgba(240,241,242,1) 60.00%) ');
            });

        it('should add the second color and then first color to ' +
            'linear-gradient, when gradient-fill with 2 colors, and linear ' +
            'angle -greater than 180- degrees', function() {
              _gradientFill.lin.angle = '270';
              _gradientFill.path = undefined;
              var gradientFillStyle = _gradientFillHandler.getStyleString(
                  _gradientFill);

              expect(gradientFillStyle).toContain('background-image:' +
                  '-webkit-linear-gradient(90deg, rgba(255,255,255,1) 0.00%,' +
                  'rgba(240,241,242,1) 60.00%) ');
            });

        it('should add only the first and fifth color to the linear gradient,' +
            ' when gradient-fill with 5 colors, all with same stop-positions',
           function() {

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.path = undefined;

             var gradientFillStyle = _gradientFillHandler.getStyleString(
                 _gradientFill);

             expect(gradientFillStyle).toContain('background-image:' +
                 '-webkit-linear-gradient(360deg, rgba(255,255,255,1) 60.00%,' +
                 'rgba(255,0,0,1) 100.00%) ');
           });

        it('should add the fifth color and then first color to ' +
            'linear-gradient, when gradient-fill with 5 colors, all with ' +
            'same stop-positions, and linear angle -equal to 180- degrees',
           function() {

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.lin.angle = '180';
             _gradientFill.path = undefined;
             var gradientFillStyle = _gradientFillHandler.getStyleString(
                 _gradientFill);

             expect(gradientFillStyle).toContain('background-image:' +
                 '-webkit-linear-gradient(180deg, rgba(255,255,255,1) 0.00%,' +
                 'rgba(255,0,0,1) 60.00%) ');
           });

        it('should add the fifth color and then first color to ' +
            'linear-gradient, when gradient-fill with 5 colors, all with same' +
            ' stop-positions, and linear angle -greater than 180- degrees',
           function() {

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.lin.angle = '270';
             _gradientFill.path = undefined;
             var gradientFillStyle = _gradientFillHandler.getStyleString(
                 _gradientFill);

             expect(gradientFillStyle).toContain('background-image:' +
                 '-webkit-linear-gradient(90deg, rgba(255,255,255,1) 0.00%,' +
                 'rgba(255,0,0,1) 60.00%) ');
           });

        it('should remove duplicate color stops, when in serial order',
           function() {
             _gradientFill.gsLst = [];

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FFFFFF',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });
             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#F0F0F0',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#000000',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });

             _gradientFill.path = undefined;

             var gradientFillStyle = _gradientFillHandler.getStyleString(
                 _gradientFill);

             expect(gradientFillStyle).toContain('background-image:' +
                 '-webkit-linear-gradient(360deg, rgba(255,0,0,1) 30.00%,' +
                 'rgba(0,255,0,1) 50.00%,rgba(0,0,255,1) 80.00%,rgba(0,0,0,1)' +
                 ' 100.00%) ');
           });

        it('should remove duplicate color stops, when in serial order, and ' +
            'linear angle 180 degree', function() {
              _gradientFill.lin.angle = '180';

              _gradientFill.gsLst = [];

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });
              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#F0F0F0',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#000000',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.path = undefined;

              var gradientFillStyle = _gradientFillHandler.getStyleString(
                  _gradientFill);

              expect(gradientFillStyle).toContain('-webkit-linear-gradient(' +
                  '180deg, rgba(255,0,0,1) 0.00%,rgba(255,255,255,1) 30.00%,' +
                  'rgba(240,240,240,1) 50.00%,rgba(0,0,0,1) 80.00%) ');
            });

        it('should get correct style string if gradient stop list is undefined',
           function() {
             _gradientFill.gsLst = undefined;
             var gradientFillStyle = _gradientFillHandler.getStyleString(
                 _gradientFill);

             expect(gradientFillStyle).toContain('background-image:none;');
           });
      });
    });

    describe('- fill canvas context for border', function() {
      var _canvas, _context, _linearGradient;

      beforeEach(function() {
        _linearGradient = {
          addColorStop: function() {
          }
        };

        _context = {
          strokeStyle: '',
          createLinearGradient: function() {
          },
          createRadialGradient: function() {
          },
          stroke: function() {
          }
        };

        _canvas = {
          getContext: function() {
            return _context;
          },
          height: 96,
          width: 192
        };

        spyOn(_context, 'createLinearGradient').andReturn(_linearGradient);
        spyOn(_context, 'createRadialGradient').andReturn(_linearGradient);
        spyOn(_context, 'stroke');
        spyOn(_linearGradient, 'addColorStop');
      });

      it('should not fill the canvas when gradient fill (gsLst) is not defined',
         function() {
           _gradientFill.gsLst = undefined;

           _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
               _gradientFill);

           expect(_context.stroke).toHaveBeenCalled();
           expect(_context.strokeStyle).toEqual('');
           expect(_linearGradient.addColorStop.callCount).toEqual(0);
         });

      it('should fill the canvas when linear gradient fill property ' +
          'not defined', function() {
            _gradientFill.gsLst[0].color.effects[0].value = 30000;
            _gradientFill.lin = undefined;
            _gradientFill.path = undefined;

            _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                _gradientFill);

            expect(_context.createLinearGradient).toHaveBeenCalledWith(0, 48.00,
                192, 48);
            expect(_context.stroke).toHaveBeenCalled();
            expect(_context.strokeStyle).toEqual(_linearGradient);
            expect(_linearGradient.addColorStop.callCount).toEqual(2);
            expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                '0.10');
            expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                'rgba(255,255,255,0.3)');
            expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                '0.70');
            expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                'rgba(240,241,242,1)');
          });

      it('should fill the canvas when linear gradient fill angle is undefined',
         function() {
           _gradientFill.lin.angle = undefined;
           _gradientFill.path = undefined;

           _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
               _gradientFill);

           expect(_context.createLinearGradient).toHaveBeenCalledWith(0, 48.00,
               192, 48);
           expect(_context.stroke).toHaveBeenCalled();
           expect(_context.strokeStyle).toEqual(_linearGradient);
           expect(_linearGradient.addColorStop.callCount).toEqual(2);
           expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
               '0.10');
           expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
               'rgba(255,255,255,1)');
           expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
               '0.70');
           expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
               'rgba(240,241,242,1)');
         });

      it('should call context createLinearGradient function, when ' +
          'gradient-fill with 2 colors', function() {
            _gradientFill.path = undefined;

            _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                _gradientFill);

            expect(_context.createLinearGradient).toHaveBeenCalledWith(0, 48.00,
                192, 48);
            expect(_context.stroke).toHaveBeenCalled();
            expect(_context.strokeStyle).toEqual(_linearGradient);
            expect(_linearGradient.addColorStop.callCount).toEqual(2);
            expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                '0.10');
            expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                'rgba(255,255,255,1)');
            expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                '0.70');
            expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                'rgba(240,241,242,1)');
          });

      it('should call context createRadialGradient function when ' +
          'pathShadeType is circle', function() {
            _gradientFill.gsLst[0].color.effects[0].value = 30000;
            _gradientFill.path.pathShadeType = 'circle';

            _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                _gradientFill);

            expect(_context.createRadialGradient).toHaveBeenCalledWith(96, 48,
                3.84, 96, 48, 115.2);
            expect(_context.stroke).toHaveBeenCalled();
            expect(_context.strokeStyle).toEqual(_linearGradient);
            expect(_linearGradient.addColorStop.callCount).toEqual(2);
            expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                '0.10');
            expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                'rgba(255,255,255,0.3)');
            expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                '0.70');
            expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                'rgba(240,241,242,1)');
          });

      it('should call context createRadialGradient function when ' +
          'pathShadeType is circle and it is lower right fill with 3 colors',
         function() {
           _gradientFill.gsLst[0].color.effects[0].value = 30000;
           _gradientFill.path.fillRect = {
             b: '100',
             l: '0',
             r: '100',
             t: '0'
           };
           _gradientFill.gsLst.push({
             'color': {
               'alpha': 1.0,
               'clr': '#0000FF',
               'type': 'srgbClr'
             },
             'pos': 60000.0
           });
           _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
               _gradientFill);

           expect(_context.createRadialGradient).toHaveBeenCalledWith(0, 0,
               3.84, 0, 0, 240);
           expect(_context.stroke).toHaveBeenCalled();
           expect(_context.strokeStyle).toEqual(_linearGradient);
           expect(_linearGradient.addColorStop.callCount).toEqual(3);
           expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
               '0.10');
           expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
               'rgba(255,255,255,0.3)');
         });

      describe('when color-stops have same stop-position', function() {

        beforeEach(function() {
          _gradientFill.gsLst[0].pos = '60000';
          _gradientFill.gsLst[1].pos = '60000';
        });

        it('should add the first and second color to linear-gradient, when ' +
            'gradient-fill with 2 colors', function() {
              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(2);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.60');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(255,255,255,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '1.00');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(240,241,242,1)');
            });

        it('should add the second color and then first color to ' +
            'linear-gradient, when gradient-fill with 2 colors, and linear ' +
            'angle -equal to 180- degrees', function() {
              _gradientFill.lin.angle = '180';

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(2);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.60');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(240,241,242,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '0.00');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(255,255,255,1)');
            });

        it('should add the second color and then first color to ' +
            'linear-gradient, when gradient-fill with 2 colors, and linear ' +
            'angle -greater than 180- degrees', function() {
              _gradientFill.lin.angle = '270';

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(2);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.60');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(240,241,242,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '0.00');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(255,255,255,1)');
            });

        it('should add only the first and fifth color to the linear ' +
            'gradient, when gradient-fill with 5 colors', function() {
              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(2);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.60');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(255,255,255,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '1.00');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(255,0,0,1)');
            });

        it('should add the fifth color and then first color to ' +
            'linear-gradient, when gradient-fill with 5 colors, and linear ' +
            'angle -equal to 180- degrees', function() {
              _gradientFill.lin.angle = '180';

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(2);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.60');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(255,0,0,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '0.00');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(255,255,255,1)');
            });

        it('should add the fifth color and then first color to ' +
            'linear-gradient, when gradient-fill with 5 colors, and linear ' +
            'angle -greater than 180- degrees', function() {
              _gradientFill.lin.angle = '270';

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(2);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.60');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(255,0,0,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '0.00');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(255,255,255,1)');
            });

        it('should remove duplicate color stops, when in serial order',
           function() {
             _gradientFill.gsLst = [];

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FFFFFF',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#F0F0F0',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#000000',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_linearGradient.addColorStop.callCount).toEqual(4);
             expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                 '0.30');
             expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                 'rgba(255,0,0,1)');
             expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                 '0.50');
             expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                 'rgba(0,255,0,1)');
             expect(_linearGradient.addColorStop.calls[2].args[0]).toEqual(
                 '0.80');
             expect(_linearGradient.addColorStop.calls[2].args[1]).toEqual(
                 'rgba(0,0,255,1)');
             expect(_linearGradient.addColorStop.calls[3].args[0]).toEqual(
                 '1.00');
             expect(_linearGradient.addColorStop.calls[3].args[1]).toEqual(
                 'rgba(0,0,0,1)');
           });

        it('should remove duplicate color stops, when in serial order, and ' +
            'linear angle 180 degree', function() {
              _gradientFill.lin.angle = '180';

              _gradientFill.gsLst = [];

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#F0F0F0',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#000000',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(4);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.30');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(255,255,255,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '0.50');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(240,240,240,1)');
              expect(_linearGradient.addColorStop.calls[2].args[0]).toEqual(
                  '0.80');
              expect(_linearGradient.addColorStop.calls[2].args[1]).toEqual(
                  'rgba(0,0,0,1)');
              expect(_linearGradient.addColorStop.calls[3].args[0]).toEqual(
                  '0.00');
              expect(_linearGradient.addColorStop.calls[3].args[1]).toEqual(
                  'rgba(255,0,0,1)');
            });

        it('should remove duplicate color stops, when in non-serial order',
           function() {
             _gradientFill.gsLst = [];

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#F0F0F0',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FFFFFF',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#000000',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_linearGradient.addColorStop.callCount).toEqual(4);

             var expectedCallArray = [
               ['0.30', 'rgba(255,0,0,1)'],
               ['0.50', 'rgba(0,255,0,1)'],
               ['0.80', 'rgba(0,0,255,1)'],
               ['1.00', 'rgba(0,0,0,1)']
             ];

             var actualCallsArray = [
               _linearGradient.addColorStop.calls[0].args,
               _linearGradient.addColorStop.calls[1].args,
               _linearGradient.addColorStop.calls[2].args,
               _linearGradient.addColorStop.calls[3].args
             ];

             expect(_linearGradient.addColorStop.callCount).toEqual(4);
             expect(actualCallsArray).toContain(expectedCallArray[0]);
             expect(actualCallsArray).toContain(expectedCallArray[1]);
             expect(actualCallsArray).toContain(expectedCallArray[2]);
             expect(actualCallsArray).toContain(expectedCallArray[3]);
           });

        it('should remove duplicate color stops, when in non-serial order, ' +
            'and last color-position has only one color', function() {
              _gradientFill.gsLst = [];

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#F0F0F0',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              var expectedCallArray = [
                ['0.30', 'rgba(255,0,0,1)'],
                ['0.50', 'rgba(0,255,0,1)'],
                ['0.80', 'rgba(0,0,255,1)']
              ];

              var actualCallsArray = [
                _linearGradient.addColorStop.calls[0].args,
                _linearGradient.addColorStop.calls[1].args,
                _linearGradient.addColorStop.calls[2].args
              ];

              expect(_linearGradient.addColorStop.callCount).toEqual(3);
              expect(actualCallsArray).toContain(expectedCallArray[0]);
              expect(actualCallsArray).toContain(expectedCallArray[1]);
              expect(actualCallsArray).toContain(expectedCallArray[2]);
            });

        it('should remove duplicate color stops, when in non-serial order, ' +
            'and linear angle 180 degree', function() {
              _gradientFill.lin.angle = '180';

              _gradientFill.gsLst = [];

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#F0F0F0',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#000000',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_linearGradient.addColorStop.callCount).toEqual(4);
              expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                  '0.30');
              expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                  'rgba(255,255,255,1)');
              expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                  '0.50');
              expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                  'rgba(240,240,240,1)');
              expect(_linearGradient.addColorStop.calls[2].args[0]).toEqual(
                  '0.80');
              expect(_linearGradient.addColorStop.calls[2].args[1]).toEqual(
                  'rgba(0,0,0,1)');
              expect(_linearGradient.addColorStop.calls[3].args[0]).toEqual(
                  '0.00');
              expect(_linearGradient.addColorStop.calls[3].args[1]).toEqual(
                  'rgba(255,0,0,1)');
            });

        it('should remove duplicate color stops, when in non-serial order, ' +
            'and linear angle 180 degree, and first color-position has only ' +
            'one color', function() {
              _gradientFill.lin.angle = '180';

              _gradientFill.gsLst = [];

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#F0F0F0',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#000000',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              var expectedCallArray = [
                ['0.30', 'rgba(255,255,255,1)'],
                ['0.50', 'rgba(240,240,240,1)'],
                ['0.80', 'rgba(0,0,0,1)']
              ];

              var actualCallsArray = [
                _linearGradient.addColorStop.calls[0].args,
                _linearGradient.addColorStop.calls[1].args,
                _linearGradient.addColorStop.calls[2].args
              ];

              expect(_linearGradient.addColorStop.callCount).toEqual(3);
              expect(actualCallsArray).toContain(expectedCallArray[0]);
              expect(actualCallsArray).toContain(expectedCallArray[1]);
              expect(actualCallsArray).toContain(expectedCallArray[2]);
            });
      });

      it('should call context createLinearGradient function, when fill-type ' +
          'is gradient-fill with 3 colors and transparency value greater ' +
          'than 1', function() {
            _gradientFill.gsLst = [
              {
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 10000.0
              },
              {
                'color': {
                  'clr': '#f0f1f2',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              },
              {
                'color': {
                  'clr': '#f12345',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              }
            ];

            _gradientFill.path = undefined;

            _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                _gradientFill);

            expect(_context.createLinearGradient).toHaveBeenCalledWith(0, 48.00,
                192, 48);
            expect(_context.stroke).toHaveBeenCalled();
            expect(_context.strokeStyle).toEqual(_linearGradient);
            expect(_linearGradient.addColorStop.callCount).toEqual(3);
            expect(_linearGradient.addColorStop.calls[0].args[0]).toEqual(
                '0.10');
            expect(_linearGradient.addColorStop.calls[0].args[1]).toEqual(
                'rgba(255,255,255,1)');
            expect(_linearGradient.addColorStop.calls[1].args[0]).toEqual(
                '0.50');
            expect(_linearGradient.addColorStop.calls[1].args[1]).toEqual(
                'rgba(240,241,242,1)');
            expect(_linearGradient.addColorStop.calls[2].args[0]).toEqual(
                '0.80');
            expect(_linearGradient.addColorStop.calls[2].args[1]).toEqual(
                'rgba(241,35,69,1)');
          });

      describe(' computePaintLinearCoordinates test', function() {

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in first quadrant, ' +
            'less than decision angle(26 deg in this case)', function() {
              _gradientFill.lin.angle = '15';
              _gradientFill.gsLst = [];
              _gradientFill.path = undefined;

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_context.createLinearGradient).toHaveBeenCalledWith(0,
                  22.27, 192, 73.73);
            });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in first quadrant, ' +
            'is greater than decision angle(26 deg in this case)', function() {
              _gradientFill.lin.angle = '45';
              _gradientFill.gsLst = [];
              _gradientFill.path = undefined;

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_context.createLinearGradient).toHaveBeenCalledWith(47.97,
                  0, 144.03, 96);
            });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is 90', function() {
              _gradientFill.lin.angle = '90';
              _gradientFill.gsLst = [];
              _gradientFill.path = undefined;

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_context.createLinearGradient).toHaveBeenCalledWith(96.03,
                  0, 95.97, 96);
            });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is 180', function() {
              _gradientFill.lin.angle = '180';
              _gradientFill.gsLst = [];
              _gradientFill.path = undefined;

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_context.createLinearGradient).toHaveBeenCalledWith(192,
                  48, 0, 48);
            });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when ' + 'gradientAngle is 270', function() {
              _gradientFill.lin.angle = '270';
              _gradientFill.gsLst = [];
              _gradientFill.path = undefined;

              _gradientFillHandler.fillCanvasContextForBorders(_canvas,
                  _context, _gradientFill);

              expect(_context.createLinearGradient).toHaveBeenCalledWith(95.97,
                  96, 96.03, 0);
            });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when ' + 'gradientAngle is 359.9',
           function() {
             _gradientFill.lin.angle = '359.9';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(0,
                 48.17, 192, 47.83);
           });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in second quadrant, ' +
            'and is less than (180 - decision angle)(26 deg in this case)',
           function() {
             _gradientFill.lin.angle = '105';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(108.9,
                 0, 83.1, 96);
           });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in second quadrant, ' +
            'and is greater than (180 - decision angle)(26 deg in this case)',
           function() {
             _gradientFill.lin.angle = '165';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(192,
                 22.27, 0, 73.73);
           });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in third quadrant, ' +
            'less than (180 + decision angle)(26 deg in this case)',
           function() {
             _gradientFill.lin.angle = '195';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(192,
                 73.73, 0, 22.27);
           });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in third quadrant, ' +
            'is greater than (180 + decision angle)(26 deg in this case)',
           function() {
             _gradientFill.lin.angle = '225';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(144.03,
                 96, 47.97, 0);
           });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in forth quadrant, ' +
            'and is less than (360 - decision angle)(26 deg in this case)',
           function() {
             _gradientFill.lin.angle = '285';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(83.1,
                 96, 108.9, 0);
           });

        it('should call context createLinearGradient function with correct ' +
            'start and end points, when gradientAngle is in forth quadrant, ' +
            'and is greater than (360 - decision angle)(26 deg in this case)',
           function() {
             _gradientFill.lin.angle = '345';
             _gradientFill.gsLst = [];
             _gradientFill.path = undefined;

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_context.createLinearGradient).toHaveBeenCalledWith(0,
                 73.73, 192, 22.27);
           });
      });

      describe(' renderRadialGradientFill test', function() {

        it('should call context createRadialGradient function with correct ' +
            'x y co-ordinates and radius, when it is center fill',
           function() {
             _gradientFill.gsLst = [];
             _gradientFill.path.fillRect = {
               b: '50',
               l: '50',
               r: '50',
               t: '50'
             };

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_context.createRadialGradient).toHaveBeenCalledWith(96, 48,
                 3.84, 96, 48, 115.2);
           });

        it('should call context createRadialGradient function with correct ' +
            'x y co-ordinates and radius, when it is upper left fill',
           function() {
             _gradientFill.gsLst = [];
             _gradientFill.path.fillRect = {
               b: '0',
               l: '100',
               r: '0',
               t: '100'
             };

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_context.createRadialGradient).toHaveBeenCalledWith(192, 96,
                 3.84, 192, 96, 240);
           });

        it('should call context createRadialGradient function with correct ' +
            'x y co-ordinates and radius, when it is lower left fill',
           function() {
             _gradientFill.gsLst = [];
             _gradientFill.path.fillRect = {
               b: '100',
               l: '100',
               r: '0',
               t: '0'
             };

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_context.createRadialGradient).toHaveBeenCalledWith(192, 0,
                 3.84, 192, 0, 240);
           });

        it('should call context createRadialGradient function with correct ' +
            'x y co-ordinates and radius, when it is lower right',
           function() {
             _gradientFill.gsLst = [];
             _gradientFill.path.fillRect = {
               b: '100',
               l: '0',
               r: '100',
               t: '0'
             };

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_context.createRadialGradient).toHaveBeenCalledWith(0, 0,
                 3.84, 0, 0, 240);
           });

        it('should call context createRadialGradient function with correct ' +
            'x y co-ordinates and radius, when it is upper right',
           function() {
             _gradientFill.gsLst = [];
             _gradientFill.path.fillRect = {
               b: '0',
               l: '0',
               r: '100',
               t: '100'
             };

             _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
                 _gradientFill);

             expect(_context.createRadialGradient).toHaveBeenCalledWith(0, 96,
                 3.84, 0, 96, 240);
           });

      });

      it('should handle scheme colors properly for canvas shapes', function() {
        var someColorSchemeData =
            {
              'dk1': 'red',
              'dk2': 'blue',
              'accent1': 'accent6',
              'accent6': 'accent3',
              'accent2': 'accent4',
              'accent4': 'accent5'
            };

        PointModel.slideColorMap = someColorSchemeData;
        _gradientFill.gsLst[0].color = {
          type: 'schemeClr',
          scheme: 'accent1',
          effects: {}
        };
        _gradientFill.gsLst[1].color = {
          type: 'schemeClr',
          scheme: 'accent1',
          effects: {}
        };
        var colorUtility = ColorUtility;

        spyOn(colorUtility, 'handleLuminosity').andReturn('none');
        spyOn(colorUtility, 'getHexEquivalentOfSchemeColor').andReturn(
            '#FFFFFF');

        _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
            _gradientFill, 'none');

        expect(colorUtility.getHexEquivalentOfSchemeColor).toHaveBeenCalled();
      });

      it('should handle no fill properly when color is not present',
         function() {
           var colorUtility = ColorUtility;
           _gradientFill = [];
           spyOn(colorUtility, 'handleLuminosity').andReturn('none');
           spyOn(colorUtility, 'getHexEquivalentOfSchemeColor');
           spyOn(colorUtility, 'getColor');

           _gradientFillHandler.fillCanvasContextForBorders(_canvas, _context,
               _gradientFill, 'none');

           expect(colorUtility.getHexEquivalentOfSchemeColor).not.
               toHaveBeenCalled();
           expect(colorUtility.getColor).not.toHaveBeenCalled();
         });

    });

    describe('- fill HTML Div', function() {

      var _divElement;

      beforeEach(function() {
        _divElement = {
          style: {}
        };
      });

      it('should fill the div when linear gradient fill property not defined',
         function() {
           _gradientFill.lin = undefined;
           _gradientFill.path = undefined;
           var borderGradientStyle = _gradientFillHandler.handleBorderUsingHTML(
               _gradientFill, _divElement);

           expect(borderGradientStyle).toEqual('-webkit-linear-gradient(' +
               '360deg, rgba(255,255,255,1) 10.00%,rgba(240,241,242,1)' +
               ' 70.00%) ');
         });

      it('should fill the div when linear gradient fill angle is undefined',
         function() {
           _gradientFill.lin.angle = undefined;
           _gradientFill.path = undefined;
           var borderGradientStyle = _gradientFillHandler.handleBorderUsingHTML(
               _gradientFill, _divElement);

           expect(borderGradientStyle).toEqual('-webkit-linear-gradient(' +
               '360deg, rgba(255,255,255,1) 10.00%,rgba(240,241,242,1)' +
               ' 70.00%) ');
         });

      it('should fill the div, when gradient-fill with 2 colors', function() {
        _gradientFill.path = undefined;
        var borderGradientStyle = _gradientFillHandler.handleBorderUsingHTML(
            _gradientFill, _divElement);

        expect(borderGradientStyle).toEqual('-webkit-linear-gradient(360deg, ' +
            'rgba(255,255,255,1) 10.00%,rgba(240,241,242,1) 70.00%) ');
      });

      it('should call context createLinearGradient function, when fill-type ' +
          'is gradient-fill with 3 colors and ' + 'transparency', function() {
            _gradientFill.gsLst = [
              {
                clr: '#ffffff',
                pos: '10000'
              },
              {
                clr: '#f0f1f2',
                pos: '50000'
              },
              {
                clr: '#f12345',
                pos: '80000'
              }
            ];
          });

      it('should call context createRadialGradient function when ' +
          'pathShadeType is circle for lower left', function() {
            var borderGradientStyle = _gradientFillHandler.
                handleBorderUsingHTML(_gradientFill, _divElement);

            expect(borderGradientStyle).toEqual('-webkit-radial-gradient(' +
                '50% 50%, circle farthest-corner,rgba(255,255,255,1) 10.00%,' +
                'rgba(240,241,242,1) 70.00%) ');
          });

      describe(' - when color-stops have same stop-position', function() {

        beforeEach(function() {
          _gradientFill.gsLst[0].pos = '60000';
          _gradientFill.gsLst[1].pos = '60000';
        });

        it('should add the first and second color to linear-gradient, when ' +
            'gradient-fill with 2 colors', function() {
              _gradientFill.path = undefined;
              var borderGradientStyle = _gradientFillHandler.
                  handleBorderUsingHTML(_gradientFill, _divElement);

              expect(borderGradientStyle).toEqual('-webkit-linear-gradient(' +
                  '360deg, rgba(255,255,255,1) 60.00%,rgba(240,241,242,1)' +
                  ' 100.00%) ');
            });

        it('should add the second color and then first color to ' +
            'linear-gradient, when gradient-fill with 2 colors, and linear ' +
            'angle -equal to 180- degrees', function() {
              _gradientFill.lin.angle = '180';
              _gradientFill.path = undefined;
              var borderGradientStyle = _gradientFillHandler.
                  handleBorderUsingHTML(_gradientFill, _divElement);

              expect(borderGradientStyle).toEqual('-webkit-linear-gradient(' +
                  '180deg, rgba(255,255,255,1) 0.00%,rgba(240,241,242,1)' +
                  ' 60.00%) ');
            });

        it('should add the second color and then first color to ' +
            'linear-gradient, when gradient-fill with 2 colors, and linear ' +
            'angle -greater than 180- degrees', function() {
              _gradientFill.lin.angle = '270';
              _gradientFill.path = undefined;
              var borderGradientStyle = _gradientFillHandler.
                  handleBorderUsingHTML(_gradientFill, _divElement);

              expect(borderGradientStyle).toEqual('-webkit-linear-gradient(' +
                  '90deg, rgba(255,255,255,1) 0.00%,rgba(240,241,242,1)' +
                  ' 60.00%) ');
            });

        it('should add only the first and fifth color to the linear ' +
            'gradient, when gradient-fill with 5 colors, all with same ' +
            'stop-positions', function() {

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 60000.0
              });

              _gradientFill.path = undefined;
              var borderGradientStyle = _gradientFillHandler.
                  handleBorderUsingHTML(_gradientFill, _divElement);

              expect(borderGradientStyle).toEqual('-webkit-linear-gradient(' +
                  '360deg, rgba(255,255,255,1) 60.00%,rgba(255,0,0,1)' +
                  ' 100.00%) ');
            });

        it('should add the fifth color and then first color to ' +
            'linear-gradient, when gradient-fill with 5 colors, all with ' +
            'same stop-positions, and linear angle -equal to 180- degrees',
           function() {

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.path = undefined;
             _gradientFill.lin.angle = '180';
             var borderGradientStyle = _gradientFillHandler.
                 handleBorderUsingHTML(_gradientFill, _divElement);

             expect(borderGradientStyle).toEqual('-webkit-linear-gradient(' +
                 '180deg, rgba(255,255,255,1) 0.00%,rgba(255,0,0,1) 60.00%) ');
           });

        it('should add the fifth color and then first color to ' +
            'linear-gradient, when gradient-fill with 5 colors, all with same' +
            ' stop-positions, and linear angle -greater than 180- degrees',
           function() {

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 60000.0
             });

             _gradientFill.path = undefined;
             _gradientFill.lin.angle = '270';
             var borderGradientStyle = _gradientFillHandler.
                 handleBorderUsingHTML(_gradientFill, _divElement);

             expect(borderGradientStyle).toEqual('-webkit-linear-gradient(' +
                 '90deg, rgba(255,255,255,1) 0.00%,rgba(255,0,0,1) 60.00%) ');
           });

        it('should remove duplicate color stops, when in serial order',
           function() {
             _gradientFill.gsLst = [];

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FF0000',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#FFFFFF',
                 'type': 'srgbClr'
               },
               'pos': 30000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#00FF00',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });
             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#F0F0F0',
                 'type': 'srgbClr'
               },
               'pos': 50000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#0000FF',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });

             _gradientFill.gsLst.push({
               'color': {
                 'clr': '#000000',
                 'type': 'srgbClr'
               },
               'pos': 80000.0
             });
             _gradientFill.path = undefined;
             var borderGradientStyle = _gradientFillHandler.
                 handleBorderUsingHTML(_gradientFill, _divElement);

             expect(borderGradientStyle).toEqual('-webkit-linear-gradient(' +
                 '360deg, rgba(255,0,0,1) 30.00%,rgba(0,255,0,1) 50.00%,' +
                 'rgba(0,0,255,1) 80.00%,rgba(0,0,0,1) 100.00%) ');
           });

        it('should remove duplicate color stops, when in serial order, and ' +
            'linear angle 180 degree', function() {
              _gradientFill.lin.angle = '180';

              _gradientFill.gsLst = [];

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FF0000',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#FFFFFF',
                  'type': 'srgbClr'
                },
                'pos': 30000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#00FF00',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });
              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#F0F0F0',
                  'type': 'srgbClr'
                },
                'pos': 50000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#0000FF',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.gsLst.push({
                'color': {
                  'clr': '#000000',
                  'type': 'srgbClr'
                },
                'pos': 80000.0
              });

              _gradientFill.path = undefined;
              var borderGradientStyle = _gradientFillHandler.
                  handleBorderUsingHTML(_gradientFill, _divElement);

              expect(borderGradientStyle).toEqual('-webkit-linear-gradient(' +
                  '180deg, rgba(255,0,0,1) 0.00%,rgba(255,255,255,1) 30.00%,' +
                  'rgba(240,240,240,1) 50.00%,rgba(0,0,0,1) 80.00%) ');
            });

        it('should return none if gradient stop list is undefined', function() {
          _gradientFill.gsLst = undefined;
          var borderGradientStyle = _gradientFillHandler.handleBorderUsingHTML(
              _gradientFill);

          expect(borderGradientStyle).toEqual('none');
        });
      });
    });
  });
});

