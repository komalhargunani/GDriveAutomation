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
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
  'qowtRoot/models/point'
], function(
    PlaceHolderPropertiesManager,
    PointModel) {

  'use strict';


  describe('presentation/placeholder/placeHolderPropertiesManager', function() {
    var _placeHolderPropertiesManager = PlaceHolderPropertiesManager;
    var _masterProperties = {
      fill: 'someMasterfill',
      ln: 'someMasteroutline'
    };
    var _layoutProperties = {
      fill: 'someLayoutfill',
      ln: 'someLayoutoutline'
    };
    PointModel.CurrentPlaceHolderAtSlide = {
      phTyp: 'body',
      phIdx: '111'
    };

    beforeEach(function() {
      PointModel.SlideLayoutId = 'layout';
      PointModel.MasterSlideId = 'master';
    });
    afterEach(function() {
      PointModel.MasterSlideId = undefined;
      PointModel.SlideLayoutId = undefined;
      _placeHolderPropertiesManager.resetCache();
    });

    describe('-getResolvedShapeProperties-', function() {

      describe('should get proper resolved properties when shape properties ' +
          'are defined at layout level but undefined at master level ',
          function() {
            it('when phTyp is body ', function() {
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('body',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is title ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('title',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('title',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is ctrTitle ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ctrTitle';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('title',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties(
                  'ctrTitle', '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is subTitle ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'subTitle';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties(
                  'subTitle', '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is pic ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'pic';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('pic',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is clipArt ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'clipArt';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties(
                  'clipArt', '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is chart ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'chart';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('chart',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is tbl ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'tbl';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('tbl',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is dgm ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dgm';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('dgm',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is media ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'media';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('media',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is dt ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('dt',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('dt',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is ftr ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('ftr',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('ftr',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is sldNum ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('sldNum',
                  undefined);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('sldNum',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });
          });

      describe('should get proper resolved properties when shape properties ' +
          'are undefined at layout level but defined at master level ',
          function() {
            it('when phTyp is body ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'body';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('body',
                  '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });

            it('when phTyp is title ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('title',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('title',
                  '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });

            it('when phTyp is ctrTitle ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ctrTitle';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('title',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties(
                  'ctrTitle', '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });

            it('when phTyp is subTitle ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'subTitle';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties(
                  'subTitle', '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });

            it('when phTyp is pic ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'pic';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('pic',
                  '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });

            it('when phTyp is clipArt ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'clipArt';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties(
                  'clipArt', '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });

            it('when phTyp is chart ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'chart';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('chart',
                  '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });

            it('when phTyp is tbl ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'tbl';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('tbl',
                  '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });

            it('when phTyp is dgm ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dgm';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('dgm',
                  '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });

            it('when phTyp is media ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'media';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('media',
                  '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });

            it('when phTyp is dt ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('dt',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('dt',
                  '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });

            it('when phTyp is ftr ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('ftr',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('ftr',
                  '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });

            it('when phTyp is sldNum ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('sldNum',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('sldNum',
                  '111', undefined);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_masterProperties);
            });
          });

      describe('should get proper resolved properties when shape properties ' +
          'are defined at layout level as well as at master level ',
          function() {
            it('when phTyp is body ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'body';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('body',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is title ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('title',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('title',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is ctrTitle ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ctrTitle';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('title',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties(
                  'ctrTitle', '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is subTitle ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'subTitle';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties(
                  'subTitle', '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is pic ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'pic';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('pic',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is clipArt ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'clipArt';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties(
                  'clipArt', '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is chart ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'chart';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('chart',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is tbl ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'tbl';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('tbl',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is dgm ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dgm';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('dgm',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is media ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'media';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('body',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('media',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is dt ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'dt';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('dt',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('dt',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is ftr ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'ftr';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('ftr',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('ftr',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });

            it('when phTyp is sldNum ', function() {
              PointModel.CurrentPlaceHolderAtSlide.phTyp = 'sldNum';
              _placeHolderPropertiesManager.cacheMasterShapeProperties('sldNum',
                  _masterProperties);
              _placeHolderPropertiesManager.cacheLayoutShapeProperties('sldNum',
                  '111', _layoutProperties);
              expect(_placeHolderPropertiesManager.
                  getResolvedShapeProperties()).toEqual(_layoutProperties);
            });
          });
    });
  });
});
