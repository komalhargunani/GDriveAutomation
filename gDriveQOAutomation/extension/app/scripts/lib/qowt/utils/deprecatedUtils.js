/**
 * @fileoverview
 * Deprecated utility functions.
 * TODO remove this
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/models/env',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/errors/errorCatcher'], function(
  EnvModel,
  TypeUtils,
  QOWTSilentError,
  ErrorCatcher) {

  'use strict';

  var api_ = {
    // DEPS
    // utils/domUtils.js
    NodeType: {
      ELEMENT_NODE: 1,
      ATTRIBUTE_NODE: 2,
      TEXT_NODE: 3,
      CDATA_SECTION_NODE: 4,
      ENTITY_REFERENCE_NODE: 5,
      ENTITY_NODE: 6,
      PROCESSING_INSTRUCTION_NODE: 7,
      COMMENT_NODE: 8,
      DOCUMENT_NODE: 9,
      DOCUMENT_TYPE_NODE: 10,
      DOCUMENT_FRAGMENT_NODE: 11,
      NOTATION_NODE: 12,
      1: 'ELEMENT_NODE',
      2: 'ATTRIBUTE_NODE',
      3: 'TEXT_NODE',
      4: 'CDATA_SECTION_NODE',
      5: 'ENTITY_REFERENCE_NODE',
      6: 'ENTITY_NODE',
      7: 'PROCESSING_INSTRUCTION_NODE',
      8: 'COMMENT_NODE',
      9: 'DOCUMENT_NODE',
      10: 'DOCUMENT_TYPE_NODE',
      11: 'DOCUMENT_FRAGMENT_NODE',
      12: 'NOTATION_NODE'
    }
  };

  /**
   * Regular Expressions
   * Define here any regular expressions used in QOWT
   */
  api_.RegExp = {
    /**
     * Match a colour string in 6 Hexadecimal format with optional starting hash
     * @captures {Integer} red
     * @captures {Integer} green
     * @captures {Integer} blue
     */
    // DEPS
    // drawing/color/colorUtility.js
    'HEX': /^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/gi,
    /**
     * Match a colour string in 3 Hexadecimal format with optional starting hash
     * @captures {Integer} red
     * @captures {Integer} green
     * @captures {Integer} blue
     */
    // DEPS
    // drawing/color/colorUtility.js
    'HEX3': /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/gi
  };

  /**
   * Utilise a regular expression
   * This wraps an execution and reset into one function
   * @param pat {Regular Expression} the regular expression to use
   * @param str {String} the string to execute on
   * @return {Array} of matched results or undefined if no match
   */
  // DEPS
  // drawing/color/colorUtility.js
  api_.regExpExec = function(pat, str) {
    var result;
    if (TypeUtils.isRegex(pat) && TypeUtils.isString(str)) {
      var regexpOutput = pat.exec(str);
      if (regexpOutput && regexpOutput.length) {
        result = regexpOutput;
      }
      pat.lastIndex = 0;
    }
    return result;
  };

  /**
   * Parses the given argument into a boolean
   * @param arg to be parsed.
   */
  // DEPS
  // drawing/geometry/canvasPathExecutor.js
  api_.parseBoolean = function(arg) {
    if ("false" === arg ||
        "False" === arg ||
        false === arg ||
        0 === arg) {
      return false;
    }
    return true;
  };

  /**
   * computes percent value of the number
   * @param percentage
   * @param number
   */
  // DEPS
  // widgets/image/image.js
  api_.computePercentValueOf = function(percentage, number) {
    return (percentage * number) / 100;
  };

  /*
   * utility stripping node, if used on ref element,
   * it will append at location of ref all its elements
   * and remove ref after all.
   */
   // JELTE TODO: wtf is this doing?
  // DEPS
  // dcp/decorators/baseListItemDecorator.js
  api_.stripNode = function(ref) {
    var children = api_.cpArray(ref.childNodes);
    var parent = ref.parentNode;
    for (var i = 0; i < children.length; i++) {
      Polymer.dom(parent).insertBefore(children[i], ref);
      Polymer.dom(parent).flush();
    }
    Polymer.dom(parent).removeChild(ref);
    Polymer.dom(parent).flush();
  };
  api_.cpArray = function(from) {
    var newArray = [];
    for (var i = 0; i < from.length; i++) {
      newArray[newArray.length] = from[i];
    }
    return newArray;
  };

  /**
   * clones the already rendered layout div for the new slides, and attaches
   * that to the slide root-element
   * @param divToClone {DOM} already rendered layout div
   * @param rootElementToAttach {DOM} root-element to which the cloned div is
   *                                  attached
   * @param clonedDivId {String} new id to be assigned to the cloned div
   * @return {DOM} cloned div
   */
  // DEPS:
  // commands/quickpoint/getMasterLayout.js
  // commands/quickpoint/getSlideLayout.js
  // presentation/slideChartsManager.js
  // presentation/slideCloneManager.js
  // test/qowt/commands/quickpoint/getMasterLayout-test.js
  // unittests/commands/quickpoint/getSlideLayout-test.js
  // unittests/dcp/pointHandlers/slideLayoutHandler-test.js
  // unittests/presentation/slideChartsManager-test.js
  // unittests/presentation/slideCloneManager-test.js
  api_.cloneAndAttach = function(divToClone, rootElementToAttach, clonedDivId) {
    var duplicateDiv = api_.cloneDiv(divToClone, clonedDivId);
    api_.copyAllContainedCanvases(divToClone, duplicateDiv);
    Polymer.dom(rootElementToAttach).appendChild(duplicateDiv);
    Polymer.dom(rootElementToAttach).flush();
    return duplicateDiv;
  };
  api_.cloneDiv = function(sourceDiv, cloneDivId) {
    function doClone(node) {
      var dup = node.cloneMe ? node.cloneMe() : node.cloneNode(false);

      // Removing old class qowt-point-para-[Digit] from the cloned element,
      // to resolve the bullet's styling issue.
      if (dup.is === 'qowt-point-para') {
        dup.className = dup.className.replace(/[\s]qowt-point-para-[\d]+/,
           '');
      }

      // cloneMe removes the id; but for backward compatibility in point
      // we want the cloned div to have the same eid (including in its model)
      if (dup.setEid) {
        dup.setEid(node.getEid());
      }
      return dup;
    }
    var dup = doClone(sourceDiv);
    for (var i = 0; i < sourceDiv.childNodes.length; i++) {
      var child = sourceDiv.childNodes[i];
      // Do not clone shape handler divs as those are not needed for thumbnail.
      if (!(child.getAttribute && child.getAttribute('qowt-divtype') ===
          'handlers')) {
        var childDup = api_.cloneDiv(child);
        dup.appendChild(childDup);
      }
    }
    if (cloneDivId) {
      dup.id = cloneDivId;
    }
    return dup;
  };

  /**
   * Copy canvas contents for all canvases from source DIV to target DIV.
   * Copying contents is achieved though getting image from source canvas and
   * putting it to target one.
   * @param sourceDiv the source DIV
   * @param targetDiv the target DIV
   */
  // DEPS
  // widgets/point/overlay.js
  // widgets/point/thumbnailStrip.js
  api_.copyAllContainedCanvases = function(sourceDiv, targetDiv) {
    var oriCanvases = sourceDiv.querySelectorAll('canvas');
    var dupCanvases = targetDiv.querySelectorAll('canvas');
    for (var i = 0; i < oriCanvases.length; i++) {
      if ((oriCanvases[i] !== undefined) && (dupCanvases[i] !== undefined)) {
        var oriCanvasContext = oriCanvases[i].getContext('2d');
        var dupCanvasContext = dupCanvases[i].getContext('2d');
        api_.cloneCanvasImage(oriCanvasContext, dupCanvasContext);
      }
    }
  };

  /**
   * clones the canvas via the context image-data
   * @param {HTMLElement} oriCanvasContext - original (or thumb-level) canvas
   *                                          to be cloned
   * @param {HTMLElement} dupCanvasContext - duplicate (or slide-level) canvas
   *                                          to be created from the clone
   */
  // DEPS
  // drawing/geometry/canvasPathExecutor.js
  api_.cloneCanvasImage = function(oriCanvasContext, dupCanvasContext) {
    /*
     * From observation (no concrete explaination) if we are having width/height
     * zero for canvas and we are trying to invoke getImageData function on its
     * context then its throwing exception.
     * Hence below check for canvas width / height
     */
    if (oriCanvasContext.canvas.width > 0 &&
        oriCanvasContext.canvas.height > 0) {
      var oriImageData = oriCanvasContext.getImageData(0, 0,
          oriCanvasContext.canvas.width, oriCanvasContext.canvas.height);
      // The getImageData() API returns null when original canvas is too big
      // and/or system memory is not enough to store raw image data.
      if (oriImageData) {
        dupCanvasContext.putImageData(oriImageData, 0, 0);
      } else {
        var silentError = new QOWTSilentError('Failed to execute putImageData' +
            ' on CanvasRenderingContext2D.');
        ErrorCatcher.handleError(silentError);
      }
    }
  };

  /**
   * Converts the style object into css string.
   * @param styleObj {Object} style JSON object
   * @return {String} returns the css string
   */
  // DEPS
  // dcp/decorators/outlineDecorator.js
  // dcp/decorators/placeHolderDecorator.js
  // dcp/decorators/pointTextDecorator.js
  // dcp/pointHandlers/common/blipFillHandler.js
  // dcp/pointHandlers/common/fillHandler.js
  // dcp/pointHandlers/common/gradientFillHandler.js
  // dcp/pointHandlers/common/solidFillHandler.js
  // drawing/theme/themeEffectStyleManager.js
  // unittests/dcp/decorators/pointTextDecorator-test.js
  // unittests/dcp/decorators/pointTextDecoratorForTable-test.js
  // unittests/dcp/pointHandlers/common/fillHandler-test.js
  api_.getElementStyleString = function(styleObj) {
    var styleText = '';
    for (var key in styleObj) {
      styleText += ( key + ':' + styleObj[key] + ';' );
    }
    return styleText;
  };

  /**
   *append JSON attributes to target object
   * @param targetObj
   * @param jsonObj
   */
  // TODO (dtilley) This func duplicated in objectUtils?
  // DEPS
  // dcp/decorators/groupShapeDecorator.js
  // dcp/decorators/shapeDecorator.js
  // dcp/pointHandlers/pointTableHandler.js
  // dcp/pointHandlers/rectangularShapePropertiesHandler.js
  // dcp/pointHandlers/shapeHandler.js
  // drawing/geometry/geometryManager.js
  // unittests/dcp/decorators/shapeDecorator-test.js
  // unittests/dcp/pointHandlers/rectangularShapePropertiesHandler-test.js
  // unittests/presentation/layoutsManager-test.js
  api_.appendJSONAttributes = function(targetObj, jsonObj) {
    for (var item in jsonObj) {
      targetObj[item] = jsonObj[item];
    }
  };

  /**
   * bullet character width measure element
   */
  // DEPS
  // commands/quickpoint/openPresentation.js
  // dcp/decorators/pointBulletDecorator.js
  // unittests/dcp/decorators/pointBulletDecorator-test.js
  api_.bulletTextMeasureElement = undefined;

  /**
   * sets the bullet character width measure element
   */
  // DEPS
  // commands/quickpoint/openPresentation.js
  // unittests/dcp/decorators/pointBulletDecorator-test.js
  api_.setBulletTextMeasureElement = function() {
    api_.bulletTextMeasureElement = {};
    api_.bulletTextMeasureElement._bulletTextMeasureElement =
      document.createElement('P');
    api_.bulletTextMeasureElement._bulletTextMeasureElement.className =
      "bulletTextMeasureCss";
    api_.bulletTextMeasureElement._bulletTextMeasureElement.style.position =
      "absolute";
    api_.bulletTextMeasureElement._bulletTextMeasureElement.style.visibility =
      "hidden";
    api_.bulletTextMeasureElement._bulletTextMeasureElement.height =
      "auto";
    api_.bulletTextMeasureElement._bulletTextMeasureElement.width =
      "auto";
    api_.bulletTextMeasureElement._bulletTextMeasureElement_Style =
      document.createElement('style');
    api_.bulletTextMeasureElement._bulletTextMeasureElement_Style.type =
      'text/css';
    document.getElementsByTagName('head')[0].
      appendChild(api_.bulletTextMeasureElement.
        _bulletTextMeasureElement_Style);
    EnvModel.rootNode.
      appendChild(api_.bulletTextMeasureElement._bulletTextMeasureElement);
  };

  // DEPS
  // dcp/decorators/baseListItemDecorator.js
  api_.setNumberTextMeasureElement = function () {
    api_.numberTextMeasureElement = {};
    api_.numberTextMeasureElement._numberTextMeasureElement =
      document.createElement('P');
    api_.numberTextMeasureElement._numberTextMeasureElement.className =
      "numberTextMeasureCss";
    api_.numberTextMeasureElement._numberTextMeasureElement.style.position =
      "absolute";
    api_.numberTextMeasureElement._numberTextMeasureElement.style.
      visibility = "hidden";
    api_.numberTextMeasureElement._numberTextMeasureElement.height = "auto";
    api_.numberTextMeasureElement._numberTextMeasureElement.width = "auto";
    api_.numberTextMeasureElement._numberTextMeasureElement_Style =
      document.createElement('style');
    api_.numberTextMeasureElement._numberTextMeasureElement_Style.type =
      'text/css';
    document.getElementsByTagName('head')[0].appendChild(
      api_.numberTextMeasureElement._numberTextMeasureElement_Style);
    if (EnvModel.rootNodeContainer === undefined ||
      EnvModel.rootNodeContainer === null) {
        EnvModel.rootNodeContainer =
          document.getElementById('qowt-doc-root');
    }
    EnvModel.rootNodeContainer.
      appendChild(api_.numberTextMeasureElement._numberTextMeasureElement);
  };

  /**
   * returns undefined if empty JSON object
   * @param {JSON} propertyJson - Json to check
   */
  // DEPS
  // presentation/placeHolder/defaultTextStyleManager.js
  // presentation/placeHolder/placeHolderPropertiesManager.js
  // presentation/placeHolder/placeHolderTextStyleManager.js
  api_.returnUndefinedIfEmptyJson = function(propertyJson) {
    return _.isEmpty(propertyJson) ? undefined : propertyJson;
  };

  return api_;

});
