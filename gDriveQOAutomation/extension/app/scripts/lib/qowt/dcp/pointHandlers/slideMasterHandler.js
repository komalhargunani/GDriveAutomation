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
 * This is the handler for a slide Master. It calls the slide decorator for
 * creating and rendering the slide Master.
 * @constructor
 */
define([
  'qowtRoot/models/point',
  'qowtRoot/dcp/decorators/slideDecorator',
  'qowtRoot/dcp/decorators/slideFillDecorator',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/utils/cssManager'
], function(
    PointModel,
    SlideDecorator,
    SlideFillDecorator,
    ColorUtility,
    PlaceHolderTextStyleManager,
    CssManager) {

  'use strict';

  var _slideDecorator = SlideDecorator.create();

  var _api = {
    /* DCP Type Code
     This is used by the DCP Manager to register this Handler */
    etp: 'sldmt',

    /**
     * Render a Slide element from DCP
     * @param v {DCP} slide DCP JSON
     * @return {DOM Element} slide div
     */
    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {
        var slideMaster = v.el;

        PointModel.currentPHLevel = slideMaster.etp;
        PlaceHolderTextStyleManager.cacheMasterTextStyle(slideMaster.txStlArr);

        var decorateSlide = _slideDecorator.decorate(v).withNewDiv();
        var slideDiv = decorateSlide.withSlideProperties().getDecoratedDiv();
        v.node.appendChild(slideDiv);

        PointModel.masterLayoutMap[slideMaster.eid] = {
          refDiv: slideDiv,
          clrMap: slideMaster.clrMapOvr
        };

        _setBackgroundFillStyle(slideMaster);

        // Create classes for text hyperlinks
        CssManager.addRule('div[sldmt="' + slideMaster.eid + '"] span[link]', {
          'color': ColorUtility.getHexEquivalentOfSchemeColor('hlink',
              'master') + ' !important'
        }, 100);

        return slideDiv;
      }
      else {
        return undefined;
      }
    }
  };

  // -------------------- PRIVATE ----------------------
  /**
   * Prepares the slide background as per the fill information supplied at this
   * (slide master) level and applies it as CSS attribute class
   * @param {JSON} slideMaster DCP JSON
   * @private
   */
  var _setBackgroundFillStyle = function(slideMaster) {
    if (slideMaster.fill || slideMaster.bgFillRef) {
      // prepare css selector based on the current level and all
      // known level IDs as of now
      var cssSelector = '.slideBackground[masterid="' + slideMaster.eid + '"]';

      SlideFillDecorator.setFill(cssSelector, slideMaster);
    }
  };

  return _api;
});
