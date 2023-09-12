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
  'qowtRoot/dcp/pointHandlers/common/blipFillHandler',
  'qowtRoot/variants/utils/resourceLocator',
  'qowtRoot/utils/styleSheetsManager',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/drawing/pictureRecolor/point/recolorRequestGenerator',
  'qowtRoot/utils/imageUtils'
], function(BlipFillHandler,
            ResourceLocator,
            StyleSheetsManager,
            LayoutsManager,
            RecolorRequestGenerator,
            ImageUtils) {

  'use strict';

  describe('BlipFill handler test', function() {

    describe(' fill canvas context', function() {
      var _context, _image, _blipFill, _canvasDimensions,
          _paths;

      beforeEach(function() {
        _context = {
          drawImage: function() {
          },
          clip: function() {
          },
          translate: function() {
          },
          restore: function() {
          },
          fill: function() {
          },
          globalCompositeOperation: '',
          stroke: function() {
          },
          lineTo: function() {
          },
          moveTo: function() {
          },
          closePath: function() {
          }
        };

        _image = {
          addEventListener: function() {
          },
          src: ''
        };

        _blipFill = {
          type: 'blipFill',
          'blip': {
            'etp': 'img',
            'src': 'image source data'
          }
        };

        _paths = [
          [
            'lineTo(10,20)',
            'moveTo(15,25)',
            'closePath()'
          ]
        ];

      });

      describe(' with tile-type', function() {

        beforeEach(function() {
          _blipFill.fillMode = {
            'type': 'tileFill',
            'tileProps': {
              'Sx': '25',
              'Sy': '20',
              'Tx': '1047750',
              'Ty': '190500'
            }
          };

          _canvasDimensions = {
            width: 50,
            height: 18
          };

          _image.width = 100;
          _image.height = 75;
        });

        it('should fall back to default blip-fill properties when fill-mode ' +
            'is udnefined', function() {
              _blipFill.fillMode = undefined;

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_context, 'clip');
              spyOn(_context, 'drawImage');
              spyOn(_context, 'translate');
              spyOn(_context, 'restore');

              BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                  _blipFill, 'lighten', _image);

              expect(_context.drawImage.callCount).toEqual(4);
              expect(_context.drawImage.calls[0].args).toEqual(
                  [_image, -100, -75, 100, 75]);
              expect(_context.drawImage.calls[1].args).toEqual(
                  [_image, -100, 0, 100, 75]);
              expect(_context.drawImage.calls[2].args).toEqual(
                  [_image, 0, -75, 100, 75]);
              expect(_context.drawImage.calls[3].args).toEqual(
                  [_image, 0, 0, 100, 75]);

              expect(_context.restore).toHaveBeenCalled();
            });

        it('should set context drawImage with appropriate dimensions, when' +
            ' transparency and top alignment', function() {
              _blipFill.alpha = '40000';
              _blipFill.fillMode.tileProps.align = 'T';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_context, 'clip');
              spyOn(_context, 'drawImage');
              spyOn(_context, 'translate');
              spyOn(_context, 'restore');

              BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                  _blipFill, 'lighten', _image);

              expect(_context.drawImage.callCount).toEqual(6);
              expect(_context.drawImage.calls[0].args).toEqual(
                  [_image, -2.5, -10, 25, 15]);
              expect(_context.drawImage.calls[1].args).toEqual(
                  [_image, -2.5, 5, 25, 15]);
              expect(_context.drawImage.calls[2].args).toEqual(
                  [_image, 22.5, -10, 25, 15]);
              expect(_context.drawImage.calls[3].args).toEqual(
                  [_image, 22.5, 5, 25, 15]);
              expect(_context.drawImage.calls[4].args).toEqual(
                  [_image, 47.5, -10, 25, 15]);
              expect(_context.drawImage.calls[5].args).toEqual(
                  [_image, 47.5, 5, 25, 15]);

              expect(Math.floor(_context.globalAlpha * 1000)).toEqual(266);
              expect(_context.restore).toHaveBeenCalled();
            });

        it('should set context drawImage with appropriate dimensions, when' +
            ' top-left alignment', function() {
              _blipFill.fillMode.tileProps.align = 'TL';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_context, 'clip');
              spyOn(_context, 'drawImage');
              spyOn(_context, 'translate');
              spyOn(_context, 'restore');

              BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                  _blipFill, 'lighten', _image);

              expect(_context.drawImage.callCount).toEqual(6);
              expect(_context.drawImage.calls[0].args).toEqual(
                  [_image, -15, -10, 25, 15]);
              expect(_context.drawImage.calls[1].args).toEqual(
                  [_image, -15, 5, 25, 15]);
              expect(_context.drawImage.calls[2].args).toEqual(
                  [_image, 10, -10, 25, 15]);
              expect(_context.drawImage.calls[3].args).toEqual(
                  [_image, 10, 5, 25, 15]);
              expect(_context.drawImage.calls[4].args).toEqual(
                  [_image, 35, -10, 25, 15]);
              expect(_context.drawImage.calls[5].args).toEqual(
                  [_image, 35, 5, 25, 15]);
              expect(_context.restore).toHaveBeenCalled();
            });

        it('should set context drawImage with appropriate dimensions, when ' +
            'top-right alignment', function() {
              _blipFill.fillMode.tileProps.align = 'TR';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_context, 'clip');
              spyOn(_context, 'drawImage');
              spyOn(_context, 'translate');
              spyOn(_context, 'restore');

              BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                  _blipFill, 'lighten', _image);

              expect(_context.drawImage.callCount).toEqual(6);
              expect(_context.drawImage.calls[0].args).toEqual(
                  [_image, -15, -10, 25, 15]);
              expect(_context.drawImage.calls[1].args).toEqual(
                  [_image, -15, 5, 25, 15]);
              expect(_context.drawImage.calls[2].args).toEqual(
                  [_image, 10, -10, 25, 15]);
              expect(_context.drawImage.calls[3].args).toEqual(
                  [_image, 10, 5, 25, 15]);
              expect(_context.drawImage.calls[4].args).toEqual(
                  [_image, 35, -10, 25, 15]);
              expect(_context.drawImage.calls[5].args).toEqual(
                  [_image, 35, 5, 25, 15]);
              expect(_context.restore).toHaveBeenCalled();
            });

        it('should set context drawImage with appropriate dimensions, when' +
            ' left alignment', function() {
              _blipFill.fillMode.tileProps.align = 'L';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_context, 'clip');
              spyOn(_context, 'drawImage');
              spyOn(_context, 'translate');
              spyOn(_context, 'restore');

              BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                  _blipFill, 'lighten', _image);

              expect(_context.drawImage.callCount).toEqual(6);
              expect(_context.drawImage.calls[0].args).toEqual(
                  [_image, -15, -8.5, 25, 15]);
              expect(_context.drawImage.calls[1].args).toEqual(
                  [_image, -15, 6.5, 25, 15]);
              expect(_context.drawImage.calls[2].args).toEqual(
                  [_image, 10, -8.5, 25, 15]);
              expect(_context.drawImage.calls[3].args).toEqual(
                  [_image, 10, 6.5, 25, 15]);
              expect(_context.drawImage.calls[4].args).toEqual(
                  [_image, 35, -8.5, 25, 15]);
              expect(_context.drawImage.calls[5].args).toEqual(
                  [_image, 35, 6.5, 25, 15]);
              expect(_context.restore).toHaveBeenCalled();
            });

        it('should set context drawImage with appropriate dimensions, when ' +
            'fill-type is blip-fill with tiled image and center alignment',
           function() {
             _blipFill.fillMode.tileProps.align = 'C';

             spyOn(document, 'createElement').andReturn(_image);

             spyOn(_context, 'clip');
             spyOn(_context, 'drawImage');
             spyOn(_context, 'translate');
             spyOn(_context, 'restore');

             BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                 _blipFill, 'lighten', _image);

             expect(_context.drawImage.callCount).toEqual(6);
             expect(_context.drawImage.calls[0].args).toEqual(
                 [_image, -2.5, -8.5, 25, 15]);
             expect(_context.drawImage.calls[1].args).toEqual(
                 [_image, -2.5, 6.5, 25, 15]);
             expect(_context.drawImage.calls[2].args).toEqual(
                 [_image, 22.5, -8.5, 25, 15]);
             expect(_context.drawImage.calls[3].args).toEqual(
                 [_image, 22.5, 6.5, 25, 15]);
             expect(_context.drawImage.calls[4].args).toEqual(
                 [_image, 47.5, -8.5, 25, 15]);
             expect(_context.drawImage.calls[5].args).toEqual(
                 [_image, 47.5, 6.5, 25, 15]);
             expect(_context.restore).toHaveBeenCalled();
           });

        it('should set context drawImage with appropriate dimensions, when' +
            ' right alignment', function() {
              _blipFill.fillMode.tileProps.align = 'R';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_context, 'clip');
              spyOn(_context, 'drawImage');
              spyOn(_context, 'translate');
              spyOn(_context, 'restore');

              BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                  _blipFill, 'lighten', _image);

              expect(_context.drawImage.callCount).toEqual(6);
              expect(_context.drawImage.calls[0].args).toEqual(
                  [_image, -15, -8.5, 25, 15]);
              expect(_context.drawImage.calls[1].args).toEqual(
                  [_image, -15, 6.5, 25, 15]);
              expect(_context.drawImage.calls[2].args).toEqual(
                  [_image, 10, -8.5, 25, 15]);
              expect(_context.drawImage.calls[3].args).toEqual(
                  [_image, 10, 6.5, 25, 15]);
              expect(_context.drawImage.calls[4].args).toEqual(
                  [_image, 35, -8.5, 25, 15]);
              expect(_context.drawImage.calls[5].args).toEqual(
                  [_image, 35, 6.5, 25, 15]);
              expect(_context.restore).toHaveBeenCalled();
            });

        it('should set context drawImage with appropriate dimensions, when' +
            ' bottom-left alignment', function() {
              _blipFill.fillMode.tileProps.align = 'BL';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_context, 'clip');
              spyOn(_context, 'drawImage');
              spyOn(_context, 'translate');
              spyOn(_context, 'restore');

              BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                  _blipFill, 'lighten', _image);

              expect(_context.drawImage.callCount).toEqual(6);
              expect(_context.drawImage.calls[0].args).toEqual(
                  [_image, -15, -7, 25, 15]);
              expect(_context.drawImage.calls[1].args).toEqual(
                  [_image, -15, 8, 25, 15]);
              expect(_context.drawImage.calls[2].args).toEqual(
                  [_image, 10, -7, 25, 15]);
              expect(_context.drawImage.calls[3].args).toEqual(
                  [_image, 10, 8, 25, 15]);
              expect(_context.drawImage.calls[4].args).toEqual(
                  [_image, 35, -7, 25, 15]);
              expect(_context.drawImage.calls[5].args).toEqual(
                  [_image, 35, 8, 25, 15]);
              expect(_context.restore).toHaveBeenCalled();
            });

        it('should set context drawImage with appropriate dimensions, when' +
            ' bottom alignment', function() {
              _blipFill.fillMode.tileProps.align = 'B';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_context, 'clip');
              spyOn(_context, 'drawImage');
              spyOn(_context, 'translate');
              spyOn(_context, 'restore');

              BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                  _blipFill, 'lighten', _image);

              expect(_context.drawImage.callCount).toEqual(6);
              expect(_context.drawImage.calls[0].args).toEqual(
                  [_image, -2.5, -7, 25, 15]);
              expect(_context.drawImage.calls[1].args).toEqual(
                  [_image, -2.5, 8, 25, 15]);
              expect(_context.drawImage.calls[2].args).toEqual(
                  [_image, 22.5, -7, 25, 15]);
              expect(_context.drawImage.calls[3].args).toEqual(
                  [_image, 22.5, 8, 25, 15]);
              expect(_context.drawImage.calls[4].args).toEqual(
                  [_image, 47.5, -7, 25, 15]);
              expect(_context.drawImage.calls[5].args).toEqual(
                  [_image, 47.5, 8, 25, 15]);
              expect(_context.restore).toHaveBeenCalled();
            });

        it('should set context drawImage with appropriate dimensions, when' +
            ' bottom-right alignment', function() {
              _blipFill.fillMode.tileProps.align = 'BR';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_context, 'clip');
              spyOn(_context, 'drawImage');
              spyOn(_context, 'translate');
              spyOn(_context, 'restore');

              BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                  _blipFill, 'lighten', _image);

              expect(_context.drawImage.callCount).toEqual(6);
              expect(_context.drawImage.calls[0].args).toEqual(
                  [_image, -15, -7, 25, 15]);
              expect(_context.drawImage.calls[1].args).toEqual(
                  [_image, -15, 8, 25, 15]);
              expect(_context.drawImage.calls[2].args).toEqual(
                  [_image, 10, -7, 25, 15]);
              expect(_context.drawImage.calls[3].args).toEqual(
                  [_image, 10, 8, 25, 15]);
              expect(_context.drawImage.calls[4].args).toEqual(
                  [_image, 35, -7, 25, 15]);
              expect(_context.drawImage.calls[5].args).toEqual(
                  [_image, 35, 8, 25, 15]);
              expect(_context.restore).toHaveBeenCalled();
            });
      });

      describe(' with stretch-type', function() {

        beforeEach(function() {
          _blipFill.fillMode = {
            'type': 'stretchFill'
          };

          _canvasDimensions = {
            width: 384,
            height: 192
          };
        });

        it('should set context drawImage with appropriate dimensions, when ' +
            'no transparency', function() {
              _blipFill.fillMode.fillRect = {
                'b': '10',
                'l': '14',
                'r': '6',
                't': '40'
              };

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_context, 'clip');
              spyOn(_context, 'drawImage');
              spyOn(_context, 'translate');

              BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                  _blipFill, 'lighten', _image);

              expect(_context.clip).toHaveBeenCalled();

              expect(_context.drawImage).toHaveBeenCalledWith(
                  _image, '53.76', '76.80', '307.20', '96.00');
            });

        it('should set context drawImage with appropriate dimensions, when' +
            ' fillRect having negative values and transparency', function() {
              _blipFill.fillMode.fillRect = {
                'b': '-10',
                'l': '-14',
                'r': '-6',
                't': '-40'
              };

              _blipFill.alpha = '400000';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_context, 'clip');
              spyOn(_context, 'drawImage');
              spyOn(_context, 'translate');

              BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                  _blipFill, 'lighten', _image);

              expect(_context.drawImage).toHaveBeenCalledWith(
                  _image, '-53.76', '-76.80', '460.80', '288.00');

              expect(Math.floor(_context.globalAlpha * 1000)).toEqual(2666);
            });

        it('should set correct transparency when path.fill is lighten',
           function() {
             _blipFill.fillMode.fillRect = {
               'b': '10',
               'l': '14',
               'r': '6',
               't': '40'
             };

             _blipFill.alpha = '100000';

             var fn = {
               apply: function() {
               }
             };

             _paths[0].fill = 'lighten';


             spyOn(document, 'createElement').andReturn(_image);

             spyOn(_context, 'clip');
             spyOn(_context, 'drawImage');
             spyOn(_context, 'translate');
             spyOn(_context, 'globalCompositeOperation');
             spyOn(_context, 'fill');
             spyOn(fn, 'apply');

             BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                 _blipFill, 'lighten', _image);

             expect(Math.floor(_context.globalAlpha * 1000)).toEqual(666);
           });

        it('should set correct transparency when path.fill is lightenLess',
           function() {
             _blipFill.fillMode.fillRect = {
               'b': '10',
               'l': '14',
               'r': '6',
               't': '40'
             };

             _blipFill.alpha = '100000';

             var fn = {
               apply: function() {
               }
             };

             _paths[0].fill = 'lightenLess';


             spyOn(document, 'createElement').andReturn(_image);

             spyOn(_context, 'clip');
             spyOn(_context, 'drawImage');
             spyOn(_context, 'translate');
             spyOn(_context, 'globalCompositeOperation');
             spyOn(_context, 'fill');
             spyOn(fn, 'apply');

             BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                 _blipFill, 'lighten', _image);

             expect(Math.floor(_context.globalAlpha * 1000)).toEqual(666);
           });

        it('should set correct transparency when path.fill is darken',
           function() {
             _blipFill.fillMode.fillRect = {
               'b': '10',
               'l': '14',
               'r': '6',
               't': '40'
             };

             _blipFill.alpha = '100000';

             var fn = {
               apply: function() {
               }
             };

             _paths[0].fill = 'darken';


             spyOn(document, 'createElement').andReturn(_image);

             spyOn(_context, 'fill');
             spyOn(fn, 'apply');

             BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                 _blipFill, 'darken', _image);

             expect(Math.floor(_context.globalAlpha * 1000)).toEqual(625);
             expect(_context.fill).toHaveBeenCalled();
           });

        it('should set correct transparency when path.fill is darkenLess',
           function() {
             _blipFill.fillMode.fillRect = {
               'b': '10',
               'l': '14',
               'r': '6',
               't': '40'
             };

             _blipFill.alpha = '100000';

             var fn = {
               apply: function() {
               }
             };

             _paths[0].fill = 'darkenLess';


             spyOn(document, 'createElement').andReturn(_image);

             spyOn(_context, 'fill');
             spyOn(fn, 'apply');

             BlipFillHandler.fillCanvasContext(_canvasDimensions, _context,
                 _blipFill, 'darkenLess', _image);

             expect(Math.floor(_context.globalAlpha * 1000)).toEqual(769);
             expect(_context.fill).toHaveBeenCalled();
           });
      });
    });

    describe(' HTML div fill test ', function() {
      var _shapeFillDiv, fill, _imagePath = 'image source data';

      beforeEach(function() {
        _shapeFillDiv = {
          id: '16',
          style: {}
        };

        fill = {
          type: 'blipFill',
          'blip': {
            'etp': 'img',
            'src': 'image source data'
          }
        };

        spyOn(ResourceLocator, 'pathToUrl').andReturn(_imagePath);
      });

      describe('stretch Blip fill ', function() {
        beforeEach(function() {
          fill.fillMode = {
            type: 'stretchFill'
          };
        });

        it('should set background style classes to div, with no transparency',
           function() {
             fill.fillMode.fillRect = {
               'b': '10',
               'l': '14',
               'r': '6',
               't': '40'
             };

             spyOn(RecolorRequestGenerator, 'generate').andCallThrough();
             spyOn(ImageUtils, 'applyEffects').andCallThrough();

             BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

             expect(RecolorRequestGenerator.generate).toHaveBeenCalled();
             expect(ImageUtils.applyEffects).not.toHaveBeenCalled();
             expect(_shapeFillDiv.style['-webkit-background-size']).toEqual(
                 '80% 50%');
             expect(_shapeFillDiv.style['background-image']).toEqual(
                 'url(\'' + 'image source data' + '\')');
             expect(_shapeFillDiv.style['background-repeat']).toEqual(
                 'no-repeat');
             expect(_shapeFillDiv.style['background-position']).toEqual(
                 '70% 80%');
           });

        it('should set background style classes to div when negative values,' +
            ' and with transparency', function() {
              fill.fillMode.fillRect = {
                'b': '-10',
                'l': '-14',
                'r': '-6',
                't': '-40'
              };
              fill.alpha = '40000';

              BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

              expect(_shapeFillDiv.style['-webkit-background-size']).toEqual(
                  '120% 150%');
              expect(_shapeFillDiv.style['background-image']).toEqual(
                  'url(\'' + 'image source data' + '\')');
              expect(_shapeFillDiv.style['background-repeat']).toEqual(
                  'no-repeat');
              expect(_shapeFillDiv.style['background-position']).toEqual(
                  '70% 80%');
              expect(_shapeFillDiv.style.opacity).toEqual(0.4);
            });

        it('should not apply recoloring to background image if effects are ' +
            'to be applied explicitly over div\'s style attribute', function() {
              // adding a 'grayscale' recolor effect
              fill.blip.effects = [{
                type: 'grayscl'
              }];

              fill.fillMode.fillRect = {
                'b': '10',
                'l': '14',
                'r': '6',
                't': '40'
              };

              spyOn(RecolorRequestGenerator, 'generate').andCallThrough();
              spyOn(ImageUtils, 'applyEffects');

              BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

              expect(RecolorRequestGenerator.generate).toHaveBeenCalled();
              expect(ImageUtils.applyEffects).not.toHaveBeenCalled();
            });

        it('should apply recoloring to background image if effects are ' +
            'specified and to be applied implicitly', function() {
              var fillStyleClassName = '.slideBackground[masterid="E111"]',
                  pictureRecolorRequest;
              // adding a 'grayscale' recolor effect
              fill.blip.effects = [{
                type: 'grayscl'
              }];

              fill.fillMode.fillRect = {
                'b': '10',
                'l': '14',
                'r': '6',
                't': '40'
              };

              pictureRecolorRequest = RecolorRequestGenerator.generate(fill.
                  blip);
              spyOn(RecolorRequestGenerator, 'generate').andReturn(
                  pictureRecolorRequest);
              spyOn(ImageUtils, 'applyEffects');

              var styleString = BlipFillHandler.getStyleString(fill,
                  fillStyleClassName);

              expect(RecolorRequestGenerator.generate).toHaveBeenCalled();
              expect(ImageUtils.applyEffects).toHaveBeenCalledWith(_imagePath,
                  pictureRecolorRequest);

              expect(styleString).toContain('background-repeat:no-repeat;');
              expect(styleString).toContain('background-position:70% 80%;');
            });

        it('should not apply recoloring to background image if no effects are' +
            ' specified', function() {
              var fillStyleClassName = '.slideBackground[masterid="E111"]';
              fill.blip.effects = [];

              fill.fillMode.fillRect = {
                'b': '10',
                'l': '14',
                'r': '6',
                't': '40'
              };

              spyOn(RecolorRequestGenerator, 'generate').andCallThrough();
              spyOn(ImageUtils, 'applyEffects');

              BlipFillHandler.getStyleString(fill, fillStyleClassName);

              expect(RecolorRequestGenerator.generate).toHaveBeenCalled();
              expect(ImageUtils.applyEffects).not.toHaveBeenCalled();
            });
      });

      describe('tile Blip fill ', function() {
        var _image, _imageLoadEvent;

        beforeEach(function() {
          fill.fillMode = {
            'type': 'tileFill',
            'tileProps': {
              'Sx': '50',
              'Sy': '30',
              'Tx': '95250',
              'Ty': '95250'
            }
          };

          _image = {
            addEventListener: function() {
            },
            src: '',
            width: 100,
            height: 75
          };

          _imageLoadEvent = {
            target: {
              width: 50,
              height: 50
            }
          };
        });

        it('should apply recoloring to background tile image if effects are ' +
            'specified, with appropriate tile alignment', function() {
              var fillStyleClassName = '.slideBackground[masterid="E111"]',
                  pictureRecolorRequest;

              // adding a 'grayscale' recolor effect
              fill.blip.effects = [{
                type: 'grayscl'
              }];
              fill.fillMode.tileProps.align = 'BR';

              pictureRecolorRequest = RecolorRequestGenerator.generate(fill.
                  blip);

              spyOn(document, 'createElement').andReturn(_image);
              spyOn(_image, 'addEventListener');
              spyOn(RecolorRequestGenerator, 'generate').andReturn(
                  pictureRecolorRequest);
              spyOn(ImageUtils, 'applyEffects');
              spyOn(StyleSheetsManager, 'addStyleToClass');

              var styleString = BlipFillHandler.getStyleString(fill,
                  fillStyleClassName);
              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(RecolorRequestGenerator.generate).toHaveBeenCalled();
              expect(ImageUtils.applyEffects).toHaveBeenCalled();

              expect(styleString).not.toContain('background-image');
              expect(styleString).toContain('background-repeat:repeat;');
              expect(StyleSheetsManager.addStyleToClass).toHaveBeenCalledWith(
                  fillStyleClassName, '-webkit-background-size', '25px 15px');
              expect(styleString).toContain('background-position:right ' +
                  'bottom;');
            });

        it('should fall-back to default blip-fill properties when fill-mode' +
            ' is undefined', function() {
              fill.fillMode = undefined;

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');

              BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(_shapeFillDiv.style['background-image']).toEqual(
                  'url(\'' + 'image source data' + '\')');

              expect(_shapeFillDiv.style['background-repeat']).toEqual(
                  'repeat');
              expect(_shapeFillDiv.style['-webkit-background-size']).toEqual(
                  '50px 50px');
              expect(_shapeFillDiv.style['background-position']).toEqual(
                  'top left');
            });

        it('should modify the -thumbnailToSlideShapeFillMap- from ' +
            'LayoutsManager', function() {
              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');

              var thumbnailToSlideShapeFillMap =
                  LayoutsManager.getThumbnailToSlideShapeFillMap();
              thumbnailToSlideShapeFillMap[_shapeFillDiv.id] = {
                style: {}
              };

              BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(LayoutsManager.getThumbnailToSlideShapeFillMap()[
                  _shapeFillDiv.id].style['-webkit-background-size']).toEqual(
                      '25px 15px');
            });

        it('should set background style classes to div, and with ' +
            'transparency and top alignment', function() {
              fill.alpha = '40000';
              fill.fillMode.tileProps.align = 'T';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');

              BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(_shapeFillDiv.style['background-image']).toEqual(
                  'url(\'' + 'image source data' + '\')');

              expect(_shapeFillDiv.style['background-repeat']).toEqual(
                  'repeat');
              expect(_shapeFillDiv.style['-webkit-background-size']).toEqual(
                  '25px 15px');
              expect(_shapeFillDiv.style['background-position']).toEqual(
                  'top center');

              expect(_shapeFillDiv.style.opacity).toEqual(0.4);
            });

        it('should set background style classes to div, and top-left ' +
            'alignment', function() {
              fill.fillMode.tileProps.align = 'TL';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');

              BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(_shapeFillDiv.style['background-image']).toEqual(
                  'url(\'' + 'image source data' + '\')');

              expect(_shapeFillDiv.style['background-repeat']).toEqual(
                  'repeat');
              expect(_shapeFillDiv.style['-webkit-background-size']).toEqual(
                  '25px 15px');
              expect(_shapeFillDiv.style['background-position']).toEqual(
                  'top left');
            });

        it('should set background style classes to div, and top-right ' +
            'alignment', function() {
              fill.fillMode.tileProps.align = 'TR';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');

              BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(_shapeFillDiv.style['background-image']).toEqual(
                  'url(\'' + 'image source data' + '\')');

              expect(_shapeFillDiv.style['background-repeat']).toEqual(
                  'repeat');
              expect(_shapeFillDiv.style['-webkit-background-size']).toEqual(
                  '25px 15px');
              expect(_shapeFillDiv.style['background-position']).toEqual(
                  'top right');
            });

        it('should set background style classes to div, and left alignment',
           function() {
             fill.fillMode.tileProps.align = 'L';

             spyOn(document, 'createElement').andReturn(_image);

             spyOn(_image, 'addEventListener');

             BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

             _image.addEventListener.calls[0].args[1](_imageLoadEvent);

             expect(_shapeFillDiv.style['background-image']).toEqual(
                 'url(\'' + 'image source data' + '\')');

             expect(_shapeFillDiv.style['background-repeat']).toEqual('repeat');
             expect(_shapeFillDiv.style['-webkit-background-size']).toEqual(
                 '25px 15px');
             expect(_shapeFillDiv.style['background-position']).toEqual(
                 'center left');
           });

        it('should set background style classes to div, and center alignment',
           function() {
             fill.fillMode.tileProps.align = 'C';

             spyOn(document, 'createElement').andReturn(_image);

             spyOn(_image, 'addEventListener');

             BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

             _image.addEventListener.calls[0].args[1](_imageLoadEvent);

             expect(_shapeFillDiv.style['background-image']).toEqual(
                 'url(\'' + 'image source data' + '\')');
             expect(_shapeFillDiv.style['background-repeat']).toEqual('repeat');
             expect(_shapeFillDiv.style['-webkit-background-size']).toEqual(
                 '25px 15px');
             expect(_shapeFillDiv.style['background-position']).toEqual(
                 'center center');
           });

        it('should set background style classes to div, and right alignment',
           function() {
             fill.fillMode.tileProps.align = 'R';

             spyOn(document, 'createElement').andReturn(_image);

             spyOn(_image, 'addEventListener');

             BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

             _image.addEventListener.calls[0].args[1](_imageLoadEvent);

             expect(_shapeFillDiv.style['background-image']).toEqual(
                 'url(\'' + 'image source data' + '\')');

             expect(_shapeFillDiv.style['background-repeat']).toEqual('repeat');
             expect(_shapeFillDiv.style['-webkit-background-size']).toEqual(
                 '25px 15px');
             expect(_shapeFillDiv.style['background-position']).toEqual(
                 'center right');
           });

        it('should set background style classes to div, and bottom-left ' +
            'alignment', function() {
              fill.fillMode.tileProps.align = 'BL';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');

              BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(_shapeFillDiv.style['background-image']).toEqual(
                  'url(\'' + 'image source data' + '\')');

              expect(_shapeFillDiv.style['background-repeat']).toEqual(
                  'repeat');
              expect(_shapeFillDiv.style['-webkit-background-size']).toEqual(
                  '25px 15px');
              expect(_shapeFillDiv.style['background-position']).toEqual(
                  'left bottom');
            });

        it('should set background style classes to div, and bottom alignment',
           function() {
             fill.fillMode.tileProps.align = 'B';

             spyOn(document, 'createElement').andReturn(_image);

             spyOn(_image, 'addEventListener');

             BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

             _image.addEventListener.calls[0].args[1](_imageLoadEvent);

             expect(_shapeFillDiv.style['background-image']).toEqual(
                 'url(\'' + 'image source data' + '\')');

             expect(_shapeFillDiv.style['background-repeat']).toEqual('repeat');
             expect(_shapeFillDiv.style['-webkit-background-size']).toEqual(
                 '25px 15px');
             expect(_shapeFillDiv.style['background-position']).toEqual(
                 'center bottom');
           });

        it('should set background style classes to div, and bottom-right ' +
            'alignment', function() {
              fill.fillMode.tileProps.align = 'BR';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');

              BlipFillHandler.handleUsingHTML(fill, _shapeFillDiv);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(_shapeFillDiv.style['background-image']).toEqual(
                  'url(\'' + 'image source data' + '\')');

              expect(_shapeFillDiv.style['background-repeat']).toEqual(
                  'repeat');
              expect(_shapeFillDiv.style['-webkit-background-size']).toEqual(
                  '25px 15px');
              expect(_shapeFillDiv.style['background-position']).toEqual(
                  'right bottom');
            });
      });
    });

    describe('image filesystem path or data test', function() {

      it('should modify source for image when fill type is blip fill',
         function() {
           spyOn(ResourceLocator, 'pathToUrl').andReturn('qualifiedPath');
           var shapeDiv = {
             style: {}
           };

           var fill = {
             type: 'blipFill',
             'blip': {
               'etp': 'img',
               'src': 'image source data'
             },
             'fillMode': {
               type: 'dummy'
             }
           };
           BlipFillHandler.handleUsingHTML(fill, shapeDiv);
           expect(shapeDiv.style['background-image']).toEqual('url(\'' +
               'qualifiedPath' + '\')');
         });
    });

    describe(' for place holder fill Style ', function() {
      var fill;

      beforeEach(function() {
        fill = {
          type: 'blipFill',
          'blip': {
            'etp': 'img',
            'src': 'image source data'
          }
        };

        spyOn(ResourceLocator, 'pathToUrl').andReturn('image source data');
      });

      describe('stretch Blip fill ', function() {
        beforeEach(function() {
          fill.fillMode = {
            type: 'stretchFill'
          };
        });

        it('should set background style classes to place Holder, with no ' +
            'transparency', function() {
              fill.fillMode.fillRect = {
                'b': '10',
                'l': '14',
                'r': '6',
                't': '40'
              };

              var blipFillStyle = BlipFillHandler.getStyleString(fill);

              expect(blipFillStyle).toContain(
                  '-webkit-background-size:80% 50%');
              expect(blipFillStyle).toContain(
                  'background-image:url(\'' + 'image source data' + '\')');
              expect(blipFillStyle).toContain('background-repeat:no-repeat');
              expect(blipFillStyle).toContain('background-position:70% 80%');
            });

        it('should set background style classes to place Holder when ' +
            'negative values, and with transparency',
           function() {
             fill.fillMode.fillRect = {
               'b': '-10',
               'l': '-14',
               'r': '-6',
               't': '-40'
             };
             fill.alpha = '40000';

             var blipFillStyle = BlipFillHandler.getStyleString(fill);

             expect(blipFillStyle).toContain(
                 '-webkit-background-size:120% 150%');
             expect(blipFillStyle).toContain(
                 'background-image:url(\'' + 'image source data' + '\')');
             expect(blipFillStyle).toContain('background-repeat:no-repeat');
             expect(blipFillStyle).toContain('background-position:70% 80%');
             expect(blipFillStyle).toContain('opacity:0.4');
           });
      });

      describe('tile Blip fill ', function() {
        var _image, _fillStyleClassName = 'fillStyleClassName',
            _imageLoadEvent;

        beforeEach(function() {
          fill.fillMode = {
            'type': 'tileFill',
            'tileProps': {
              'imgWt': '50',
              'imgHt': '50',
              'Sx': '100',
              'Sy': '100'
            }
          };

          _image = {
            addEventListener: function() {
            },
            src: '',
            width: 100,
            height: 75
          };

          _imageLoadEvent = {
            target: {
              width: 50,
              height: 50
            }
          };
        });

        it('should set background style classes to place Holder, and with ' +
            'transparency and top alignment', function() {
              fill.alpha = '40000';
              fill.fillMode.tileProps.align = 'T';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');
              spyOn(StyleSheetsManager, 'addStyleToClass');

              var blipFillStyle = BlipFillHandler.getStyleString(
                  fill, _fillStyleClassName);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(StyleSheetsManager.addStyleToClass).toHaveBeenCalledWith(
                  _fillStyleClassName, '-webkit-background-size', '50px 50px');
              expect(blipFillStyle).toContain('background-image:url(\'' +
                  'image source data' + '\')');
              expect(blipFillStyle).toContain('background-repeat:repeat');
              expect(blipFillStyle).toContain('background-position:top center');
              expect(blipFillStyle).toContain('opacity:0.4');
            });

        it('should set background style classes to place Holder, and ' +
            'top-left alignment', function() {
              fill.fillMode.tileProps.align = 'TL';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');
              spyOn(StyleSheetsManager, 'addStyleToClass');

              var blipFillStyle = BlipFillHandler.getStyleString(
                  fill, _fillStyleClassName);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(StyleSheetsManager.addStyleToClass).toHaveBeenCalledWith(
                  _fillStyleClassName, '-webkit-background-size', '50px 50px');
              expect(blipFillStyle).toContain('background-image:url(\'' +
                  'image source data' + '\')');
              expect(blipFillStyle).toContain('background-repeat:repeat');
              expect(blipFillStyle).toContain('background-position:top left');
            });

        it('should set background style classes to place Holder, and ' +
            'top-right alignment', function() {
              fill.fillMode.tileProps.align = 'TR';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');
              spyOn(StyleSheetsManager, 'addStyleToClass');

              var blipFillStyle = BlipFillHandler.getStyleString(
                  fill, _fillStyleClassName);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(StyleSheetsManager.addStyleToClass).toHaveBeenCalledWith(
                  _fillStyleClassName, '-webkit-background-size', '50px 50px');
              expect(blipFillStyle).toContain('background-image:url(\'' +
                  'image source data' + '\')');
              expect(blipFillStyle).toContain('background-repeat:repeat');
              expect(blipFillStyle).toContain('background-position:top right');
            });

        it('should set background style classes to place Holder, and left ' +
            'alignment', function() {
              fill.fillMode.tileProps.align = 'L';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');
              spyOn(StyleSheetsManager, 'addStyleToClass');

              var blipFillStyle = BlipFillHandler.getStyleString(
                  fill, _fillStyleClassName);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(StyleSheetsManager.addStyleToClass).toHaveBeenCalledWith(
                  _fillStyleClassName, '-webkit-background-size', '50px 50px');
              expect(blipFillStyle).toContain('background-image:url(\'' +
                  'image source data' + '\')');
              expect(blipFillStyle).toContain('background-repeat:repeat');
              expect(blipFillStyle).toContain(
                  'background-position:center left');
            });

        it('should set background style classes to place Holder, and center' +
            ' alignment', function() {
              fill.fillMode.tileProps.align = 'C';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');
              spyOn(StyleSheetsManager, 'addStyleToClass');

              var blipFillStyle = BlipFillHandler.getStyleString(
                  fill, _fillStyleClassName);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(StyleSheetsManager.addStyleToClass).toHaveBeenCalledWith(
                  _fillStyleClassName, '-webkit-background-size', '50px 50px');
              expect(blipFillStyle).toContain('background-image:url(\'' +
                  'image source data' + '\')');
              expect(blipFillStyle).toContain('background-repeat:repeat');
              expect(blipFillStyle).toContain('background-position:center' +
                  ' center');
            });

        it('should set background style classes to place Holder, and right ' +
            'alignment', function() {
              fill.fillMode.tileProps.align = 'R';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');
              spyOn(StyleSheetsManager, 'addStyleToClass');

              var blipFillStyle = BlipFillHandler.getStyleString(
                  fill, _fillStyleClassName);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(StyleSheetsManager.addStyleToClass).toHaveBeenCalledWith(
                  _fillStyleClassName, '-webkit-background-size', '50px 50px');
              expect(blipFillStyle).toContain('background-image:url(\'' +
                  'image source data' + '\')');
              expect(blipFillStyle).toContain('background-repeat:repeat');
              expect(blipFillStyle).toContain('background-position:center' +
                  ' right');
            });

        it('should set background style classes to place Holder, and ' +
            'bottom-left alignment', function() {
              fill.fillMode.tileProps.align = 'BL';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');
              spyOn(StyleSheetsManager, 'addStyleToClass');

              var blipFillStyle = BlipFillHandler.getStyleString(
                  fill, _fillStyleClassName);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(StyleSheetsManager.addStyleToClass).toHaveBeenCalledWith(
                  _fillStyleClassName, '-webkit-background-size', '50px 50px');
              expect(blipFillStyle).toContain('background-image:url(\'' +
                  'image source data' + '\')');
              expect(blipFillStyle).toContain('background-repeat:repeat');
              expect(blipFillStyle).toContain('background-position:' +
                  'left bottom');
            });

        it('should set background style classes to place Holder, and bottom ' +
            'alignment', function() {
              fill.fillMode.tileProps.align = 'B';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');
              spyOn(StyleSheetsManager, 'addStyleToClass');

              var blipFillStyle = BlipFillHandler.getStyleString(
                  fill, _fillStyleClassName);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(StyleSheetsManager.addStyleToClass).toHaveBeenCalledWith(
                  _fillStyleClassName, '-webkit-background-size', '50px 50px');

              expect(blipFillStyle).toContain('background-image:url(\'' +
                  'image source data' + '\')');
              expect(blipFillStyle).toContain('background-repeat:repeat');
              expect(blipFillStyle).toContain('background-position:center' +
                  ' bottom');
            });

        it('should set background style classes to place Holder, and ' +
            'bottom-right alignment', function() {
              fill.fillMode.tileProps.align = 'BR';

              spyOn(document, 'createElement').andReturn(_image);

              spyOn(_image, 'addEventListener');
              spyOn(StyleSheetsManager, 'addStyleToClass');

              var blipFillStyle = BlipFillHandler.getStyleString(
                  fill, _fillStyleClassName);

              _image.addEventListener.calls[0].args[1](_imageLoadEvent);

              expect(StyleSheetsManager.addStyleToClass).toHaveBeenCalledWith(
                  _fillStyleClassName, '-webkit-background-size', '50px 50px');
              expect(blipFillStyle).toContain('background-image:url(\'' +
                  'image source data' + '\')');
              expect(blipFillStyle).toContain('background-repeat:repeat');
              expect(blipFillStyle).toContain('background-position:right' +
                  ' bottom');
            });
      });
    });
  });
});
