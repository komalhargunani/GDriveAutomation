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
 * Shape / Picture handler. handles element sp / pic
 */
define([
  'qowtRoot/dcp/decorators/shapeDecorator',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/models/point',
  'qowtRoot/utils/objectUtils',
  'qowtRoot/widgets/shape/shape'
],
function(
    ShapeDecorator,
    UnitConversionUtils,
    ThemeStyleRefManager,
    PlaceHolderManager,
    PlaceHolderPropertiesManager,
    QOWTMarkerUtils,
    DeprecatedUtils,
    PointModel,
    ObjectUtils,
    ShapeWidget) {

  'use strict';

  var _widget;

  var _api = {

    /**
       * DCP Type Code
       * This is used by the DCP Manager to register this handler
       */
    etp: ['sp', 'pic'],

    /**
       * Render a Shape element from DCP
       * @param {object} dcp Shape DCP JSON
       * @return {HTMLElement} shape div
       */
    visit: function(dcp) {
      var shapeDiv;
      if (dcp && dcp.el && dcp.el.etp &&
          (dcp.el.etp === 'sp' || dcp.el.etp === 'pic') &&
          dcp.el.eid) {

        // TODO [Rahul Tarafdar] Legacy shape widget will be replaced with
        // polymer shape element. This is a hack to pass model as constructor
        // parameter for legacy shape widget.

        _widget = ShapeWidget.create({'newId': dcp.el.eid, 'model': dcp.el});

        if (_widget) {
          shapeDiv = _widget.getWidgetElement();

          var resolvedSpPr, shapeJson = dcp.el, objectUtils,
              shapeDecorator = ShapeDecorator.create();

          //spPr in ECMA is mandatory. But, when it is an empty tag, core can
          // only return a null Object.
          shapeJson.spPr = shapeJson.spPr || {};

          if (!objectUtils) {
            objectUtils = new ObjectUtils();
          }

          // not getting the "geom" property for place holders from DCP, so
          // setting it here
          if (shapeJson.nvSpPr && shapeJson.nvSpPr.phTyp) {

            PointModel.isPlaceholderShape = true;

            //Check whether placeholder is for graphic frame or not.
            if (PlaceHolderManager.
                isPlaceHolderGraphicFrameElement(shapeJson.nvSpPr)) {
              return undefined;
            }

            // TODO(bhushan.shitole): Get rid of 'CurrentPlaceHolderAtSlide'
            // variable from PointModel (used in
            // updateCurrentPlaceHolderForShape method). In rendering, this
            // variable is used at many places like pointParagraphDecorator,
            // pointTextDecorator, pointBulletDecorator to get placeholder shape
            // information.
            // So for now keeping as it is.
            PlaceHolderManager.
                updateCurrentPlaceHolderForShape(shapeJson.nvSpPr.phTyp,
                shapeJson.nvSpPr.phIdx);
            shapeDiv.setAttribute('placeholder-type', shapeJson.nvSpPr.phTyp);
            shapeDiv.setAttribute('placeholder-index', shapeJson.nvSpPr.phIdx);

            resolvedSpPr =
                PlaceHolderPropertiesManager.getResolvedShapeProperties();

            var isFillRef = shapeJson.style && shapeJson.style.fillRef;

            _updateShapePropertiesForPlaceHolder(shapeJson.spPr, resolvedSpPr,
                isFillRef);
          } else {

            PointModel.isPlaceholderShape = false;

            //non PH shapeJson. Reset the PH classes.
            PlaceHolderManager.resetCurrentPlaceHolderForShape();

            //attach prstDash for borders if undefined for non PH shapeJson.
            if (shapeJson.spPr.ln && !shapeJson.spPr.ln.prstDash) {
              shapeJson.spPr.ln.prstDash = 'solid';
            }
          }

          // caching shape styles
          ThemeStyleRefManager.cacheShapeStyle(shapeJson.style);

          if (shapeJson.spPr.xfrm || (resolvedSpPr && resolvedSpPr.xfrm)) {
            shapeDecorator.decorate(shapeDiv, shapeJson);
          } else {
            // If the shape does not have transforms hide it.
            shapeDiv.setAttribute('hidden', true);
          }
          _setImageEid(shapeJson, shapeDiv.id, resolvedSpPr);

          // caching shape JSON
          _widget.setJson(objectUtils.clone(shapeJson));

          var lnk = shapeJson.lnk;
          if (lnk && (lnk.indexOf('ppt/slides') !== 0 &&
              lnk.indexOf('file:') !== 0 && lnk.indexOf('../') !== 0)) {
            QOWTMarkerUtils.addQOWTMarker(shapeDiv, 'hyperlink', lnk);
          }

          dcp.node.appendChild(shapeDiv);

        }
      }

      return shapeDiv;
    },

    /**
       * postTraverse gets called *after* all child elements have been handled
       * this can be used to only add our new element to the DOM *after* the
       * children have been handled to reduce the number of DOM calls that are
       * made.
       */
    postTraverse: function() {
      ThemeStyleRefManager.resetShapeStyle();
      _widget = undefined;
    }
  };

  /**
     * Set the shape properties (geom, xfrm, fill,line and effectlist) to the
     * shape
     * @param {object} shapePr - Shape properties
     * @param {object} resolvedSpPr - Resolved shape properties
     * @param {object} isFillRef - shape fill reference properties
     */
  var _updateShapePropertiesForPlaceHolder =
      function(shapePr, resolvedSpPr, isFillRef) {
    //setting geom
    if (!shapePr.geom) {
      shapePr.geom = (resolvedSpPr && resolvedSpPr.geom) ?
          resolvedSpPr.geom : { prst: 88 };
    }

    if (resolvedSpPr &&
        (!shapePr.geom.prst || shapePr.geom.prst.toString() !== '88')) {
      //setting xfrm
      var xfrm = {};
      DeprecatedUtils.appendJSONAttributes(xfrm, resolvedSpPr.xfrm);
      DeprecatedUtils.appendJSONAttributes(xfrm, shapePr.xfrm);
      shapePr.xfrm = xfrm;

      //setting fill
      if (!shapePr.fill && !isFillRef) {
        shapePr.fill = resolvedSpPr.fill;
      }

      //setting outline
      var ln = {};
      DeprecatedUtils.appendJSONAttributes(ln, resolvedSpPr.ln);
      DeprecatedUtils.appendJSONAttributes(ln, shapePr.ln);
      shapePr.ln = ln;

      //setting effect-list
      if (!shapePr.efstlst) {
        shapePr.efstlst = resolvedSpPr.efstlst;
      }
    }
  };

  /**
     * sets the eid for the image element inside the picture JSON
     * @param {Object} el el item of the Picture JSON
     * @param {String} shapeDivEid eid for the shape div
     * @param {object} resolvedSpPr Resolved shape properties
     *
     * TODO [Rahul Tarafdar]this method adds up additional information to img
     * etp. Reason is point image DCP do not have those required properties.
     * Either fix DCP or fix up image handler at QOWT
     * TODO (tushar.bende):Refactor this function as it is doing lot of things
     * instead of just setting Image eid.
     */
  var _setImageEid = function(el, shapeDivEid, resolvedSpPr) {
    if (el.etp === 'pic' && el.elm !== undefined && el.elm[0] !== undefined) {
      var image = el.elm[0];
      var shapeExtents = el.spPr.xfrm;
      var convertEmuToPixel = UnitConversionUtils.convertEmuToPixel;
      // shapeExtents will be undefined if both explicit & resolved transform
      // properties are unavailable.
      if (!shapeExtents && resolvedSpPr) {
        shapeExtents = resolvedSpPr.xfrm;
      }
      image.eid = shapeDivEid + 'img';
      if (shapeExtents) {
        if (shapeExtents.rot !== undefined && shapeExtents.rot !== '0') {
          image.rotation = true;
        } else {
          image.rotation = false;
        }

        image.wdt = convertEmuToPixel(shapeExtents.ext.cx);
        image.hgt = convertEmuToPixel(shapeExtents.ext.cy);
      }
    }
  };


  return _api;
});
