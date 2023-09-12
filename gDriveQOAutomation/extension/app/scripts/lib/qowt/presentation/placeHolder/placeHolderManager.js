/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */



/**
 * @constructor
 */
define([
  'qowtRoot/models/point',
  'qowtRoot/presentation/layoutsManager'
], function(PointModel, LayoutsManager) {

  'use strict';

  /**
   * is re-initialized every time we get a new PH shape in slide
   * contains the prefix for the PH style class name, for master and slide
   * layout
   * JSON structure is
   *{
   *  "sldmt": class prefix for master,
   *  "sldlt" :  class prefix for slide-layout
   *}
   * @type {Object}
   * @private
   */
  var _shapeClassPrefix = {
    sldlt: undefined,
    sldmt: undefined
  };

  /**
   * JSON map for slide-layout PH types and its corresponding master-layout PH
   * type
   * @type {Object}
   * @private
   */
  var _phTypePropertiesMap = {
    body: {
      masterPhType: 'body',
      isGraphicElement: false
    },
    chart: {
      masterPhType: 'body',
      isGraphicElement: true
    },
    clipArt: {
      masterPhType: 'body',
      isGraphicElement: false
    },
    dgm: {
      masterPhType: 'body',
      isGraphicElement: true
    },
    media: {
      masterPhType: 'body',
      isGraphicElement: false
    },
    obj: {
      masterPhType: 'body',
      isGraphicElement: false
    },
    pic: {
      masterPhType: 'body',
      isGraphicElement: false
    },
    tbl: {
      masterPhType: 'body',
      isGraphicElement: true
    },
    subTitle: {
      masterPhType: 'body',
      masterTextStyle: 'body',
      isGraphicElement: false
    },
    title: {
      masterPhType: 'title',
      isGraphicElement: false
    },
    ctrTitle: {
      masterPhType: 'title',
      masterTextStyle: 'title',
      isGraphicElement: false
    },
    other: {
      masterPhType: 'other',
      isGraphicElement: false
    },
    dt: {
      masterPhType: 'dt',
      masterTextStyle: 'other',
      isGraphicElement: false
    },
    ftr: {
      masterPhType: 'ftr',
      masterTextStyle: 'other',
      isGraphicElement: false
    },
    sldNum: {
      masterPhType: 'sldNum',
      masterTextStyle: 'other',
      isGraphicElement: false
    }
  };

  var _api = {

    /**
     * Updates current place-holder processed at slide level for shape.
     * @param {String} phType Place-holder type
     * @param {String} phIdx Place-holder index
     * @param {String=} opt_masterId slide master eid
     * @param {String=} opt_layoutId slide layout eid
     */
    updateCurrentPlaceHolderForShape: function(phType, phIdx, opt_masterId,
                                               opt_layoutId) {
      PointModel.CurrentPlaceHolderAtSlide.phTyp = phType;
      PointModel.CurrentPlaceHolderAtSlide.phIdx = phIdx;

      // TODO(wasim.pathan) We should not update the master slide ID and layout
      // ID every time while updating the current placeholder for shape. This
      // needs to be refactored so that we need not to rely on PointModel for
      // these values.
      if (opt_masterId) {
        PointModel.MasterSlideId = opt_masterId;
      }
      if (opt_layoutId) {
        PointModel.SlideLayoutId = opt_layoutId;
      }
      _shapeClassPrefix.sldmt =
          _api.getClassPrefix(phType, phIdx, 'sldmt', PointModel.MasterSlideId);
      _shapeClassPrefix.sldlt =
          _api.getClassPrefix(phType, phIdx, 'sldlt', PointModel.SlideLayoutId);
    },

    /**
     * Updates current place-holder processed at slide master/ slide layout
     * level.
     * @param {String} phType Place-holder type
     * @param {String} phIdx Place-holder index
     */
    updateCurrentPlaceHolderForLayouts: function(phType, phIdx) {
      PointModel.CurrentPlaceHolderAtLayouts.phTyp = phType;
      PointModel.CurrentPlaceHolderAtLayouts.phIdx = phIdx;
    },

    /**
     * applies the PH style class to the html-element
     * @param {HTMLElement} htmlElement Html-element to apply the style class to
     * @param {Object} phStyleClassType PHStyleClassFactory.<style-type>
     */
    applyPhClasses: function(htmlElement, phStyleClassType) {
      //check if the current -htmlElement- depends on a PH
      if (_shapeClassPrefix.sldmt && _shapeClassPrefix.sldlt) {
        //PH element
        var sldmtClass = phStyleClassType.getClassName(_shapeClassPrefix.sldmt);
        var sldltClass = phStyleClassType.getClassName(_shapeClassPrefix.sldlt);
        if (!htmlElement.classList.contains(sldmtClass)) {
          htmlElement.className += (' ' + sldmtClass);
        }
        if (!htmlElement.classList.contains(sldltClass)) {
          htmlElement.className += (' ' + sldltClass);
        }
      }
    },

    /**
     * Resets current place-holder processed at slide level for shape.
     */
    resetCurrentPlaceHolderForShape: function() {
      PointModel.CurrentPlaceHolderAtSlide.phTyp = undefined;
      PointModel.CurrentPlaceHolderAtSlide.phIdx = undefined;

      _shapeClassPrefix.sldmt = undefined;
      _shapeClassPrefix.sldlt = undefined;
    },

    /**
     * Resets current place-holder processed at slide master/slide layout level.
     */
    resetCurrentPlaceHolderForLayouts: function() {
      PointModel.CurrentPlaceHolderAtLayouts.phTyp = undefined;
      PointModel.CurrentPlaceHolderAtLayouts.phIdx = undefined;
    },

    /**
     * Calculates Master and Slide layout CSS class names for placeholders.
     * @param {String} phType Place-holder type
     * @param {String} phIdx Place-holder Index
     * @param {String} containerType String which should contain either 'sldlt'
     *                               or 'sldmt'
     * @param {String} containerId Id of slide-layout or master-layout
     * @return {String} returns the class prefix for the place-holder
     */
    getClassPrefix: function(phType, phIdx, containerType, containerId) {

      var placeHolderClassPrefix = '';
      if (containerType === 'sldmt') {

        placeHolderClassPrefix = _phTypePropertiesMap[phType].masterPhType +
            '_' + containerType + '_' + containerId;

      } else if (containerType === 'sldlt') {

        if (_phTypePropertiesMap[phType].masterPhType === 'body') {
          //for -body- PHs, use phIdx
          placeHolderClassPrefix =
              phType + '_' + phIdx + '_' + containerType + '_' + containerId;
        } else {
          //for -title- or -ftr- PHs, do not use phIdx, as they occur only once
          placeHolderClassPrefix =
              phType + '_' + containerType + '_' + containerId;
        }
      }

      if (LayoutsManager.isReRenderingCurrentSlide() === true) {
        placeHolderClassPrefix += PointModel.SlideId;
      }

      return placeHolderClassPrefix;
    },

    /**
     * Check whether place holder is type of graphic frame (chart, table,
     * smartArt ) or not.
     * @param {object} nvSpPr Non visual shape properties of placeholder
     * @return {boolean} true if placeholder is of graphicFrame type
     */
    isPlaceHolderGraphicFrameElement: function(nvSpPr) {
      return _phTypePropertiesMap[nvSpPr.phTyp].isGraphicElement;
    },

    /**
     * Right now we are allowing text edit to placeholders of types "title",
     * "ctrTitle", "subTitle" and "body" only.
     * @param {string} phTyp  Placeholder type
     * @return {boolean} True if it's an editable placeholder
     */
    isEditablePlaceHolderShape: function(phTyp) {
      return phTyp === 'body' || phTyp === 'subTitle' || phTyp === 'title' ||
          phTyp === 'ctrTitle';
    }

  };

  return _api;
});
