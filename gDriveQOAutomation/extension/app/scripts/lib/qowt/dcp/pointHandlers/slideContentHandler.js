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
 * This is the handler for a slide. It calls the slide decorator for creating
 * and rendering the actual slide.
 * @constructor
 */
define([
  'qowtRoot/models/point',
  'qowtRoot/dcp/decorators/slideDecorator',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/utils/cssManager',
  'qowtRoot/widgets/point/thumbnailStrip'
], function(
    PointModel,
    SlideDecorator,
    ColorUtility,
    LayoutsManager,
    CssManager,
    ThumbnailStrip) {

  'use strict';

  var _slideDecorator;
  var _api = {
    /* DCP Type Code
     This is used by the DCP Manager to register this Handler */
    etp: 'sld',

    /**
     * Render a Slide element from DCP
     * @param v {DCP} slide DCP JSON
     * @return {DOM Element} slide div
     */
    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {
        PointModel.slideColorMap[PointModel.SlideId] = v.el.clrMapOvr;

        if (LayoutsManager.isReRenderingCurrentSlide() === false &&
          v.el.clrMapOvr) {
          LayoutsManager.setSlideReRenderingFlag(true);
          v.el.elm = [];
          return undefined;
        }

        PointModel.currentPHLevel = 'sld';
        if (!_slideDecorator) {
          _slideDecorator = SlideDecorator.create();
        }

        var decorateSlide = _slideDecorator.decorate(v).withNewDiv();
        var slideDiv = decorateSlide.withSlideProperties().getDecoratedDiv();

        v.node.appendChild(slideDiv);

        decorateSlide.withBackgroundDiv();

        if (v.el.hideParentSp) {
          slideDiv.setAttribute('qowt-hideParentSp','true');
        }


        //get current slide number
        var currentSlideNumber = PointModel.SlideId;

        //get slide widget from thumbnail strip controller
        var slideWidget = ThumbnailStrip.thumbnail(currentSlideNumber - 1);

        // TODO(wasim.pathan) We should not poke pointModel to get the slide
        // layout and master IDs. When we will migrate the slide widget to slide
        // polymer element, we should store these IDs as polymer element
        // properties.
        slideDiv.setAttribute('sldlt', PointModel.SlideLayoutId);
        slideDiv.setAttribute('sldmt', PointModel.MasterSlideId);

        //tell slide widget about slide show hide property
        slideWidget.setHiddenInSlideShow(v.el.hide);

        // Create classes for text hyperlinks if the coloroverride is present
        if (v.el.clrMapOvr) {
          CssManager.addRule('#' + v.el.eid + ' span[link],' +
              ' #t-' + v.el.eid + ' span[link]', {
                'color': ColorUtility.getHexEquivalentOfSchemeColor('hlink') +
                    ' !important'
              }, 100);
        }
        return slideDiv;
      } else {
        return undefined;
      }
    },

    /**
     * Called after all of the child (i.e. series) elements of this chart have
     * been processed
     *
     * @param v {object} A chart element in a DCP response
     */
    postTraverse: function(v) {
      if(!v.el.elm || v.el.elm.length !== 0) {
        LayoutsManager.setSlideReRenderingFlag(false);
      }
    }
  };

  return _api;
});
