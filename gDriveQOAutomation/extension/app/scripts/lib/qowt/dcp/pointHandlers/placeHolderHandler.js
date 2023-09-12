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
 * Handler for Place Holder
 * @constructor
 */
/**
 * JsDoc description
 */
define([
  'qowtRoot/utils/cssManager',
  'qowtRoot/dcp/decorators/placeHolderDecorator',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/presentation/placeHolder/phStyleClassFactory',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/models/point',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager'
], function(CssManager, PlaceHolderDecorator, PlaceHolderManager,
            PHStyleClassFactory, ThemeStyleRefManager, PointModel,
            PlaceHolderPropertiesManager) {

  'use strict';

    var _placeHolderDecorator = PlaceHolderDecorator.create();
    var isStyleForPlaceHolder;

    /**
     * handles the decoration of shape with shapeStyles
     * @param styleObj {Object} style JSON
     * @param placeHolderObj {Object} placeHolder JSON from DCP
     */
    var _handleShape = function(styleObj, placeHolderObj) {
      //handles shape style
      var placeHolderShapeProperties = placeHolderObj.spPr;
      var decoratePlaceHolder =
        _placeHolderDecorator.decorate(styleObj.shapeStyle);

      var txtBodyPr;

      if (placeHolderObj.elm) {
        for (var i = 0; i < placeHolderObj.elm.length; i++) {
          var phChildElement = placeHolderObj.elm[i];
          if (phChildElement.etp === 'phTxBody') {
            txtBodyPr = phChildElement.bodyPr;
            break;
          }
        }
      }

      decoratePlaceHolder.
        withShapeTransform(placeHolderShapeProperties.xfrm, txtBodyPr);
      decoratePlaceHolder.
        withShapeOutline(placeHolderShapeProperties.ln, isStyleForPlaceHolder);
      var effectList = placeHolderShapeProperties.efstlst;
      decoratePlaceHolder.withShapeEffects(effectList);

      var styleClass =
        PHStyleClassFactory.shape.getClassName(styleObj.classPrefix);
      var selector = "." + styleClass;
      CssManager.addRule(selector, styleObj.shapeStyle.styleText, 100);
    };

    /**
     * handles the decoration of shape with shape fill Style
     * @param {Object} styleObj style JSON
     * @param {Object} placeHolderObj placeHolder shape Properties JSON from DCP
     * @param {Object} nvSpPr Object containing non visual shape properties
     */
    var _handleShapeFill = function(styleObj, placeHolderObj, nvSpPr) {
      //handles shape-fill style
      var styleClassName =
        PHStyleClassFactory.shapeFill.getClassName(styleObj.classPrefix);

      var decoratePlaceHolder =
        _placeHolderDecorator.decorate(styleObj.shapeFillStyle);
      decoratePlaceHolder.withShapeFill(placeHolderObj.fill,
        isStyleForPlaceHolder, styleClassName);

      var containerId, selector;

      // To apply the fill, prepare a CSS selector in the form of,
      // div[sldlt="someEid"] [phTyp="type"][phIdx="index"] div[qowt-
      // divtype="shape-fill"]
      // Also, below table shows the mapping for slide-layout PH types and its
      // corresponding master-layout PH.
      // -----------------------------------------------------------------------
      // |     Layout   |    Master    |
      // -----------------------------------------------------------------------
      // |    title     |    title     |
      // |    ctrTitle  |    title     |
      // |    body      |    body      |
      // |    subTitle  |    body      |
      // |    pic       |    body      |
      // -----------------------------------------------------------------------
      // Hence, the selector for 'title' placeholder at master level should also
      // be applicable for 'ctrTitle' at layout level and so on.

      if (PointModel.currentPHLevel === 'sldlt') {
        containerId = PointModel.SlideLayoutId;
        selector = 'div[sldlt="' + containerId + '"] [placeholder-type="' +
            nvSpPr.phTyp + '"][placeholder-index="' + nvSpPr.phIdx +
            '"] div[qowt-divtype="shape-fill"]';
      } else if (PointModel.currentPHLevel === 'sldmt') {
        // We are at master level. Here, phIndex is not required to form the
        // selector. The selector is typically in the form of,
        // div[sldlt="someEid"] div[phTyp="type"] div[qowt-divtype="shape-fill"]
        containerId = PointModel.MasterSlideId;
        selector = 'div[sldmt="' + containerId + '"] [placeholder-type="' +
            nvSpPr.phTyp + '"] div[qowt-divtype="shape-fill"]';

        if (nvSpPr.phTyp === 'title') {
          selector = selector + ', div[sldmt="' + containerId + '"] ' +
              '[placeholder-type="ctrTitle"] div[qowt-divtype="shape-fill"]';
        } else if (nvSpPr.phTyp === 'body') {
          selector = selector + ', div[sldmt="' + containerId + '"] ' +
              '[placeholder-type="subTitle"] div[qowt-divtype=' +
              '"shape-fill"], div[sldmt="' + containerId + '"] ' +
              '[placeholder-type="pic"] div[qowt-divtype="shape-fill"]';
        }
      }

      CssManager.addRule(selector, styleObj.shapeFillStyle.styleText, 100);
    };

    var _api = {
      /* DCP Type Code
       This is used by the DCP Manager to register this Handler */
      etp: 'ph',

      /**
       * Handles DCP response for a Place-Holder shape.
       * @param v {DCP} place-holder DCP JSON
       */
      visit: function(v) {
        // console.log("Inside Place Holder handler - visit");
        var placeHolderObj = (v && v.el) || undefined;

        if (placeHolderObj && placeHolderObj.etp &&
          placeHolderObj.etp === _api.etp &&
          placeHolderObj.nvSpPr && placeHolderObj.nvSpPr.phTyp) {

          var nvSpPr = placeHolderObj.nvSpPr;

          var isGraphicFramePlaceHolder =
            PlaceHolderManager.isPlaceHolderGraphicFrameElement(nvSpPr);

          if (!isGraphicFramePlaceHolder) {
            var containerId = (PointModel.currentPHLevel === 'sldmt') ?
              PointModel.MasterSlideId : PointModel.SlideLayoutId;

            PlaceHolderManager.
              updateCurrentPlaceHolderForLayouts(nvSpPr.phTyp, nvSpPr.phIdx);

            isStyleForPlaceHolder = (placeHolderObj.style) ? true : false;

            // caching shape styles
            if (isStyleForPlaceHolder) {
              ThemeStyleRefManager.cacheShapeStyle(placeHolderObj.style);
            }

            var styleObj =
            {
              'classPrefix': PlaceHolderManager.getClassPrefix(nvSpPr.phTyp,
                nvSpPr.phIdx, PointModel.currentPHLevel, containerId),

              'shapeStyle': {
                'styleText': ''
              },

              'shapeFillStyle': {
                'styleText': ''
              }
            };

            if (placeHolderObj.spPr) {
              _handleShape(styleObj, placeHolderObj);
              _handleShapeFill(styleObj, placeHolderObj.spPr, nvSpPr);
            }

            if (PointModel.currentPHLevel === 'sldmt') {
              PlaceHolderPropertiesManager.
                cacheMasterShapeProperties(nvSpPr.phTyp, placeHolderObj.spPr);
            } else {
              PlaceHolderPropertiesManager.
                cacheLayoutShapeProperties(nvSpPr.phTyp, nvSpPr.phIdx,
                placeHolderObj.spPr);
            }

          }
        }
      }
    };

    return _api;
  });
