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
  'qowtRoot/drawing/geometry/arrowPathGenerator'
], function(ArrowPathGenerator) {

  'use strict';


  describe('Arrow Path Generator Test', function() {
    var arrowPathGenerator = ArrowPathGenerator;

    it('should generate HeadEnd arrow paths only if the arrow headEnd is ' +
        'present in fillColorBean', function() {
          var paths = [[{
            'name': 'beginPath',
            'args': []
          }, {
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
            'name': 'quadraticCurveTo',
            'args': [1, 2, 3, 4, 5, 6]
          }, {
            'name': 'bezierCurveTo',
            'args': [2, 4, 6, 8, 10, 12]
          }]];

          var fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'oval',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: undefined,
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };

          arrowPathGenerator.handle(fillColorBean, paths);
          expect(paths.length).toEqual(3);

        });


    it('should not alter the paths for curved lines - arcTo', function() {
      var paths = [[
        'moveTo(15,25)',
        'arc(10,20,12,3.1,0,false)',
        'arc(10,20,12,3.1,0,true)'
      ]];

      var fillColorBean = {
        fill: {
          type: 'solidFill',
          clr: '#FFFFFF'
        },
        outlineFill: {
          type: 'solidFill',
          lineWidth: 72,
          data: {
            clr: '#FFFFFF'
          }
        },
        ends: {
          headendtype: 'oval',
          headendlength: 'long',
          headendwidth: 'medium',
          tailendtype: 'arrow',
          tailendlength: 'medium',
          tailendwidth: 'small'
        },
        prstDash: 'solid'
      };
      arrowPathGenerator.handle(fillColorBean, paths);
      expect(paths[0][0]).toEqual('moveTo(15,25)');
      expect(paths[0][1]).toEqual('arc(10,20,12,3.1,0,false)');
      expect(paths[0][2]).toEqual('arc(10,20,12,3.1,0,true)');

      fillColorBean = {
        fill: {
          type: 'solidFill',
          clr: '#FFFFFF'
        },
        outlineFill: {
          type: 'solidFill',
          lineWidth: 72,
          data: {
            clr: '#FFFFFF'
          }
        },
        ends: {
          headendtype: 'none',
          headendlength: 'long',
          headendwidth: 'medium',
          tailendtype: undefined,
          tailendlength: 'medium',
          tailendwidth: 'small'
        },
        prstDash: 'solid'
      };

      arrowPathGenerator.handle(fillColorBean, paths);
      expect(paths[0][0]).toEqual('moveTo(15,25)');
      expect(paths[0][1]).toEqual('arc(10,20,12,3.1,0,false)');
      expect(paths[0][2]).toEqual('arc(10,20,12,3.1,0,true)');

      fillColorBean = {
        fill: {
          type: 'solidFill',
          clr: '#FFFFFF'
        },
        outlineFill: {
          type: 'solidFill',
          lineWidth: 72,
          data: {
            clr: '#FFFFFF'
          }
        },
        ends: {
          headendtype: 'arrow',
          headendlength: 'long',
          headendwidth: 'medium',
          tailendtype: 'none',
          tailendlength: 'medium',
          tailendwidth: 'small'
        },
        prstDash: 'solid'
      };

      arrowPathGenerator.handle(fillColorBean, paths);
      expect(paths[0][0]).toEqual('moveTo(15,25)');
      expect(paths[0][1]).toEqual('arc(10,20,12,3.1,0,false)');
      expect(paths[0][2]).toEqual('arc(10,20,12,3.1,0,true)');

      fillColorBean = {
        fill: {
          type: 'solidFill',
          clr: '#FFFFFF'
        },
        outlineFill: {
          type: 'solidFill',
          lineWidth: 72,
          data: {
            clr: '#FFFFFF'
          }
        },
        ends: {
          headendtype: 'none',
          headendlength: 'long',
          headendwidth: 'medium',
          tailendtype: 'arrow',
          tailendlength: 'medium',
          tailendwidth: 'small'
        },
        prstDash: 'solid'
      };

      arrowPathGenerator.handle(fillColorBean, paths);
      expect(paths[0][0]).toEqual('moveTo(15,25)');
      expect(paths[0][1]).toEqual('arc(10,20,12,3.1,0,false)');
      expect(paths[0][2]).toEqual('arc(10,20,12,3.1,0,true)');
    });


    it('should not alter the paths for curved lines - quadraticCurveTo',
        function() {
          var paths = [[
            'moveTo(15,25)',
            'quadraticCurveTo(1,2,3,4,5,6)'
          ]];

          var fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'oval',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: 'arrow',
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };
          arrowPathGenerator.handle(fillColorBean, paths);
          expect(paths[0][0]).toEqual('moveTo(15,25)');
          expect(paths[0][1]).toEqual('quadraticCurveTo(1,2,3,4,5,6)');

          fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'none',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: undefined,
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };

          arrowPathGenerator.handle(fillColorBean, paths);
          expect(paths[0][0]).toEqual('moveTo(15,25)');
          expect(paths[0][1]).toEqual('quadraticCurveTo(1,2,3,4,5,6)');

          fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'arrow',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: 'none',
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };

          arrowPathGenerator.handle(fillColorBean, paths);
          expect(paths[0][0]).toEqual('moveTo(15,25)');
          expect(paths[0][1]).toEqual('quadraticCurveTo(1,2,3,4,5,6)');

          fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'none',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: 'arrow',
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };

          arrowPathGenerator.handle(fillColorBean, paths);
          expect(paths[0][0]).toEqual('moveTo(15,25)');
          expect(paths[0][1]).toEqual('quadraticCurveTo(1,2,3,4,5,6)');
        });


    it('should not alter the paths for curved lines - bezierCurveTo',
        function() {
          var paths = [[
            'moveTo(15,25)',
            'bezierCurveTo(2,4,6,8,10,12)'
          ]];

          var fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'oval',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: 'arrow',
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };
          arrowPathGenerator.handle(fillColorBean, paths);
          expect(paths[0][0]).toEqual('moveTo(15,25)');
          expect(paths[0][1]).toEqual('bezierCurveTo(2,4,6,8,10,12)');

          fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'none',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: undefined,
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };

          arrowPathGenerator.handle(fillColorBean, paths);
          expect(paths[0][0]).toEqual('moveTo(15,25)');
          expect(paths[0][1]).toEqual('bezierCurveTo(2,4,6,8,10,12)');

          fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'arrow',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: 'none',
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };

          arrowPathGenerator.handle(fillColorBean, paths);
          expect(paths[0][0]).toEqual('moveTo(15,25)');
          expect(paths[0][1]).toEqual('bezierCurveTo(2,4,6,8,10,12)');

          fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'none',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: 'arrow',
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };

          arrowPathGenerator.handle(fillColorBean, paths);
          expect(paths[0][0]).toEqual('moveTo(15,25)');
          expect(paths[0][1]).toEqual('bezierCurveTo(2,4,6,8,10,12)');
        });


    it('original paths should not be changed if HeadEnd arrow paths are ' +
        'appended', function() {
          var paths = [[{
            'name': 'beginPath',
            'args': []
          }, {
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
            'name': 'quadraticCurveTo',
            'args': [1, 2, 3, 4, 5, 6]
          }, {
            'name': 'bezierCurveTo',
            'args': [2, 4, 6, 8, 10, 12]
          }]];

          var fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'oval',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: undefined,
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };

          arrowPathGenerator.handle(fillColorBean, paths);

          //new
          expect(paths[1][0].name).toEqual('beginPath');


          expect(paths[1][1].name).toEqual('lineTo');
          expect(paths[1][1].args[0]).toEqual(10);
          expect(paths[1][1].args[1]).toEqual(20);

          expect(paths[1][2].name).toEqual('moveTo');
          expect(paths[1][2].args[0]).toEqual(15);
          expect(paths[1][2].args[1]).toEqual(25);

          expect(paths[1][3].name).toEqual('closePath');

          expect(paths[2][0].name).toEqual('quadraticCurveTo');
          expect(paths[2][0].args[0]).toEqual(1);
          expect(paths[2][0].args[1]).toEqual(2);
          expect(paths[2][0].args[2]).toEqual(3);
          expect(paths[2][0].args[3]).toEqual(4);
          expect(paths[2][0].args[4]).toEqual(5);
          expect(paths[2][0].args[5]).toEqual(6);

          expect(paths[2][1].name).toEqual('bezierCurveTo');
          expect(paths[2][1].args[0]).toEqual(2);
          expect(paths[2][1].args[1]).toEqual(4);
          expect(paths[2][1].args[2]).toEqual(6);
          expect(paths[2][1].args[3]).toEqual(8);
          expect(paths[2][1].args[4]).toEqual(10);
          expect(paths[2][1].args[5]).toEqual(12);
        });


    it('should generate TailEnd arrow paths only if the arrow Tail is ' +
        'present in fillColorBean', function() {
          var paths = [[{
            'name': 'beginPath',
            'args': []
          }, {
            'name': 'lineTo',
            'args': [10, 20]
          }, {
            'name': 'moveTo',
            'args': [15, 25]
          }],
          [{
            'name': 'quadraticCurveTo',
            'args': [1, 2, 3, 4, 5, 6]
          }, {
            'name': 'bezierCurveTo',
            'args': [2, 4, 6, 8, 10, 12]
          }]];

          var fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'none',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: 'diamond',
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };
          arrowPathGenerator.handle(fillColorBean, paths);
          expect(paths.length).toEqual(3);
        });

    it('original paths should not be changed if TailEnd arrow paths are ' +
        'appended', function() {
          var paths = [[
            'beginPath()',
            'lineTo(10,20)',
            'moveTo(15,25)',
            'closePath()'
          ], [
            'quadraticCurveTo(1,2,3,4,5,6)',
            'bezierCurveTo(2,4,6,8,10,12)'
          ]];

          var fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'none',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: 'oval',
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };

          arrowPathGenerator.handle(fillColorBean, paths);
          expect(paths[0][0]).toEqual('beginPath()');
          expect(paths[0][1]).toEqual('lineTo(10,20)');
          expect(paths[0][2]).toEqual('moveTo(15,25)');
          expect(paths[0][3]).toEqual('closePath()');

          expect(paths[1][0]).toEqual('quadraticCurveTo(1,2,3,4,5,6)');
          expect(paths[1][1]).toEqual('bezierCurveTo(2,4,6,8,10,12)');
        });


    it('should generate arrow head and tail paths only if the arrow head and ' +
        'tail are present in fillColorBean', function() {
          var paths = [[{
            'name': 'beginPath',
            'args': []
          }, {
            'name': 'lineTo',
            'args': [10, 20]
          }, {
            'name': 'moveTo',
            'args': [15, 25]
          }],
          [{
            'name': 'quadraticCurveTo',
            'args': [1, 2, 3, 4, 5, 6]
          }, {
            'name': 'bezierCurveTo',
            'args': [2, 4, 6, 8, 10, 12]
          }]];

          var fillColorBean1 = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'arrow',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: 'oval',
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };
          arrowPathGenerator.handle(fillColorBean1, paths);
          expect(paths.length).toEqual(4);
        });


    it('original paths should not be changed if HeadEnd and TailEnd arrow ' +
        'paths are appended', function() {
          var paths = [[{
            'name': 'beginPath',
            'args': []
          }, {
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
            'name': 'quadraticCurveTo',
            'args': [1, 2, 3, 4, 5, 6]
          }, {
            'name': 'bezierCurveTo',
            'args': [2, 4, 6, 8, 10, 12]
          }]];


          var fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'arrow',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: 'oval',
              tailendlength: 'medium',
              tailendwidth: 'small'
           },
           prstDash: 'solid'
         };

         arrowPathGenerator.handle(fillColorBean, paths);
         //new
         expect(paths[1][0].name).toEqual('beginPath');


         expect(paths[1][1].name).toEqual('lineTo');
         expect(paths[1][1].args[0]).toEqual(10);
         expect(paths[1][1].args[1]).toEqual(20);

         expect(paths[1][2].name).toEqual('moveTo');
         expect(paths[1][2].args[0]).toEqual(15);
         expect(paths[1][2].args[1]).toEqual(25);

         expect(paths[1][3].name).toEqual('closePath');

         expect(paths[2][0].name).toEqual('quadraticCurveTo');
         expect(paths[2][0].args[0]).toEqual(1);
         expect(paths[2][0].args[1]).toEqual(2);
         expect(paths[2][0].args[2]).toEqual(3);
         expect(paths[2][0].args[3]).toEqual(4);
         expect(paths[2][0].args[4]).toEqual(5);
         expect(paths[2][0].args[5]).toEqual(6);

         expect(paths[2][1].name).toEqual('bezierCurveTo');
         expect(paths[2][1].args[0]).toEqual(2);
         expect(paths[2][1].args[1]).toEqual(4);
         expect(paths[2][1].args[2]).toEqual(6);
         expect(paths[2][1].args[3]).toEqual(8);
         expect(paths[2][1].args[4]).toEqual(10);
         expect(paths[2][1].args[5]).toEqual(12);
       });

    it('should draw correct arrow when type is oval if HeadEnd arrow paths ' +
        'are appended', function() {

          var paths = [[{
            'name': 'beginPath',
            'args': []
          }, {
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
            'name': 'beginPath',
            'args': []
          }, {
            'name': 'lineTo',
            'args': [10, 20]
          }, {
            'name': 'moveTo',
            'args': [15, 25]
          }, {
            'name': 'closePath',
            'args': []
          }]];

          var fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'oval',
              headendlength: 'medium',
              headendwidth: 'small',
              tailendtype: 'none',
              tailendlength: 'long',
              tailendwidth: 'medium'
            },
            prstDash: 'solid'
          };

          arrowPathGenerator.handle(fillColorBean, paths);

          expect(paths[0][0].name).toEqual('save');
          expect(paths[0][1].name).toEqual('translate');
          expect(paths[0][2].name).toEqual('save');
          expect(paths[0][3].name).toEqual('rotate');
          expect(paths[0][4].name).toEqual('save');
          expect(paths[0][5].name).toEqual('scale');
          expect(paths[0][6].name).toEqual('beginPath');
          expect(paths[0][7].name).toEqual('arc');
          expect(paths[0][7].args[2]).toEqual(48);
          expect(paths[0][8].name).toEqual('closePath');
          expect(paths[0][9].name).toEqual('restore');
          expect(paths[0][10].name).toEqual('restore');
          expect(paths[0][11].name).toEqual('restore');

          expect(paths[1][0].name).toEqual('beginPath');
          expect(paths[1][1].name).toEqual('lineTo');
          expect(paths[1][1].args[0]).toEqual(10);
          expect(paths[1][1].args[1]).toEqual(20);
          expect(paths[1][2].name).toEqual('moveTo');
          expect(paths[1][2].args[0]).toEqual(15);
          expect(paths[1][2].args[1]).toEqual(25);
          expect(paths[1][3].name).toEqual('closePath');

          expect(paths[2][0].name).toEqual('beginPath');
          expect(paths[2][1].name).toEqual('lineTo');
          expect(paths[2][1].args[0]).toEqual(10);
          expect(paths[2][1].args[1]).toEqual(20);
          expect(paths[2][2].name).toEqual('moveTo');
          expect(paths[2][2].args[0]).toEqual(15);
          expect(paths[2][2].args[1]).toEqual(25);
          expect(paths[2][3].name).toEqual('closePath');
        });

    it('should draw correct arrow when type is oval if TailEnd arrow paths ' +
        'are appended', function() {

          var paths = [[{
            'name': 'beginPath',
            'args': []
          }, {
            'name': 'lineTo',
            'args': [10, 20]
          }, {
            'name': 'moveTo',
            'args': [15, 25]
          }, {
            'name': 'lineTo',
            'args': [15, 25]
          }],
          [{
            'name': 'beginPath',
            'args': []
          }, {
            'name': 'lineTo',
            'args': [10, 20]
          }, {
            'name': 'moveTo',
            'args': [15, 25]
          }, {
            'name': 'lineTo',
            'args': [15, 25]
          }]];


          var fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'none',
              headendlength: 'medium',
              headendwidth: 'medium',
              tailendtype: 'oval',
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };

          arrowPathGenerator.handle(fillColorBean, paths);

          expect(paths[0][0].name).toEqual('beginPath');
          expect(paths[0][1].name).toEqual('lineTo');
          expect(paths[0][1].args[0]).toEqual(10);
          expect(paths[0][1].args[1]).toEqual(20);
          expect(paths[0][2].name).toEqual('moveTo');
          expect(paths[0][2].args[0]).toEqual(15);
          expect(paths[0][2].args[1]).toEqual(25);
          expect(paths[0][3].name).toEqual('lineTo');
          expect(paths[0][3].args[0]).toEqual(15);
          expect(paths[0][3].args[1]).toEqual(25);

          expect(paths[1][0].name).toEqual('beginPath');
          expect(paths[1][1].name).toEqual('lineTo');
          expect(paths[1][1].args[0]).toEqual(10);
          expect(paths[1][1].args[1]).toEqual(20);
          expect(paths[1][2].name).toEqual('moveTo');
          expect(paths[1][2].args[0]).toEqual(15);
          expect(paths[1][2].args[1]).toEqual(25);
          expect(paths[1][3].name).toEqual('lineTo');
          expect(paths[1][3].args[0]).toEqual(15);
          expect(paths[1][3].args[1]).toEqual(25);

          expect(paths[2][0].name).toEqual('save');
          expect(paths[2][1].name).toEqual('translate');
          expect(paths[2][2].name).toEqual('save');
          expect(paths[2][3].name).toEqual('rotate');
          expect(paths[2][4].name).toEqual('save');
          expect(paths[2][5].name).toEqual('scale');
          expect(paths[2][6].name).toEqual('beginPath');
          expect(paths[2][7].name).toEqual('arc');
          expect(paths[2][7].args[2]).toEqual(48);
          expect(paths[2][8].name).toEqual('closePath');
          expect(paths[2][9].name).toEqual('restore');
          expect(paths[2][10].name).toEqual('restore');
          expect(paths[2][11].name).toEqual('restore');
        });


    it('should not generate arrow paths if the arrow head and tail are not ' +
        'present in fillColorBean', function() {
          var paths = [[
            'beginPath()',
            'lineTo(10,20)',
            'moveTo(15,25)',
            'closePath()'
          ], [
            'quadraticCurveTo(1,2,3,4,5,6)',
            'bezierCurveTo(2,4,6,8,10,12)'
          ]];


          var fillColorBean1 = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: undefined,
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: 'none',
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };
          arrowPathGenerator.handle(fillColorBean1, paths);
          expect(paths.length).toEqual(2);

        });


    it('original paths should not be changed no arrow paths are appended',
        function() {
          var paths = [[
            'beginPath()',
            'lineTo(10,20)',
            'moveTo(15,25)',
            'closePath()'
          ], [
            'quadraticCurveTo(1,2,3,4,5,6)',
            'bezierCurveTo(2,4,6,8,10,12)'
          ]];

          var fillColorBean = {
            fill: {
              type: 'solidFill',
              clr: '#FFFFFF'
            },
            outlineFill: {
              type: 'solidFill',
              lineWidth: 72,
              data: {
                clr: '#FFFFFF'
              }
            },
            ends: {
              headendtype: 'none',
              headendlength: 'long',
              headendwidth: 'medium',
              tailendtype: undefined,
              tailendlength: 'medium',
              tailendwidth: 'small'
            },
            prstDash: 'solid'
          };

          arrowPathGenerator.handle(fillColorBean, paths);
          expect(paths[0][0]).toEqual('beginPath()');
          expect(paths[0][1]).toEqual('lineTo(10,20)');
          expect(paths[0][2]).toEqual('moveTo(15,25)');
          expect(paths[0][3]).toEqual('closePath()');

          expect(paths[1][0]).toEqual('quadraticCurveTo(1,2,3,4,5,6)');
          expect(paths[1][1]).toEqual('bezierCurveTo(2,4,6,8,10,12)');
        });
  });
});
