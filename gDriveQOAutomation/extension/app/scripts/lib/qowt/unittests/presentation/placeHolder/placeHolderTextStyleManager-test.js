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
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/models/point'
], function(
    PlaceHolderTextStyleManager,
    PointModel) {

  'use strict';

  describe('Place holder text style manager Test', function() {
    var _placeHolderTextStyleManager = PlaceHolderTextStyleManager;

    beforeEach(function() {
      PointModel.MasterSlideId = '111';
      PointModel.SlideLayoutId = '222';
    });

    afterEach(function() {
      PointModel.MasterSlideId = undefined;
      PointModel.SlideLayoutId = undefined;

      _placeHolderTextStyleManager.resetCache();
    });

    describe('Tests related to caching of MasterTextStyle ', function() {
      var _titleTextStyle, _bodyTextStyle, _otherTextStyle, _masterTextStyleArr;

      beforeEach(function() {
        _titleTextStyle = {
          type: 'title'
        };
        _bodyTextStyle = {
          type: 'body'
        };
        _otherTextStyle = {
          type: 'other'
        };
        _masterTextStyleArr = [
          _titleTextStyle,
          _bodyTextStyle,
          _otherTextStyle
        ];

        _placeHolderTextStyleManager.cacheMasterTextStyle(_masterTextStyleArr);
      });

      it('should return -title- master-layout text styles, when fetched for ' +
          '-title-', function() {
            var fetchedMasterTextStyle = _placeHolderTextStyleManager.
                getCachedMasterTextStyle('title');
            expect(fetchedMasterTextStyle).toEqual(_titleTextStyle);
          });

      it('should return -body- master-layout text styles, when fetched for ' +
          '-subtitle-', function() {
            var fetchedMasterTextStyle = _placeHolderTextStyleManager.
                getCachedMasterTextStyle('subTitle');
            expect(fetchedMasterTextStyle).toEqual(_bodyTextStyle);
          });

      it('should return -title- master-layout text styles, when fetched for ' +
          '-ctrTitle-', function() {
            var fetchedMasterTextStyle = _placeHolderTextStyleManager.
                getCachedMasterTextStyle('ctrTitle');
            expect(fetchedMasterTextStyle).toEqual(_titleTextStyle);
          });

      it('should return -other- master-layout text styles, when fetched for ' +
          '-dt-', function() {
            var fetchedMasterTextStyle = _placeHolderTextStyleManager.
                getCachedMasterTextStyle('dt');
            expect(fetchedMasterTextStyle).toEqual(_otherTextStyle);
          });

      it('should return -other- master-layout text styles, when fetched for ' +
          '-ftr-', function() {
            var fetchedMasterTextStyle = _placeHolderTextStyleManager.
                getCachedMasterTextStyle('ftr');
            expect(fetchedMasterTextStyle).toEqual(_otherTextStyle);
          });

      it('should return -other- master-layout text styles, when fetched for ' +
          '-sldNum-', function() {
            var fetchedMasterTextStyle = _placeHolderTextStyleManager.
                getCachedMasterTextStyle('sldNum');
            expect(fetchedMasterTextStyle).toEqual(_otherTextStyle);
          });

      it('should return -body- master-layout text styles, when fetched for ' +
          '-body-', function() {
            var fetchedMasterTextStyle = _placeHolderTextStyleManager.
                getCachedMasterTextStyle('body');
            expect(fetchedMasterTextStyle).toEqual(_bodyTextStyle);
          });

      it('should return undefined, when fetched for any PH other than ' +
          '-body-, -title- or -other-', function() {
            var fetchedMasterTextStyle = _placeHolderTextStyleManager.
                getCachedMasterTextStyle('chart');
            expect(fetchedMasterTextStyle).toEqual(undefined);
          });

    });

    describe('Resolve Run properties tests ', function() {

      var _layoutTextStyle = {
        'pPrArr': [
          {
            'pPrName': 'defPPr',
            'pPrValue': {
              'jus': 'L',
              'defRPr': {
                'sz': 39,
                'font': {latin: '+mn-lt'}
              },
              'indent': '-242950',
              'leftMargin': '242950'
            }
          },
          {
            'pPrName': 'lvl2PPr',
            'pPrValue': {
              'jus': 'R',
              'defRPr': {
                'sz': 12,
                'font': {latin: '+mn-lt'}
              },
              'indent': '-265755',
              'leftMargin': '762955'
            }
          },
          {
            'pPrName': 'lvl3PPr',
            'pPrValue': {
              'jus': 'R',
              'defRPr': {
                'sz': 14,
                'font': {latin: '+mn-lt'}
              },
              'indent': '-228605',
              'leftMargin': '1145005'
            }
          }
        ]
      };

      var _masterlstStyle = {
        'pPrArr': [
          {
            'pPrName': 'lvl1PPr',
            'pPrValue': {
              'jus': 'L',
              'defRPr': {
                'sz': 35,
                'font': {latin: '+mn-lt'}
              },
              'indent': '-342950',
              'leftMargin': '342950'
            }
          },
          {
            'pPrName': 'lvl2PPr',
            'pPrValue': {
              'jus': 'L',
              'defRPr': {
                'sz': 22,
                'font': {latin: '+mn-lt'}
              },
              'indent': '-285755',
              'leftMargin': '742955'
            }
          },
          {
            'pPrName': 'lvl3PPr',
            'pPrValue': {
              'jus': 'L',
              'defRPr': {
                'sz': 12,
                'font': {latin: '+mn-lt'}
              },
              'indent': '-228605',
              'leftMargin': '1143005'
            }
          }
        ]
      };

      var _titleTextStyleForMaster = {
        type: 'title',
        'pPrArr': [
          {
            'pPrName': 'lvl1PPr',
            'pPrValue': {
              'jus': 'L',
              'defRPr': {
                'sz': 32,
                'font': {latin: '+mn-lt'}
              },
              'indent': '-342900',
              'leftMargin': '342900'
            }
          }
        ]
      };
      var _bodyTextStyleForMaster = {
        type: 'body',
        'pPrArr': [
          {
            'pPrName': 'lvl1PPr',
            'pPrValue': {
              'jus': 'L',
              'defRPr': {
                'sz': 28,
                'font': {latin: '+mn-lt'}
              },
              'indent': '-285750',
              'leftMargin': '742950'
            }
          }
        ]
      };
      var _otherTextStyleForMaster = {
        type: 'other',
        'pPrArr': [
          {
            'pPrName': 'lvl1PPr',
            'pPrValue': {
              'jus': 'L',
              'defRPr': {
                'sz': 24,
                'font': {latin: '+mn-lt'}
              },
              'indent': '-228600',
              'leftMargin': '1143000'
            }
          }
        ]
      };

      var _masterTextStyleArr = [
        _titleTextStyleForMaster,
        _bodyTextStyleForMaster,
        _otherTextStyleForMaster
      ];

      describe('when master text style is defined and master list style and ' +
          'layout list style is undefined', function() {

            beforeEach(function() {
              _placeHolderTextStyleManager.cacheMasterTextStyle(
                  _masterTextStyleArr);

              PointModel.CurrentPlaceHolderAtSlide = {
                phTyp: 'body',
                phIdx: '111'
              };
            });

            it('when phTyp is body', function() {
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(0)).
                  toEqual(_masterTextStyleArr[1].pPrArr[0].pPrValue.defRPr);
            });

            it('when phTyp is title', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(0)).
                  toEqual(_masterTextStyleArr[0].pPrArr[0].pPrValue.defRPr);

            });
            it('when phTyp is other', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'other';
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(0)).
                  toEqual(_masterTextStyleArr[2].pPrArr[0].pPrValue.defRPr);

            });
            it('when phTyp is ftr', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(0)).
                  toEqual(_masterTextStyleArr[2].pPrArr[0].pPrValue.defRPr);

            });
            it('when phTyp is dt', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(0)).
                  toEqual(_masterTextStyleArr[2].pPrArr[0].pPrValue.defRPr);
            });
            it('when phTyp is sldNum', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(0)).
                  toEqual(_masterTextStyleArr[2].pPrArr[0].pPrValue.defRPr);

            });
            it('when phTyp is invalid', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(0)).
                  toEqual(undefined);
            });
          });

      describe('when master text style and master list style defined and ' +
          'layout list style is undefined', function() {

            beforeEach(function() {
              _placeHolderTextStyleManager.cacheMasterListStyle('body',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheMasterTextStyle(
                  _masterTextStyleArr);

              PointModel.CurrentPlaceHolderAtSlide = {
                phTyp: 'body',
                phIdx: '111'
              };
            });

            it('when phTyp is body', function() {
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_masterlstStyle.pPrArr[1].pPrValue.defRPr);
            });

            it('when phTyp is title', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              _placeHolderTextStyleManager.cacheMasterListStyle('title',
                  _masterlstStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_masterlstStyle.pPrArr[1].pPrValue.defRPr);
            });

            it('when phTyp is other', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'other';
              _placeHolderTextStyleManager.cacheMasterListStyle('other',
                  _masterlstStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_masterlstStyle.pPrArr[1].pPrValue.defRPr);
            });

            it('when phTyp is ftr', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              _placeHolderTextStyleManager.cacheMasterListStyle('ftr',
                  _masterlstStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_masterlstStyle.pPrArr[1].pPrValue.defRPr);
            });

            it('when phTyp is dt', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              _placeHolderTextStyleManager.cacheMasterListStyle('dt',
                  _masterlstStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_masterlstStyle.pPrArr[1].pPrValue.defRPr);
            });

            it('when phTyp is sldNum', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              _placeHolderTextStyleManager.
                  cacheMasterListStyle('sldNum', _masterlstStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_masterlstStyle.pPrArr[1].pPrValue.defRPr);

            });

            it('when phTyp is invalid', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'chart';
              _placeHolderTextStyleManager.cacheLayoutTextStyle('body', '111',
                  undefined);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(undefined);
            });
          });

      describe('when master text style defined,master list style undefined, ' +
          'but layout list style is defined', function() {

            beforeEach(function() {
              _placeHolderTextStyleManager.cacheMasterTextStyle(
                  _masterTextStyleArr);

              PointModel.CurrentPlaceHolderAtSlide = {
                phTyp: 'body',
                phIdx: '111'
              };
            });

            it('when phTyp is body', function() {
              _placeHolderTextStyleManager.cacheMasterListStyle('body',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('body', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue.defRPr);
            });
            it('when phTyp is title', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              _placeHolderTextStyleManager.cacheMasterListStyle('title',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('title', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue.defRPr);
            });
            it('when phTyp is other', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'other';
              _placeHolderTextStyleManager.cacheMasterListStyle('other',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('other', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue.defRPr);
            });
            it('when phTyp is ftr', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              _placeHolderTextStyleManager.cacheMasterListStyle('ftr',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('ftr', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue.defRPr);
            });
            it('when phTyp is dt', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              _placeHolderTextStyleManager.cacheMasterListStyle('dt',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('dt', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue.defRPr);
            });
            it('when phTyp is sldNum', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              _placeHolderTextStyleManager.cacheMasterListStyle('sldNum',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('sldNum', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue.defRPr);
            });
            it('when phTyp is invalid', function() {
              _placeHolderTextStyleManager.cacheLayoutTextStyle('chart', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(undefined);
            });
          });

      describe('when master text style, master list style and layout list ' +
          'style is defined', function() {

            beforeEach(function() {
              _placeHolderTextStyleManager.cacheMasterTextStyle(
                  _masterTextStyleArr);

              PointModel.CurrentPlaceHolderAtSlide = {
                phTyp: 'body',
                phIdx: '111'
              };
            });
            it('when phTyp is body', function() {
              _placeHolderTextStyleManager.cacheMasterListStyle('body',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('body', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue.defRPr);
            });
            it('when phTyp is title', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              _placeHolderTextStyleManager.cacheMasterListStyle('title',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('title', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue.defRPr);
            });
            it('when phTyp is other', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'other';
              _placeHolderTextStyleManager.cacheMasterListStyle('other',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('other', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue.defRPr);
            });
            it('when phTyp is ftr', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              _placeHolderTextStyleManager.cacheMasterListStyle('ftr',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('ftr', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue.defRPr);
            });
            it('when phTyp is dt', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              _placeHolderTextStyleManager.cacheMasterListStyle('dt',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('dt', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue.defRPr);
            });
            it('when phTyp is sldNum', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              _placeHolderTextStyleManager.cacheMasterListStyle('sldNum',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('sldNum', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue.defRPr);
            });
            it('when phTyp is invalid', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'chart';
              _placeHolderTextStyleManager.cacheMasterListStyle('body',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('body', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveRunPropertyFor(1)).
                  toEqual(undefined);
            });
          });


    });

    describe('Resolve paragraph properties tests', function() {

      var _layoutTextStyle = {
        'pPrArr': [
          {
            'pPrName': 'defPPr',
            'pPrValue': {
              'jus': 'L',
              'indent': '-242950',
              'leftMargin': '242950'
            }
          },
          {
            'pPrName': 'lvl2PPr',
            'pPrValue': {
              'jus': 'R',
              'indent': '-265755',
              'leftMargin': '762955'
            }
          },
          {
            'pPrName': 'lvl3PPr',
            'pPrValue': {
              'jus': 'R',
              'indent': '-228605',
              'leftMargin': '1145005'
            }
          }
        ]
      };

      var _masterlstStyle = {
        'pPrArr': [
          {
            'pPrName': 'lvl1PPr',
            'pPrValue': {
              'jus': 'L',
              'indent': '-342950',
              'leftMargin': '342950'
            }
          },
          {
            'pPrName': 'lvl2PPr',
            'pPrValue': {
              'jus': 'L',
              'indent': '-285755',
              'leftMargin': '742955'
            }
          },
          {
            'pPrName': 'lvl3PPr',
            'pPrValue': {
              'jus': 'L',
              'indent': '-228605',
              'leftMargin': '1143005'
            }
          }
        ]
      };

      var _titleTextStyleForMaster = {
        type: 'title',
        'pPrArr': [
          {
            'pPrName': 'lvl1PPr',
            'pPrValue': {
              'jus': 'L',
              'indent': '-342900',
              'leftMargin': '342900'
            }
          }
        ]
      };
      var _bodyTextStyleForMaster = {
        type: 'body',
        'pPrArr': [
          {
            'pPrName': 'lvl1PPr',
            'pPrValue': {
              'jus': 'L',
              'indent': '-285750',
              'leftMargin': '742950'
            }
          }
        ]
      };
      var _otherTextStyleForMaster = {
        type: 'other',
        'pPrArr': [
          {
            'pPrName': 'lvl1PPr',
            'pPrValue': {
              'jus': 'L',
              'indent': '-228600',
              'leftMargin': '1143000'
            }
          }
        ]
      };

      var _masterTextStyleArr = [
        _titleTextStyleForMaster,
        _bodyTextStyleForMaster,
        _otherTextStyleForMaster
      ];

      describe('when master text style is defined and master list style and ' +
          'layout list style is undefined', function() {

            beforeEach(function() {
              _placeHolderTextStyleManager.
                  cacheMasterTextStyle(_masterTextStyleArr);

              PointModel.CurrentPlaceHolderAtSlide = {
                phTyp: 'body',
                phIdx: '111'
              };
            });

            it('when phTyp is body', function() {
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(0)).
                  toEqual(_masterTextStyleArr[1].pPrArr[0].pPrValue);
            });

            it('when phTyp is title', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(0)).
                  toEqual(_masterTextStyleArr[0].pPrArr[0].pPrValue);
            });
            it('when phTyp is other', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'other';
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(0)).
                  toEqual(_masterTextStyleArr[2].pPrArr[0].pPrValue);
            });
            it('when phTyp is ftr', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(0)).
                  toEqual(_masterTextStyleArr[2].pPrArr[0].pPrValue);
            });
            it('when phTyp is dt', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(0)).
                  toEqual(_masterTextStyleArr[2].pPrArr[0].pPrValue);
            });
            it('when phTyp is sldNum', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(0)).
                  toEqual(_masterTextStyleArr[2].pPrArr[0].pPrValue);
            });
            it('when phTyp is invalid', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(0)).
                  toEqual(undefined);
            });
          });

      describe('when master text style and master list style defined and ' +
          'layout list style is undefined', function() {

            beforeEach(function() {
              _placeHolderTextStyleManager.cacheMasterListStyle('body',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheMasterTextStyle(
                  _masterTextStyleArr);

              PointModel.CurrentPlaceHolderAtSlide = {
                phTyp: 'body',
                phIdx: '111'
              };
            });

            it('when phTyp is body', function() {
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_masterlstStyle.pPrArr[1].pPrValue);
            });

            it('when phTyp is title', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              _placeHolderTextStyleManager.cacheMasterListStyle('title',
                  _masterlstStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_masterlstStyle.pPrArr[1].pPrValue);
            });

            it('when phTyp is other', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'other';
              _placeHolderTextStyleManager.cacheMasterListStyle('other',
                  _masterlstStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_masterlstStyle.pPrArr[1].pPrValue);
            });

            it('when phTyp is ftr', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              _placeHolderTextStyleManager.cacheMasterListStyle('ftr',
                  _masterlstStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_masterlstStyle.pPrArr[1].pPrValue);
            });

            it('when phTyp is dt', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              _placeHolderTextStyleManager.cacheMasterListStyle('dt',
                  _masterlstStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_masterlstStyle.pPrArr[1].pPrValue);
            });

            it('when phTyp is sldNum', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              _placeHolderTextStyleManager.cacheMasterListStyle('sldNum',
                  _masterlstStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_masterlstStyle.pPrArr[1].pPrValue);
            });

            it('when phTyp is invalid', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'chart';
              _placeHolderTextStyleManager.cacheLayoutTextStyle('body', '111',
                  undefined);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(undefined);
            });
          });

      describe('when master text style defined,master list style undefined, ' +
          'but layout list style is defined', function() {

            beforeEach(function() {
              _placeHolderTextStyleManager.cacheMasterTextStyle(
                  _masterTextStyleArr);

              PointModel.CurrentPlaceHolderAtSlide = {
                phTyp: 'body',
                phIdx: '111'
              };
            });

            it('when phTyp is body', function() {
              _placeHolderTextStyleManager.cacheMasterListStyle('body',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('body', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue);
            });
            it('when phTyp is title', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              _placeHolderTextStyleManager.cacheMasterListStyle('title',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('title', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue);
            });
            it('when phTyp is other', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'other';
              _placeHolderTextStyleManager.cacheMasterListStyle('other',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('other', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue);
            });
            it('when phTyp is ftr', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              _placeHolderTextStyleManager.cacheMasterListStyle('ftr',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('ftr', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue);
            });
            it('when phTyp is dt', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              _placeHolderTextStyleManager.cacheMasterListStyle('dt',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('dt', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue);
            });
            it('when phTyp is sldNum', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              _placeHolderTextStyleManager.cacheMasterListStyle('sldNum',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('sldNum', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue);
            });
            it('when phTyp is invalid', function() {
              _placeHolderTextStyleManager.cacheLayoutTextStyle('chart', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(undefined);
            });
          });

      describe('when master text style, master list style and layout list ' +
          'style is defined', function() {

            beforeEach(function() {
              _placeHolderTextStyleManager.cacheMasterTextStyle(
                  _masterTextStyleArr);

              PointModel.CurrentPlaceHolderAtSlide = {
                phTyp: 'body',
                phIdx: '111'
              };
            });
            it('when phTyp is body', function() {
              _placeHolderTextStyleManager.cacheMasterListStyle('body',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('body', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue);
            });
            it('when phTyp is title', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              _placeHolderTextStyleManager.cacheMasterListStyle('title',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('title', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue);
            });
            it('when phTyp is other', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'other';
              _placeHolderTextStyleManager.cacheMasterListStyle('other',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('other', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue);
            });
            it('when phTyp is ftr', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              _placeHolderTextStyleManager.cacheMasterListStyle('ftr',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('ftr', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue);
            });
            it('when phTyp is dt', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              _placeHolderTextStyleManager.cacheMasterListStyle('dt',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('dt', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue);
            });
            it('when phTyp is sldNum', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              _placeHolderTextStyleManager.cacheMasterListStyle('sldNum',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('sldNum', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(_layoutTextStyle.pPrArr[1].pPrValue);
            });
            it('when phTyp is invalid', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'chart';
              _placeHolderTextStyleManager.cacheMasterListStyle('body',
                  _masterlstStyle);
              _placeHolderTextStyleManager.cacheLayoutTextStyle('body', '111',
                  _layoutTextStyle);
              expect(_placeHolderTextStyleManager.resolveParaPropertyFor(1)).
                  toEqual(undefined);
            });
          });
    });

    describe('Resolve Body properties tests', function() {

      var _masterBodyProperties = {
        anchor: 'top',
        vert: 'horz',
        wrap: 'square'
      };

      var _layoutBodyProperties = {
        bIns: '45720',
        lIns: '91440',
        rIns: '91440',
        tIns: '45720'
      };

      var _resolvedBodyproperties = {
        anchor: 'top',
        vert: 'horz',
        wrap: 'square',
        bIns: '45720',
        lIns: '91440',
        rIns: '91440',
        tIns: '45720'
      };


      describe('when master body properties defined and layout body ' +
          'properties undefined', function() {

            beforeEach(function() {
              PointModel.CurrentPlaceHolderAtSlide = {
                phTyp: 'body',
                phIdx: '111'
              };
            });

            it('when phTyp is body', function() {
              _placeHolderTextStyleManager.cacheMasterBodyProperties('body',
                  _masterBodyProperties);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('body',
                  '111', undefined);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_masterBodyProperties);
            });

            it('when phTyp is title', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('title',
                  _masterBodyProperties);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('body',
                  '111', undefined);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_masterBodyProperties);
            });
            it('when phTyp is other', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'other';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('other',
                  _masterBodyProperties);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('body',
                  '111', undefined);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_masterBodyProperties);
            });
            it('when phTyp is ftr', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('ftr',
                  _masterBodyProperties);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('body',
                  '111', undefined);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_masterBodyProperties);
            });
            it('when phTyp is dt', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('dt',
                  _masterBodyProperties);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('body',
                  '111', undefined);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_masterBodyProperties);
            });
            it('when phTyp is sldNum', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('sldNum',
                  _masterBodyProperties);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('body',
                  '111', undefined);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_masterBodyProperties);
            });
            it('when phTyp is invalid', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(undefined);
            });
          });

      describe('when master body properties undefined and layout body ' +
          'properties defined',
          function() {

            beforeEach(function() {
              PointModel.CurrentPlaceHolderAtSlide = {
                phTyp: 'body',
                phIdx: '111'
              };
            });

            it('when phTyp is body', function() {
              _placeHolderTextStyleManager.cacheMasterBodyProperties('body',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('body',
                  '111', _layoutBodyProperties);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_layoutBodyProperties);
            });

            it('when phTyp is title', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('title',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('title',
                  '111', _layoutBodyProperties);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_layoutBodyProperties);
            });
            it('when phTyp is other', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'other';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('other',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('other',
                  '111', _layoutBodyProperties);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_layoutBodyProperties);
            });
            it('when phTyp is ftr', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('ftr',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('ftr',
                  '111', _layoutBodyProperties);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_layoutBodyProperties);
            });
            it('when phTyp is dt', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('dt',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('dt',
                  '111', _layoutBodyProperties);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_layoutBodyProperties);
            });
            it('when phTyp is sldNum', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('sldNum',
                  undefined);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('sldNum',
                  '111', _layoutBodyProperties);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_layoutBodyProperties);
            });
            it('when phTyp is invalid', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(undefined);
            });

          });

      describe('when master body properties and layout body properties defined',
          function() {

            beforeEach(function() {
              PointModel.CurrentPlaceHolderAtSlide = {
                phTyp: 'body',
                phIdx: '111'
              };
            });

            it('when phTyp is body', function() {
              _placeHolderTextStyleManager.cacheMasterBodyProperties('body',
                  _masterBodyProperties);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('body',
                  '111', _layoutBodyProperties);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_resolvedBodyproperties);
            });

            it('when phTyp is title', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('title',
                  _masterBodyProperties);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('title',
                  '111', _layoutBodyProperties);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_resolvedBodyproperties);
            });
            it('when phTyp is other', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'other';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('other',
                  _masterBodyProperties);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('other',
                  '111', _layoutBodyProperties);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_resolvedBodyproperties);
            });
            it('when phTyp is ftr', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('ftr',
                  _masterBodyProperties);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('ftr',
                  '111', _layoutBodyProperties);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_resolvedBodyproperties);
            });
            it('when phTyp is dt', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('dt',
                  _masterBodyProperties);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('dt',
                  '111', _layoutBodyProperties);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_resolvedBodyproperties);
            });
            it('when phTyp is sldNum', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              _placeHolderTextStyleManager.cacheMasterBodyProperties('sldNum',
                  _masterBodyProperties);
              _placeHolderTextStyleManager.cacheLayoutBodyProperties('sldNum',
                  '111', _layoutBodyProperties);
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(_resolvedBodyproperties);
            });
            it('when phTyp is invalid', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
              expect(_placeHolderTextStyleManager.getResolvedBodyProperties()).
                  toEqual(undefined);
            });
          });
    });
  });
});
