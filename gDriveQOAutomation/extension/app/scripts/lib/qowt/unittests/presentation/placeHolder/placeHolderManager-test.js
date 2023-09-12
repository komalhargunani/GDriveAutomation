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
  'qowtRoot/models/point',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/presentation/placeHolder/phStyleClassFactory'
], function(
    PointModel,
    PlaceHolderManager,
    PHStyleClassFactory) {

  'use strict';


  describe('presentation/placeholder/placeholderManager', function() {
    var _placeHolderManager = PlaceHolderManager;
    var _phStyleClassFactory = PHStyleClassFactory;

    it('should return true if phType is graphicFrame element (chart, table ' +
        'and smart art) , from -isPlaceHolderGraphicFrameElement-', function() {
          var nvSpPr = {
            phTyp: 'chart'
          };

          var isGraphiFrameElement = _placeHolderManager.
              isPlaceHolderGraphicFrameElement(nvSpPr);
          expect(isGraphiFrameElement).toEqual(true);
        });

    it('should return false if phType is non-graphicFrame element (except ' +
        'chart, table and smart art) , from -isPlaceHolderGraphicFrameElement-',
        function() {
          var nvSpPr = {
            phTyp: 'body'
          };

          var isGraphiFrameElement = _placeHolderManager.
              isPlaceHolderGraphicFrameElement(nvSpPr);
          expect(isGraphiFrameElement).toEqual(false);
        });

    it('should call -getClassPrefix- twice for sldmt and sldlt, from ' +
        '-updateCurrentPlaceHolderForShape-', function() {
          var phType = 'body';
          var phIdx = '1';

          spyOn(_placeHolderManager, 'getClassPrefix');

          PointModel.MasterSlideId = '786';
          PointModel.SlideLayoutId = '420';

          _placeHolderManager.updateCurrentPlaceHolderForShape(phType, phIdx);

          expect(_placeHolderManager.getClassPrefix.calls[0].args).toEqual(
              [phType, phIdx, 'sldmt', '786']);
          expect(_placeHolderManager.getClassPrefix.calls[1].args).toEqual(
              [phType, phIdx, 'sldlt', '420']);
          expect(PointModel.CurrentPlaceHolderAtSlide.phTyp).toEqual(phType);
          expect(PointModel.CurrentPlaceHolderAtSlide.phIdx).toEqual(phIdx);

          PointModel.MasterSlideId = undefined;
          PointModel.SlideLayoutId = undefined;
        });

    it('should apply PH style classes when not a text-run and not a paragraph',
       function() {
         var isTextRun = false;

         var phStyleClassType = _phStyleClassFactory.shape;
         spyOn(phStyleClassType, 'getClassName').andCallThrough();

         var htmlElement = document.createElement('div');

         PointModel.MasterSlideId = '786';
         PointModel.SlideLayoutId = '420';
         _placeHolderManager.updateCurrentPlaceHolderForShape('body', '1');

         _placeHolderManager.applyPhClasses(htmlElement, phStyleClassType,
             isTextRun);

         expect(phStyleClassType.getClassName.callCount).toEqual(2);
         expect(phStyleClassType.getClassName.calls[0].args).toEqual(
             ['body_sldmt_786']);
         expect(phStyleClassType.getClassName.calls[1].args).toEqual(
             ['body_1_sldlt_420']);

         expect(htmlElement.className).toEqual(' body_sldmt_786_shapeStyle' +
             ' body_1_sldlt_420_shapeStyle');
         htmlElement = undefined;
       });

    it('should return true if PH is editable', function() {
      expect(_placeHolderManager.isEditablePlaceHolderShape('body')).
          toEqual(true);
      expect(_placeHolderManager.isEditablePlaceHolderShape('subTitle')).
          toEqual(true);
      expect(_placeHolderManager.isEditablePlaceHolderShape('title')).
          toEqual(true);
      expect(_placeHolderManager.isEditablePlaceHolderShape('ctrTitle')).
          toEqual(true);
    });

    it('should return false if PH is not editable', function() {
      expect(_placeHolderManager.isEditablePlaceHolderShape('chart')).
          toEqual(false);
      expect(_placeHolderManager.isEditablePlaceHolderShape('clipArt')).
          toEqual(false);
      expect(_placeHolderManager.isEditablePlaceHolderShape('dgm')).
          toEqual(false);
      expect(_placeHolderManager.isEditablePlaceHolderShape('media')).
          toEqual(false);
      expect(_placeHolderManager.isEditablePlaceHolderShape('obj')).
          toEqual(false);
      expect(_placeHolderManager.isEditablePlaceHolderShape('pic')).
          toEqual(false);
      expect(_placeHolderManager.isEditablePlaceHolderShape('tbl')).
          toEqual(false);
      expect(_placeHolderManager.isEditablePlaceHolderShape('dt')).
          toEqual(false);
      expect(_placeHolderManager.isEditablePlaceHolderShape('ftr')).
          toEqual(false);
      expect(_placeHolderManager.isEditablePlaceHolderShape('sldNum')).
          toEqual(false);
    });

    describe('-getClassPrefix-', function() {

      var containerType = {
        master: 'sldmt',
        layout: 'sldlt'
      };
      var containerId = '420';
      var phIdx = '911';

      it('should return empty string when container type is neither master ' +
          'or layout', function() {
            var classPrefix = _placeHolderManager.getClassPrefix('phType', '1',
                'buggyContainer', '111');
            expect(classPrefix).toEqual('');
          });

      describe('when container is master-layout', function() {

        it('PH type is -body-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('body', phIdx,
              containerType.master, containerId);
          expect(classPrefix).toEqual('body_sldmt_420');
        });

        it('PH type is -chart-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('chart', phIdx,
              containerType.master, containerId);
          expect(classPrefix).toEqual('body_sldmt_420');
        });

        it('PH type is -clipArt-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('clipArt', phIdx,
              containerType.master, containerId);
          expect(classPrefix).toEqual('body_sldmt_420');
        });

        it('PH type is -dgm-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('dgm',
              phIdx, containerType.master, containerId);
          expect(classPrefix).toEqual('body_sldmt_420');
        });

        it('PH type is -media-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('media',
              phIdx, containerType.master, containerId);
          expect(classPrefix).toEqual('body_sldmt_420');
        });

        it('PH type is -obj-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('obj', phIdx,
              containerType.master, containerId);
          expect(classPrefix).toEqual('body_sldmt_420');
        });

        it('PH type is -pic-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('pic', phIdx,
              containerType.master, containerId);
          expect(classPrefix).toEqual('body_sldmt_420');
        });

        it('PH type is -tbl-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('tbl', phIdx,
              containerType.master, containerId);
          expect(classPrefix).toEqual('body_sldmt_420');
        });

        it('PH type is -subTitle-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('subTitle',
              phIdx, containerType.master, containerId);
          expect(classPrefix).toEqual('body_sldmt_420');
        });

        it('PH type is -title-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('title', phIdx,
              containerType.master, containerId);
          expect(classPrefix).toEqual('title_sldmt_420');
        });

        it('PH type is -ctrTitle-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('ctrTitle',
              phIdx, containerType.master, containerId);
          expect(classPrefix).toEqual('title_sldmt_420');
        });

        it('PH type is -ftr-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('ftr', phIdx,
              containerType.master, containerId);
          expect(classPrefix).toEqual('ftr_sldmt_420');
        });

        it('PH type is -dt-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('dt', phIdx,
              containerType.master, containerId);
          expect(classPrefix).toEqual('dt_sldmt_420');
        });

        it('PH type is -sldNum-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('sldNum', phIdx,
              containerType.master, containerId);
          expect(classPrefix).toEqual('sldNum_sldmt_420');
        });

        it('PH type is -other-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('other', phIdx,
              containerType.master, containerId);
          expect(classPrefix).toEqual('other_sldmt_420');
        });

      });

      describe('when container is slide-layout', function() {

        it('PH type is -body-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('body', phIdx,
              containerType.layout, containerId);
          expect(classPrefix).toEqual('body_911_sldlt_420');
        });

        it('PH type is -chart-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('chart', phIdx,
              containerType.layout, containerId);
          expect(classPrefix).toEqual('chart_911_sldlt_420');
        });

        it('PH type is -clipArt-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('clipArt', phIdx,
              containerType.layout, containerId);
          expect(classPrefix).toEqual('clipArt_911_sldlt_420');
        });

        it('PH type is -dgm-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('dgm', phIdx,
              containerType.layout, containerId);
          expect(classPrefix).toEqual('dgm_911_sldlt_420');
        });

        it('PH type is -media-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('media', phIdx,
              containerType.layout, containerId);
          expect(classPrefix).toEqual('media_911_sldlt_420');
        });

        it('PH type is -obj-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('obj', phIdx,
              containerType.layout, containerId);
          expect(classPrefix).toEqual('obj_911_sldlt_420');
        });

        it('PH type is -pic-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('pic', phIdx,
              containerType.layout, containerId);
          expect(classPrefix).toEqual('pic_911_sldlt_420');
        });

        it('PH type is -tbl-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('tbl', phIdx,
              containerType.layout, containerId);
          expect(classPrefix).toEqual('tbl_911_sldlt_420');
        });

        it('PH type is -subTitle-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('subTitle',
              phIdx, containerType.layout, containerId);
          expect(classPrefix).toEqual('subTitle_911_sldlt_420');
        });

        it('PH type is -title-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('title', phIdx,
              containerType.layout, containerId);
          expect(classPrefix).toEqual('title_sldlt_420');
        });

        it('PH type is -ctrTitle-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('ctrTitle',
              phIdx, containerType.layout, containerId);
          expect(classPrefix).toEqual('ctrTitle_sldlt_420');
        });

        it('PH type is -ftr-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('ftr', phIdx,
              containerType.layout, containerId);
          expect(classPrefix).toEqual('ftr_sldlt_420');
        });

        it('PH type is -dt-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('dt', phIdx,
              containerType.layout, containerId);
          expect(classPrefix).toEqual('dt_sldlt_420');
        });

        it('PH type is -sldNum-', function() {
          var classPrefix = _placeHolderManager.getClassPrefix('sldNum', phIdx,
              containerType.layout, containerId);
          expect(classPrefix).toEqual('sldNum_sldlt_420');
        });

      });
    });
  });
});
