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
  'qowtRoot/drawing/geometry/geometryGuideEvaluator'
], function(GuideEvaluator) {

  'use strict';

  describe('Pre-Defined Guide Evaluator Test', function() {
    var guideEvaluator = GuideEvaluator;

    it('should evaluate pre-defined guide', function() {
      var preDefinedGuide = guideEvaluator.evaluatePreDefinedGuide(10, 20);

      expect(preDefinedGuide.w).toEqual(20);
      expect(preDefinedGuide.h).toEqual(10);
      expect(preDefinedGuide.shortestSide).toEqual(10);

      expect(preDefinedGuide.threeCD4).toEqual(16200000.0);
      expect(preDefinedGuide.threeCD8).toEqual(8100000.0);
      expect(preDefinedGuide.fiveCD8).toEqual(13500000.0);
      expect(preDefinedGuide.sevenCD8).toEqual(18900000.0);

      expect(preDefinedGuide.b).toEqual(10);
      expect(preDefinedGuide.cd2).toEqual(10800000.0);
      expect(preDefinedGuide.cd3).toEqual(7200000.0);
      expect(preDefinedGuide.cd4).toEqual(5400000.0);
      expect(preDefinedGuide.cd8).toEqual(2700000.0);

      expect(preDefinedGuide.hc).toEqual(10);
      expect(preDefinedGuide.hd2).toEqual(5);
      expect(preDefinedGuide.hd3).toEqual(3.3333333333333335);
      expect(preDefinedGuide.hd4).toEqual(2.5);
      expect(preDefinedGuide.hd5).toEqual(2);
      expect(preDefinedGuide.hd6).toEqual(1.6666666666666667);
      expect(preDefinedGuide.hd8).toEqual(1.25);
      expect(preDefinedGuide.hd10).toEqual(1);

      expect(preDefinedGuide.l).toEqual(0);
      expect(preDefinedGuide.ls).toEqual(20);
      expect(preDefinedGuide.r).toEqual(20);

      expect(preDefinedGuide.ss).toEqual(10);
      expect(preDefinedGuide.ssd2).toEqual(5);
      expect(preDefinedGuide.ssd4).toEqual(2.5);
      expect(preDefinedGuide.ssd6).toEqual(1.6666666666666667);
      expect(preDefinedGuide.ssd8).toEqual(1.25);

      expect(preDefinedGuide.t).toEqual(0);
      expect(preDefinedGuide.vc).toEqual(5);

      expect(preDefinedGuide.wd2).toEqual(10);
      expect(preDefinedGuide.wd3).toEqual(6.666666666666667);
      expect(preDefinedGuide.wd4).toEqual(5);
      expect(preDefinedGuide.wd5).toEqual(4);
      expect(preDefinedGuide.wd6).toEqual(3.3333333333333335);
      expect(preDefinedGuide.wd8).toEqual(2.5);
      expect(preDefinedGuide.wd10).toEqual(2);
      expect(preDefinedGuide.wd12).toEqual(1.6666666666666667);
      expect(preDefinedGuide.wd32).toEqual(0.625);
    });

    it('should evaluate adjust-value guide', function() {
      var preDefinedGuide = {
        w: 10,
        h: 20,
        shortestSide: 10
      };

      var adjustValueList = [{
        'gname': 'adj1',
        'fmla': {
          'op': 'val',
          'args': ['22500']
        }
      }, {
        'gname': 'adj2',
        'fmla': {
          'op': '*/',
          'args': ['w', '2', '1']
        }
      }, {
        'gname': 'adj3',
        'fmla': {
          'op': '+-',
          'args': ['100', '0', 'adj2']
        }
      }];

      guideEvaluator.evaluateGuideList(preDefinedGuide, adjustValueList);

      expect(preDefinedGuide.w).toEqual(10);
      expect(preDefinedGuide.h).toEqual(20);
      expect(preDefinedGuide.shortestSide).toEqual(10);

      expect(preDefinedGuide.adj1).toEqual(22500);
      expect(preDefinedGuide.adj2).toEqual(20);
      expect(preDefinedGuide.adj3).toEqual(80);

      // also make sure that original guide list was not changed.
      expect(adjustValueList[1].fmla.args[0]).toEqual('w');
    });

    it('should check that while evaluating guides the original list is not ' +
        'changed', function() {
          var preDefinedGuide = {
            w: 40,
            h: 20,
            shortestSide: 10
          };

          var guideList = [{
            'gname': 'adj2',
            'fmla': {
              'op': '*/',
              'args': ['w', '2', '1']
            }
          }];

          guideEvaluator.evaluateGuideList(preDefinedGuide, guideList);

          // also make sure that original guide list was not changed.
          expect(guideList[0].fmla.args[0]).toEqual('w');
          expect(preDefinedGuide.w).toEqual(40);
          expect(preDefinedGuide.adj2).toEqual(80);
        });

    it('should evaluate preset guide', function() {
      var preDefinedGuide = {
        w: 10,
        h: 20,
        shortestSide: 10,
        adj1: 25
      };

      var presetGuideList = [{
        'gname': 'a2',
        'fmla': {
          'op': 'pin',
          'args': ['0', 'w', '50000']
        }
      }, {
        'gname': 'xxx',
        'fmla': {
          'op': '*/',
          'args': ['h', '2', '1']
        }
      }, {
        'gname': 'a1',
        'fmla': {
          'op': 'pin',
          'args': ['0', 'adj1', 'a2']
        }
      }];

      guideEvaluator.evaluateGuideList(preDefinedGuide, presetGuideList);

      expect(preDefinedGuide.w).toEqual(10);
      expect(preDefinedGuide.h).toEqual(20);
      expect(preDefinedGuide.shortestSide).toEqual(10);
      expect(preDefinedGuide.adj1).toEqual(25);

      expect(preDefinedGuide.a2).toEqual(10);
      expect(preDefinedGuide.xxx).toEqual(40);
      expect(preDefinedGuide.a1).toEqual(10);
    });

    it('should evaluate path list', function() {
      var preDefinedGuide = {
        w: 57150,
        h: 28575,
        a1: 914400,
        a2: 457200,
        a3: 228600,
        a4: 114300
      };


      var pathList = [{
        'paths': [{
          'pathType': 'moveTo',
          'pt': {
            'x': 'a1',
            'y': 'a2'
          }
        }, {
          'pathType': 'lnTo',
          'pt': {
            'x': 'a3',
            'y': 'a4'
          }
        }, {
          'pathType': 'close'
        }]
      }, {
        'paths': [{
          'pathType': 'cubicBezTo',
          'pts': [{
            'x': 'w',
            'y': 'h'
          }, {
            'x': 'a1',
            'y': 'a2'
          }, {
            'x': 'a3',
            'y': 'a4'
          }]
        }, {
          'pathType': 'quadBezTo',
          'pts': [{
            'x': 'a2',
            'y': 'a4'
          }, {
            'x': 'a1',
            'y': 'a3'
          }, {
            'x': 'h',
            'y': 'w'
          }]
        }]
      }];

      var paths = guideEvaluator.evaluatePathList(preDefinedGuide, pathList,
          preDefinedGuide.h, preDefinedGuide.w);

      expect(paths.length).toEqual(2);

      expect(paths[0].length).toEqual(4);
      expect(paths[0][0].name).toEqual('beginPath');
      expect(paths[0][1].name).toEqual('moveTo');
      expect(paths[0][1].args[0]).toEqual(96);
      expect(paths[0][1].args[1]).toEqual(48);
      expect(paths[0][2].name).toEqual('lineTo');
      expect(paths[0][2].args[0]).toEqual(24);
      expect(paths[0][2].args[1]).toEqual(12);
      expect(paths[0][3].name).toEqual('closePath');

      expect(paths[1].length).toEqual(2);
      expect(paths[1][0].name).toEqual('bezierCurveTo');
      expect(paths[1][0].args[0]).toEqual(6);
      expect(paths[1][0].args[1]).toEqual(3);
      expect(paths[1][0].args[2]).toEqual(96);
      expect(paths[1][0].args[3]).toEqual(48);
      expect(paths[1][0].args[4]).toEqual(24);
      expect(paths[1][0].args[5]).toEqual(12);

      expect(paths[1][1].name).toEqual('quadraticCurveTo');
      expect(paths[1][1].args[0]).toEqual(48);
      expect(paths[1][1].args[1]).toEqual(12);
      expect(paths[1][1].args[2]).toEqual(96);
      expect(paths[1][1].args[3]).toEqual(24);
      expect(paths[1][1].args[4]).toEqual(3);
      expect(paths[1][1].args[5]).toEqual(6);
    });

    it('should call beginPath appropriately', function() {
      var preDefinedGuide = {
        w: 57150,
        h: 28575,
        a1: 914400,
        a2: 457200,
        a3: 228600,
        a4: 114300
      };


      var pathList = [{
        'paths': [{
          'pathType': 'moveTo',
          'pt': {
            'x': 'a1',
            'y': 'a2'
          }
        }, {
          'pathType': 'lnTo',
          'pt': {
            'x': 'a3',
            'y': 'a4'
          }
        }, {
          'pathType': 'close'
        }, {
          'pathType': 'moveTo',
          'pt': {
            'x': 'a1',
            'y': 'a2'
          }
        }, {
          'pathType': 'lnTo',
          'pt': {
            'x': 'a3',
            'y': 'a4'
          }
        }, {
          'pathType': 'moveTo',
          'pt': {
            'x': 'a1',
            'y': 'a2'
          }
        }, {
          'pathType': 'lnTo',
          'pt': {
            'x': 'a3',
            'y': 'a4'
          }
        }, {
          'pathType': 'close'
        }]
      }];

      var paths = guideEvaluator.evaluatePathList(preDefinedGuide, pathList,
          preDefinedGuide.h, preDefinedGuide.w);

      expect(paths.length).toEqual(1);

      expect(paths[0].length).toEqual(9);
      expect(paths[0][0].name).toEqual('beginPath');
      expect(paths[0][1].name).toEqual('moveTo');
      expect(paths[0][1].args[0]).toEqual(96);
      expect(paths[0][1].args[1]).toEqual(48);
      expect(paths[0][2].name).toEqual('lineTo');
      expect(paths[0][2].args[0]).toEqual(24);
      expect(paths[0][2].args[1]).toEqual(12);
      expect(paths[0][3].name).toEqual('closePath');
      expect(paths[0][4].name).toEqual('moveTo');
      expect(paths[0][4].args[0]).toEqual(96);
      expect(paths[0][4].args[1]).toEqual(48);
      expect(paths[0][5].name).toEqual('lineTo');
      expect(paths[0][5].args[0]).toEqual(24);
      expect(paths[0][5].args[1]).toEqual(12);
      expect(paths[0][6].name).toEqual('moveTo');
      expect(paths[0][6].args[0]).toEqual(96);
      expect(paths[0][6].args[1]).toEqual(48);
      expect(paths[0][7].name).toEqual('lineTo');
      expect(paths[0][7].args[0]).toEqual(24);
      expect(paths[0][7].args[1]).toEqual(12);
      expect(paths[0][8].name).toEqual('closePath');
    });

    it('should evaluate path-list, when it asks for numbers and properties ' +
        'starting with digits', function() {
          var preDefinedGuide = {
            w: 57150,
            h: 28575,
            a1: 914400,
            a2: 457200,
            threeCD4: 228600,
            threeCD8: 114300
          };


          var pathList = [{
            'paths': [{
              'pathType': 'moveTo',
              'pt': {
                'x': 'a1',
                'y': 'a2'
              }
            }, {
              'pathType': 'lnTo',
              'pt': {
                'x': '3cd4',
                'y': '3cd8'
              }
            }, {
              'pathType': 'lnTo',
              'pt': {
                'x': '57150',
                'y': '28575'
              }
            }, {
              'pathType': 'close'
            }]
          }];

          var paths = guideEvaluator.evaluatePathList(preDefinedGuide, pathList,
              preDefinedGuide.h, preDefinedGuide.w);

          expect(paths.length).toEqual(1);

          expect(paths[0][0].name).toEqual('beginPath');
          expect(paths[0][1].name).toEqual('moveTo');
          expect(paths[0][1].args[0]).toEqual(96);
          expect(paths[0][1].args[1]).toEqual(48);
          expect(paths[0][2].name).toEqual('lineTo');
          expect(paths[0][2].args[0]).toEqual(24);
          expect(paths[0][2].args[1]).toEqual(12);
          expect(paths[0][3].name).toEqual('lineTo');
          expect(paths[0][3].args[0]).toEqual(6);
          expect(paths[0][3].args[1]).toEqual(3);
          expect(paths[0][4].name).toEqual('closePath');
        });

    it('should check correct paths are generated when path have height and ' +
        'width defined', function() {
          var preDefinedGuide = {
            w: 57150,
            h: 28575,
            a1: 914400,
            a2: 457200,
            threeCD4: 228600,
            threeCD8: 114300
          };


          var pathList = [{
            'w': '28575',
            'h': '57150',
            'paths': [{
              'pathType': 'moveTo',
              'pt': {
                'x': 'a1',
                'y': 'a2'
              }
            }, {
              'pathType': 'lnTo',
              'pt': {
                'x': '3cd4',
                'y': '3cd8'
              }
            }, {
              'pathType': 'lnTo',
              'pt': {
                'x': '57150',
                'y': '28575'
              }
            }, {
              'pathType': 'close'
            }]
          }];

          var paths = guideEvaluator.evaluatePathList(preDefinedGuide, pathList,
              28575, 57150);

          expect(paths.length).toEqual(1);

          expect(paths[0].length).toEqual(5);
          expect(paths[0][0].name).toEqual('beginPath');
          expect(paths[0][1].name).toEqual('moveTo');
          expect(paths[0][1].args[0]).toEqual(192);
          expect(paths[0][1].args[1]).toEqual(24);
          expect(paths[0][2].name).toEqual('lineTo');
          expect(paths[0][2].args[0]).toEqual(48);
          expect(paths[0][2].args[1]).toEqual(6);
          expect(paths[0][3].name).toEqual('lineTo');
          expect(paths[0][3].args[0]).toEqual(12);
          expect(paths[0][3].args[1]).toEqual(2);
          expect(paths[0][4].name).toEqual('closePath');
        });

    describe(' test updated margins ', function() {

      it('should check correct margin properties are generated when path ' +
          'have negative values defined', function() {
            var preDefinedGuide = {
              w: 476250,
              h: 476250,
              a1: 914400,
              a2: 457200,
              threeCD4: 228600,
              threeCD8: 114300
            };


            var pathList = [{
              'w': '476250',
              'h': '476250',
              'paths': [{
                'pathType': 'moveTo',
                'pt': {
                  'x': '-1905000',
                  //-200,300
                  'y': '2857500'
                }
              }, {
                'pathType': 'lnTo',
                'pt': {
                  'x': '952500',
                  //100,-100
                  'y': '-952500'
                }
              }, {
                'pathType': 'lnTo',
                'pt': {
                  'x': '1905000',
                  // 200,100
                  'y': '952500'
                }
              }, {
                'pathType': 'lnTo',
                'pt': {
                  'x': '952500',
                  // 100,200
                  'y': '1905000'
                }
              }, {
                'pathType': 'close'
              }]
            }];

            var paths = guideEvaluator.evaluatePathList(preDefinedGuide,
                pathList, 476250, 476250);

            expect(paths.leftMargin).toEqual(200);
            expect(paths.rightMargin).toEqual(150);
            expect(paths.topMargin).toEqual(100);
            expect(paths.bottomMargin).toEqual(250);
          });

      it('should update margins correctly, respectively for different ' +
          'shapes drawn', function() {
            var preDefinedGuide = {
              w: 476250,
              h: 476250,
              a1: 914400,
              a2: 457200,
              threeCD4: 228600,
              threeCD8: 114300
            };

            var pathList1 = [{
              'w': '2857500',
              //300
              'h': '3810000',
              //400
              'paths': [{
                'pathType': 'moveTo',
                'pt': {
                  'x': '-1905000',
                  //-200,300
                  'y': '2857500'
                }
              }, {
                'pathType': 'lnTo',
                'pt': {
                  'x': '952500',
                  //100,-100
                  'y': '-952500'
                }
              }]
            }];

            var pathList2 = [{
              'w': '2857500',
              //300
              'h': '952500',
              //100
              'paths': [{
                'pathType': 'moveTo',
                'pt': {
                  'x': '-1905000',
                  //-200,300
                  'y': '2857500'
                }
              }, {
                'pathType': 'lnTo',
                'pt': {
                  'x': '952500',
                  //100,200
                  'y': '1905000'
                }
              }]
            }];

            var paths1 = guideEvaluator.evaluatePathList(preDefinedGuide,
                pathList1, preDefinedGuide.h, preDefinedGuide.w);
            var paths2 = guideEvaluator.evaluatePathList(preDefinedGuide,
                pathList2, preDefinedGuide.h, preDefinedGuide.w);

            expect(paths1.topMargin).toEqual(12);
            expect(paths1.bottomMargin).toEqual(0);
            expect(paths1.leftMargin).toEqual(33);
            expect(paths1.rightMargin).toEqual(0);

            expect(paths2.topMargin).toEqual(0);
            expect(paths2.bottomMargin).toEqual(100);
            expect(paths2.leftMargin).toEqual(33);
            expect(paths2.rightMargin).toEqual(0);
          });
    });

    it('should add fill and stroke values to paths', function() {

      var preDefinedGuide = {
        w: 57150,
        h: 28575,
        a1: 914400,
        a2: 457200,
        a3: 228600,
        a4: 114300
      };

      var pathList = [{
        'stroke': 'true',
        'fill': 'none',
        'paths': [{
          'pathType': 'moveTo',
          'pt': {
            'x': 'a1',
            'y': 'a2'
          }
        }]
      }, {
        'fill': 'darken',
        'paths': [{
          'pathType': 'moveTo',
          'pt': {
            'x': 'a1',
            'y': 'a2'
          }
        }]
      }, {
        'stroke': 'true',
        'paths': [{
          'pathType': 'moveTo',
          'pt': {
            'x': 'a1',
            'y': 'a2'
          }
        }]
      }, {
        'stroke': 'false',
        'fill': 'lighten',
        'paths': [{
          'pathType': 'quadBezTo',
          'pts': [{
            'x': 'a2',
            'y': 'a4'
          }, {
            'x': 'a1',
            'y': 'a3'
          }, {
            'x': 'h',
            'y': 'w'
          }]
        }]
      }];

      var paths = guideEvaluator.evaluatePathList(preDefinedGuide, pathList,
          preDefinedGuide.h, preDefinedGuide.w);
      expect(paths.length).toEqual(4);

      expect(paths[0].length).toEqual(2);
      expect(paths[0].fill).toEqual('none');
      expect(paths[0].stroke).toEqual('true');
      expect(paths[0][0].name).toEqual('beginPath');
      expect(paths[0][1].name).toEqual('moveTo');
      expect(paths[0][1].args[0]).toEqual(96);
      expect(paths[0][1].args[1]).toEqual(48);

      expect(paths[1].length).toEqual(2);
      expect(paths[1].fill).toEqual('darken');
      expect(paths[1].stroke).toEqual(undefined);
      expect(paths[1][0].name).toEqual('beginPath');
      expect(paths[1][1].name).toEqual('moveTo');
      expect(paths[1][1].args[0]).toEqual(96);
      expect(paths[1][1].args[1]).toEqual(48);


      expect(paths[2].length).toEqual(2);
      expect(paths[2].fill).toEqual(undefined);
      expect(paths[2].stroke).toEqual('true');
      expect(paths[2][0].name).toEqual('beginPath');
      expect(paths[2][1].name).toEqual('moveTo');
      expect(paths[2][1].args[0]).toEqual(96);
      expect(paths[2][1].args[1]).toEqual(48);


      expect(paths[3].length).toEqual(1);
      expect(paths[3].fill).toEqual('lighten');
      expect(paths[3].stroke).toEqual('false');
      expect(paths[3][0].name).toEqual('quadraticCurveTo');
      expect(paths[3][0].args[0]).toEqual(48);
      expect(paths[3][0].args[1]).toEqual(12);
      expect(paths[3][0].args[2]).toEqual(96);
      expect(paths[3][0].args[3]).toEqual(24);
      expect(paths[3][0].args[4]).toEqual(3);
      expect(paths[3][0].args[5]).toEqual(6);
    });

    describe(' arcTo tests', function() {

      it('should evaluate path list when path has arcTo', function() {
        var preDefinedGuide = {
          w: 57150,
          h: 28575,
          a1: 914400,
          a2: 457200,
          wd2: 914400,
          y1: 914400 * 2,
          cd2: 90 * 60000 // 90 degrees
        };
        var pathList = [{
          'paths': [{
            'pathType': 'moveTo',
            'pt': {
              'x': 'a1',
              'y': 'a2'
            }
          }, {
            'pathType': 'arcTo',
            'wr': 'wd2',
            'hr': 'y1',
            'stAng': 'cd2',
            'swAng': 'cd2'
          }]
        }];

        var paths = guideEvaluator.evaluatePathList(preDefinedGuide, pathList,
            preDefinedGuide.h, preDefinedGuide.w);

        expect(paths.length).toEqual(1);

        expect(paths[0].length).toEqual(6);
        expect(paths[0][0].name).toEqual('beginPath');

        expect(paths[0][1].name).toEqual('moveTo');
        expect(paths[0][1].args[0]).toEqual(96);
        expect(paths[0][1].args[1]).toEqual(48);

        expect(paths[0][2].name).toEqual('save');


        expect(paths[0][3].name).toEqual('scale');
        expect(paths[0][3].args[0]).toEqual(1);
        expect(paths[0][3].args[1]).toEqual(2);

        expect(paths[0][4].name).toEqual('arc');
        expect(paths[0][4].args[0]).toEqual(96 - 96 * Math.sin(0));
        expect(paths[0][4].args[1]).toEqual((48 - (96 * 2 * Math.cos(0))) / 2);
        expect(paths[0][4].args[2]).toEqual(96);
        expect(paths[0][4].args[3].toFixed(4)).
            toEqual((Math.PI / 2).toFixed(4));
        expect(paths[0][4].args[4].toFixed(4)).toEqual((Math.PI).toFixed(4));
        expect(paths[0][4].args[5]).toEqual(false);


        expect(paths[0][5].name).toEqual('restore');
      });

      it('should evaluate path list when path has arcTo and end angle ' +
          'greater than 360', function() {
            var preDefinedGuide = {
              w: 57150,
              h: 28575,
              a1: 914400,
              a2: 457200,
              wd2: 914400,
              y1: 914400 * 2,
              cd2: 270 * 60000 // 270 degrees
            };
            var pathList = [{
              'paths': [{
                'pathType': 'moveTo',
                'pt': {
                  'x': 'a1',
                  'y': 'a2'
                }
              }, {
                'pathType': 'arcTo',
                'wr': 'wd2',
                'hr': 'y1',
                'stAng': 'cd2',
                'swAng': 'cd2'
              }]
            }];

            var paths = guideEvaluator.evaluatePathList(preDefinedGuide,
                pathList, preDefinedGuide.h, preDefinedGuide.w);

            expect(paths.length).toEqual(1);

            expect(paths[0].length).toEqual(6);
            expect(paths[0][0].name).toEqual('beginPath');
            expect(paths[0][1].name).toEqual('moveTo');
            expect(paths[0][1].args[0]).toEqual(96);
            expect(paths[0][1].args[1]).toEqual(48);

            expect(paths[0][2].name).toEqual('save');

            expect(paths[0][3].name).toEqual('scale');
            expect(paths[0][3].args[0]).toEqual(1);
            expect(paths[0][3].args[1]).toEqual(2);

            expect(paths[0][4].name).toEqual('arc');
            expect(paths[0][4].args[0]).toEqual(96);
            expect(paths[0][4].args[1]).toEqual(120);
            expect(paths[0][4].args[2]).toEqual(96);
            expect(paths[0][4].args[3].toFixed(4)).
                toEqual((3 * Math.PI / 2).toFixed(4));
            expect(paths[0][4].args[4].toFixed(4)).toEqual((Math.PI).
                toFixed(4));
            expect(paths[0][4].args[5]).toEqual(false);


            expect(paths[0][5].name).toEqual('restore');
          });
    });

    it('should evaluate path list when path has arcTo and start angle, end ' +
        'angle are same', function() {
          var preDefinedGuide = {
            w: 57150,
            h: 28575,
            a1: 914400,
            a2: 457200,
            wd2: 914400,
            y1: 914400 * 2,
            cd2: 270 * 60000,
            // 270 degrees
            cd4: 360 * 60000 // 360 degrees
          };


          var pathList = [{
            'paths': [{
              'pathType': 'moveTo',
              'pt': {
                'x': 'a1',
                'y': 'a2'
              }
            }, {
              'pathType': 'arcTo',
              'wr': 'wd2',
              'hr': 'y1',
              'stAng': 'cd2',
              'swAng': 'cd4'
            }]
          }];

          var paths = guideEvaluator.evaluatePathList(preDefinedGuide, pathList,
              preDefinedGuide.h, preDefinedGuide.w);

          expect(paths.length).toEqual(1);

          expect(paths[0].length).toEqual(6);
          expect(paths[0][0].name).toEqual('beginPath');

          expect(paths[0][1].name).toEqual('moveTo');
          expect(paths[0][1].args[0]).toEqual(96);
          expect(paths[0][1].args[1]).toEqual(48);

          expect(paths[0][2].name).toEqual('save');


          expect(paths[0][3].name).toEqual('scale');
          expect(paths[0][3].args[0]).toEqual(1);
          expect(paths[0][3].args[1]).toEqual(2);

          expect(paths[0][4].name).toEqual('arc');
          expect(paths[0][4].args[0]).toEqual(96);
          expect(paths[0][4].args[1]).toEqual(120);
          expect(paths[0][4].args[2]).toEqual(96);
          expect(paths[0][4].args[3].toFixed(4)).
              toEqual((3 * Math.PI / 2).toFixed(4));
          expect(paths[0][4].args[4].toFixed(4)).
              toEqual((2 * Math.PI + (3 * Math.PI / 2)).toFixed(4));
          expect(paths[0][4].args[5]).toEqual(false);


          expect(paths[0][5].name).toEqual('restore');
        });
  });
});
