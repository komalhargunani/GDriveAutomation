/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */


/**
 * Outline handler Tests
 */
define([
  'qowtRoot/dcp/decorators/outlineDecorator',
  'qowtRoot/models/point',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/dcp/pointHandlers/common/gradientFillHandler'
], function(OutlineDecorator,
            PointModel,
            ColorUtility,
            GradientFillHandler) {

  'use strict';

  describe('Outline handler Tests', function() {
    var outlineHandler = OutlineDecorator.create();

    describe('for html shapes', function() {
      it('should render outline correctly using HTML', function() {

        var shapeProperties = {
          'xfrm': {
            ext: {
              'cx': 3008313,
              'cy': 4691063
            },
            'flipV': false
          },
          'geom': {
            'prst': 11
          },
          'ln': {
            w: 3145,
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

        var element = document.createElement('div');

        outlineHandler.handleUsingHTML(element, shapeProperties);

        expect(element.style['border-left-color']).toEqual('rgb(255, 0, 0)');
        expect(element.style['border-right-color']).toEqual('rgb(255, 0, 0)');
        expect(element.style['border-top-color']).toEqual('rgb(255, 0, 0)');
        expect(element.style['border-bottom-color']).toEqual('rgb(255, 0, 0)');

      });

      it('should not render outline using HTML when fill type is noFill',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 11
             },
             'ln': {
               fill: {
                 type: 'noFill'
               }
             }
           };

           var element = document.createElement('div');

           outlineHandler.handleUsingHTML(element, shapeProperties);

           expect(element.style['border-style']).toEqual('none');
         });

      it('should not render outline using HTML when fill type is available ' +
          'but is undefined', function() {

            var shapeProperties = {
              'xfrm': {
                ext: {
                  'cx': 3008313,
                  'cy': 4691063
                },
                'flipV': false
              },
              'geom': {
                'prst': 11
              },
              'ln': {
                fill: {
                  type: undefined,
                  color: '#FF0000',
                  alpha: 1
                }
              }
            };

            var element = document.createElement('div');

            outlineHandler.handleUsingHTML(element, shapeProperties);

            expect(element.style['border-style']).toEqual('');
          });

      it('should not render outline using HTML when fill type is not available',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 11
             },
             'ln': {
               fill: {
                 clr: '#FF0000',
                 alpha: 1
               }
             }
           };

           var element = document.createElement('div');

           outlineHandler.handleUsingHTML(element, shapeProperties);

           expect(element.style['border-style']).toEqual('');
         });

      it('should render outline correctly using HTML when when w is less ' +
          'than 1 px then fall back to 1', function() {

            var shapeProperties = {
              'xfrm': {
                ext: {
                  'cx': 3008313,
                  'cy': 4691063
                },
                'flipV': false
              },
              'geom': {
                'prst': 88
              },
              'ln': {
                w: 3145,
                fill: {
                  type: 'solidFill',
                  color: {
                    type: 'srgbClr',
                    clr: '#ffff00',
                    effects: {}
                  }
                }
              }
            };

            var element = document.createElement('div');

            outlineHandler.handleUsingHTML(element, shapeProperties);

            expect(element.style['border-left-width']).toEqual('1px');
            expect(element.style['border-right-width']).toEqual('1px');
            expect(element.style['border-top-width']).toEqual('1px');
            expect(element.style['border-bottom-width']).toEqual('1px');

          });

      it('should render outline correctly using HTML when when w is 0',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 88
             },
             'ln': {
               w: 0
             }
           };

           var element = document.createElement('div');

           outlineHandler.handleUsingHTML(element, shapeProperties);

           expect(element.style['border-left-style']).toEqual('');
           expect(element.style['border-right-style']).toEqual('');
           expect(element.style['border-top-style']).toEqual('');
           expect(element.style['border-bottom-style']).toEqual('');

         });

      it('should render outline correctly using HTML when when w is undefined',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 88
             },
             'ln': {
               w: undefined
             }
           };

           var element = document.createElement('div');

           outlineHandler.handleUsingHTML(element, shapeProperties);

           expect(element.style['border-left-style']).toEqual('');
           expect(element.style['border-right-style']).toEqual('');
           expect(element.style['border-top-style']).toEqual('');
           expect(element.style['border-bottom-style']).toEqual('');

         });

      it('should render outline correctly using HTML when when prstDash ' +
          'is solid', function() {

            var shapeProperties = {
              'xfrm': {
                ext: {
                  'cx': 3008313,
                  'cy': 4691063
                },
                'flipV': false
              },
              'geom': {
                'prst': 88
              },
              'ln': {
                prstDash: 'solid'
              }
            };

            var element = document.createElement('div');

            outlineHandler.handleUsingHTML(element, shapeProperties);

            expect(element.style['border-left-style']).toEqual('solid');
            expect(element.style['border-right-style']).toEqual('solid');
            expect(element.style['border-top-style']).toEqual('solid');
            expect(element.style['border-bottom-style']).toEqual('solid');

          });

      it('should render outline correctly using HTML when prstDash is sysDot',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 88
             },
             'ln': {
               prstDash: 'sysDot'
             }
           };

           var element = document.createElement('div');

           outlineHandler.handleUsingHTML(element, shapeProperties);

           expect(element.style['border-left-style']).toEqual('dotted');
           expect(element.style['border-right-style']).toEqual('dotted');
           expect(element.style['border-top-style']).toEqual('dotted');
           expect(element.style['border-bottom-style']).toEqual('dotted');

         });

      it('should render outline correctly using HTML when prstDash is dot',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 88
             },
             'ln': {
               prstDash: 'dot'
             }
           };

           var element = document.createElement('div');

           outlineHandler.handleUsingHTML(element, shapeProperties);

           expect(element.style['border-left-style']).toEqual('dotted');
           expect(element.style['border-right-style']).toEqual('dotted');
           expect(element.style['border-top-style']).toEqual('dotted');
           expect(element.style['border-bottom-style']).toEqual('dotted');

         });

      it('should render outline correctly using HTML when prstDash is not ' +
          'solid or sysDot', function() {

            var shapeProperties = {
              'xfrm': {
                ext: {
                  'cx': 3008313,
                  'cy': 4691063
                },
                'flipV': false
              },
              'geom': {
                'prst': 88
              },
              'ln': {
                prstDash: 'dash'
              }
            };

            var element = document.createElement('div');

            outlineHandler.handleUsingHTML(element, shapeProperties);

            expect(element.style['border-left-style']).toEqual('dashed');
            expect(element.style['border-right-style']).toEqual('dashed');
            expect(element.style['border-top-style']).toEqual('dashed');
            expect(element.style['border-bottom-style']).toEqual('dashed');

          });

      it('should decorate with shape properties with 1st color stop when ' +
          'fill is gradient fill prstDash is other that solid', function() {
            var shapeObj = {
              spPr: {
                ln: {
                  prstDash: 'dashDot',
                  fill: {
                    type: 'gradientFill',
                    lin: {
                      angle: 0
                    },
                    gsLst: [
                      {
                        'color': {
                          'alpha': 1.0,
                          'clr': '#FFFFFF',
                          'type': 'srgbClr'
                        },
                        'pos': 10000.0
                      }
                    ]
                  }
                }
              }
            };

            var colorJSON = {
              rgb: '#ffffff'
            };

            var element = document.createElement('DIV');
            element.style['border-color'] = '';

            spyOn(ColorUtility, 'getColor').andReturn(colorJSON);

            outlineHandler.handleUsingHTML(element, shapeObj.spPr);

            expect(ColorUtility.getColor).toHaveBeenCalledWith(
                shapeObj.spPr.ln.fill.gsLst[0].color);
          });

      it('should fill outline color if alpha is undefined using html',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 11
             },
             'ln': {
               w: 3145,
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

           var element = document.createElement('DIV');
           element.style['border-color'] = '';

           outlineHandler.handleUsingHTML(element, shapeProperties);

           expect(element.style['border-left-color']).toEqual('rgb(255, 0, 0)');
           expect(element.style['border-right-color']).toEqual(
               'rgb(255, 0, 0)');
           expect(element.style['border-top-color']).toEqual('rgb(255, 0, 0)');
           expect(element.style['border-bottom-color']).toEqual(
               'rgb(255, 0, 0)');
         });

      it('should call getColor method of colorUtility when fill is solidFill',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 11
             },
             'ln': {
               w: 3145,
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

           var colorJSON = {
             rgb: '#ffffff'
           };

           var element = document.createElement('DIV');
           element.style['border-color'] = '';

           spyOn(ColorUtility, 'getColor').andReturn(colorJSON);

           outlineHandler.handleUsingHTML(element, shapeProperties);

           expect(ColorUtility.getColor).toHaveBeenCalledWith(
               shapeProperties.ln.fill.color);
         });

      it('should call getColor method of colorUtility when fill is patternFill',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 11
             },
             'ln': {
               w: 3145,
               fill: {
                 type: 'patternFill',
                 fgClr: {
                   type: 'srgbClr',
                   clr: '#ff0000',
                   effects: {}
                 },
                 bgClr: {
                   type: 'srgbClr',
                   clr: '#ff0000',
                   effects: {}
                 }
               }
             }
           };

           var colorJSON = {
             rgb: '#ffffff'
           };

           var element = document.createElement('DIV');
           element.style['border-color'] = '';

           spyOn(ColorUtility, 'getColor').andReturn(colorJSON);

           outlineHandler.handleUsingHTML(element, shapeProperties);

           expect(ColorUtility.getColor).toHaveBeenCalledWith(
               shapeProperties.ln.fill.fgClr);
         });

      it('should set prstDash as solid when fill is patternFill', function() {

        var shapeProperties = {
          'xfrm': {
            ext: {
              'cx': 3008313,
              'cy': 4691063
            },
            'flipV': false
          },
          'geom': {
            'prst': 11
          },
          'ln': {
            w: 3145,
            fill: {
              type: 'patternFill',
              fgClr: {
                type: 'srgbClr',
                clr: '#ff0000',
                effects: {}
              },
              bgClr: {
                type: 'srgbClr',
                clr: '#ff0000',
                effects: {}
              }
            }
          }
        };

        var element = document.createElement('DIV');
        element.style['border-color'] = '';

        outlineHandler.handleUsingHTML(element, shapeProperties);

        expect(element.style['border-style']).toEqual('solid');
      });

      it('should fill outline color if borderPorperties is undefined',
         function() {

           var shapeProperties;

           var element = document.createElement('DIV');
           element.style['border-color'] = '';

           outlineHandler.handleUsingHTML(element, shapeProperties);

           expect(element.style['border-left-color']).toEqual('');
           expect(element.style['border-right-color']).toEqual('');
           expect(element.style['border-top-color']).toEqual('');
           expect(element.style['border-bottom-color']).toEqual('');
         });

      it('should fill outline color with gradient fill when fill is ' +
          'gradient fill', function() {
            var shapeProperties = {
              ln: {
                w: 3145,
                fill: {
                  type: 'gradientFill',
                  lin: {
                    angle: 0
                  },
                  gsLst: [
                    {
                      'color': {
                        effects: {
                          'alpha': 1.0
                        },
                        'clr': '#FFFFFF',
                        'type': 'srgbClr'
                      },
                      'pos': 10000.0
                    },
                    {
                      'color': {
                        'alpha': 1.0,
                        'clr': '#f0f1f2',
                        'type': 'srgbClr'
                      },
                      'pos': 70000.0
                    }
                  ]
                },
                prstDash: 'solid'
              }
            };

            var element = document.createElement('DIV');
            spyOn(GradientFillHandler, 'handleBorderUsingHTML').andReturn(
                '-webkit-linear-gradient(270deg, rgb(217, 150, 148) ' +
                '50%, rgb(0, 176, 80) 100%)');

            outlineHandler.handleUsingHTML(element, shapeProperties);

            var borderImageSliceStyle = element.style['border-image-slice'];

            expect(GradientFillHandler.handleBorderUsingHTML).
                toHaveBeenCalledWith(shapeProperties.ln.fill);
            expect(element.style['border-image-source']).toEqual(
                '-webkit-linear-gradient(270deg, rgb(217, 150, 148) 50%, ' +
                'rgb(0, 176, 80) 100%)');
            expect(parseInt(borderImageSliceStyle, 10)).toEqual(1);
            expect(element.style['border-image-repeat']).toEqual('repeat');
          });

    });

    describe('for place Holder shapes', function() {
      it('should render outline correctly using HTML', function() {

        var shapeProperties = {
          'xfrm': {
            ext: {
              'cx': 3008313,
              'cy': 4691063
            },
            'flipV': false
          },
          'geom': {
            'prst': 11
          },
          'ln': {
            w: 3145,
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

        var outlineStyleText = outlineHandler.getPlaceHolderStyle(
            shapeProperties.ln);

        expect(outlineStyleText).toContain('border-color:rgba(255,0,0,1);');

      });

      it('should not render outline using HTML when fill type is noFill',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 11
             },
             'ln': {
               fill: {
                 type: 'noFill'
               }
             }
           };

           var outlineStyleText = outlineHandler.getPlaceHolderStyle(
               shapeProperties.ln);

           expect(outlineStyleText).toContain('border-style:none;');
         });

      it('In case of table cell, getPlaceHolderStyle should return ' +
          'border-style as -none- when fill type is noFill', function() {

            PointModel.currentTable.isProcessingTable = true;

            var shapeProperties = {
              'xfrm': {
                ext: {
                  'cx': 3008313,
                  'cy': 4691063
                },
                'flipV': false
              },
              'geom': {
                'prst': 11
              },
              'ln': {
                fill: {
                  type: 'noFill'
                }
              }
            };

            var outlineStyleText = outlineHandler.getPlaceHolderStyle(
                shapeProperties.ln);

            expect(outlineStyleText).toContain('border-style:none;');

            PointModel.currentTable.isProcessingTable = false;
          });

      it('should not render outline using HTML when fill type is available ' +
          'but is undefined', function() {

            var shapeProperties = {
              'xfrm': {
                ext: {
                  'cx': 3008313,
                  'cy': 4691063
                },
                'flipV': false
              },
              'geom': {
                'prst': 11
              },
              'ln': {
                fill: {
                  type: undefined,
                  clr: '#FF0000',
                  alpha: 1
                }
              }
            };

            var outlineStyleText = outlineHandler.getPlaceHolderStyle(
                shapeProperties.ln);

            expect(outlineStyleText).not.toContain('border-style:none;');
          });

      it('should not render outline using HTML when fill type is not available',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 11
             },
             'ln': {
               fill: {
                 clr: '#FF0000',
                 alpha: 1
               }
             }
           };


           var outlineStyleText = outlineHandler.getPlaceHolderStyle(
               shapeProperties.ln);

           expect(outlineStyleText).not.toContain('border-style:none;');
         });

      it('should render outline correctly using HTML when when w is less ' +
          'than 1 px then fall back to 1', function() {

            var shapeProperties = {
              'xfrm': {
                ext: {
                  'cx': 3008313,
                  'cy': 4691063
                },
                'flipV': false
              },
              'geom': {
                'prst': 88
              },
              'ln': {
                w: 3145,
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

            var outlineStyleText = outlineHandler.getPlaceHolderStyle(
                shapeProperties.ln);

            expect(outlineStyleText).toContain('border-width:1px');

          });

      it('should render outline correctly using HTML when when w is 0',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 88
             },
             'ln': {
               w: 0,
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

           var outlineStyleText = outlineHandler.getPlaceHolderStyle(
               shapeProperties.ln);

           expect(outlineStyleText).not.toContain('border-style:none;');

         });

      it('should set prstDash as solid if it is undefined and phTyp is sldmt',
         function() {

           var outlineObj = {
             w: 3145,
             fill: {
               type: 'solidFill',
               color: {
                 type: 'srgbClr',
                 clr: '#ff0000',
                 effects: {}
               }
             }
           };
           PointModel.currentPHLevel = 'sldmt';

           outlineHandler.getPlaceHolderStyle(outlineObj);
           PointModel.currentPHLevel = undefined;

           expect(outlineObj.prstDash).toEqual('solid');

         });

      it('should set prstDash as solid if it is undefined and phTyp is sldmt',
         function() {

           var outlineObj = {
             w: 3145,
             fill: {
               type: 'solidFill',
               color: {
                 type: 'srgbClr',
                 clr: '#ff0000',
                 effects: {}
               }
             }
           };

           PointModel.currentTable.isProcessingTable = true;

           outlineHandler.getPlaceHolderStyle(outlineObj);
           PointModel.currentTable.isProcessingTable = false;

           expect(outlineObj.prstDash).toEqual('solid');

         });

      it('should fill outline color if alpha is undefined using html',
         function() {

           var shapeProperties = {
             'xfrm': {
               ext: {
                 'cx': 3008313,
                 'cy': 4691063
               },
               'flipV': false
             },
             'geom': {
               'prst': 11
             },
             'ln': {
               w: 3145,
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

           var element = document.createElement('DIV');
           element.style['border-color'] = '';


           var outlineStyleText = outlineHandler.getPlaceHolderStyle(
               shapeProperties.ln);

           expect(outlineStyleText).toContain('border-color:rgba(255,0,0,1);');
         });

    });
  });
});
