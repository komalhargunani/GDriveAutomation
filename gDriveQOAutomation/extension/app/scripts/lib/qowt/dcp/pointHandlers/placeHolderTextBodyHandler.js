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
 * Handler for Place Holder text body
 * @constructor
 */
define([
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/models/point',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/dcp/pointHandlers/shapeTextBodyHandler',
  'qowtRoot/features/utils'],
  function(PlaceHolderManager, PointModel, PlaceHolderTextStyleManager,
           ShapeTextBodyHandler, Features) {

  'use strict';

    /**
     * Handles the decoration of place-holder with text body properties.
     *
     * @param phType {String} place-holder type
     * @param phIndex {String} place-holder index
     * @param bodyPr {Object} place-holder body properties JSON from DCP
     */
    var _handleBodyProperties = function(phType, phIndex, bodyPr) {
      if (PointModel.currentPHLevel === 'sldmt') {
        PlaceHolderTextStyleManager.cacheMasterBodyProperties(phType, bodyPr);
      } else {
        PlaceHolderTextStyleManager.
          cacheLayoutBodyProperties(phType, phIndex, bodyPr);
      }
    };

    /**
     * Handles the decoration of place-holder with text styles.
     *
     * @param phType {String} place-holder type
     * @param phIndex {String} place-holder index
     * @param textStyles {Object} place-holder text styles JSON from DCP
     */
    var _handleTextStyles = function(phType, phIndex, textStyles) {
      if (textStyles) {
        if (PointModel.currentPHLevel === 'sldmt') {
          PlaceHolderTextStyleManager.cacheMasterListStyle(phType, textStyles);
        } else {
          PlaceHolderTextStyleManager.
            cacheLayoutTextStyle(phType, phIndex, textStyles);
        }
      }
    };

    /**
     * Creates placeholder text body node, which is similar to shape text body;
     * and caches it in point model.
     * @param {String} phType place-holder type
     * @param {String} phIndex place-holder index
     * @private
     */
    var _createPlaceholderTextBody = function(phType, phIndex) {
      // Create the placeholder text body node for point editor. This node
      // has to be similar to shape text body node
      if (Features.isEnabled('edit') && Features.isEnabled('pointEdit')) {
        var placeholderTextBodyDiv = ShapeTextBodyHandler.
            createShapeTextBodyDiv();
        placeholderTextBodyDiv.classList.add('placeholder-text-body');

        // Set z-index to bring the placeholder text body node appear on top of
        // the actual text body node. Since, shape text body div has hardcoded
        // z-index as 2, setting z-index 3 for placeholder text body.
        placeholderTextBodyDiv.style.zIndex = '3';

        var placeholderKey = phType + '_' + phIndex;
        PointModel.
            placeholderTextBody[placeholderKey] = placeholderTextBodyDiv;
      }
    };

    var _api = {
      /*
       * DCP Type Code
       * This is used by the DCP Manager to register this Handler
       */
      etp: 'phTxBody',

      /**
       * Handles DCP response for a Place-Holder text body.
       * @param v {DCP} place-holder DCP JSON
       */
      visit: function(v) {
        // console.log("Inside Place Holder Text Body handler - visit");
        var phTextBodyObject = (v && v.el) || undefined;
        var phType = PointModel.CurrentPlaceHolderAtLayouts.phTyp;
        var phIndex = PointModel.CurrentPlaceHolderAtLayouts.phIdx;

        //we don't want to render default text from placeHolder on slide, to
        // handle this we make below variable as false, and textParagraphHandler
        // doesn't process default text.
        PointModel.isExplicitTextBody = false;

        if (phTextBodyObject && phTextBodyObject.etp &&
          (phTextBodyObject.etp === _api.etp)) {
          _handleBodyProperties(phType, phIndex, phTextBodyObject.bodyPr);
          _handleTextStyles(phType, phIndex, phTextBodyObject.txStl);
          _createPlaceholderTextBody(phType, phIndex);
        }

        PlaceHolderManager.resetCurrentPlaceHolderForLayouts();
      }
    };

    return _api;
  });
