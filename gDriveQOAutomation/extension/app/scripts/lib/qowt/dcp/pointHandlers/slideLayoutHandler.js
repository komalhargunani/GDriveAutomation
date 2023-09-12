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
 * This is the handler for a slide Layout. It calls the slide decorator for
 * creating and rendering the slide Layout.
 * @constructor
 */
define([
  'qowtRoot/models/point',
  'qowtRoot/dcp/decorators/slideDecorator',
  'qowtRoot/dcp/decorators/slideFillDecorator',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/utils/cssManager'
], function(PointModel,
            SlideDecorator,
            SlideFillDecorator,
            ColorUtility,
            CssManager) {

  'use strict';

  var _slideDecorator;
  var _api = {
    /* DCP Type Code
     This is used by the DCP Manager to register this Handler */
    etp: 'sldlt',

    /**
     * Render a Slide element from DCP
     * @param v {DCP} slide DCP JSON
     * @return {DOM Element} slide div
     */
    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {

        var slide = v.el;

        PointModel.currentPHLevel = slide.etp;
        if (!_slideDecorator) {
          _slideDecorator = SlideDecorator.create();
        }

        var decorateSlide = _slideDecorator.decorate(v).withNewDiv();
        var slideDiv = decorateSlide.withSlideProperties().getDecoratedDiv();
        v.node.appendChild(slideDiv);

        PointModel.slideLayoutMap[slide.eid] = {
          refDiv: slideDiv,
          clrMap: slide.clrMapOvr
        };

        _setBackgroundFillStyle(slide);

        if (v.el.hideParentSp) {
          v.node.firstChild.setAttribute('qowt-hideParentSp',true);
        }

        // Create classes for text hyperlinks if it has a colormapoverride
        if (slide.clrMapOvr) {
          // Create classes for text hyperlinks
          CssManager.addRule('div[sldlt="' + slide.eid + '"] span[link]', {
            'color': ColorUtility.getHexEquivalentOfSchemeColor('hlink',
                'layout') + ' !important'
          }, 100);
        }
        return slideDiv;
      } else {
        return undefined;
      }
    }
  };

  // -------------------- PRIVATE ----------------------
  /**
   * Prepares the slide background as per the fill information supplied at this
   * (layout) level and applies it as CSS attribute class
   * @param {JSON} slideLayout DCP JSON
   * @private
   */
  var _setBackgroundFillStyle = function(slideLayout) {
    if (slideLayout.fill || slideLayout.bgFillRef) {
      // prepare css selector based on the current level and all
      // known level IDs as of now
      var cssSelector = '.slideBackground[masterid="' + PointModel.
          MasterSlideId + '"][layoutid="' + slideLayout.eid + '"]';

      SlideFillDecorator.setFill(cssSelector, slideLayout);
    }
  };

  return _api;
});
