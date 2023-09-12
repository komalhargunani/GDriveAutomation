/**
 * @fileOverview Module to decorate elements with office style information.
 * Also responsible for providing APIs to retrieve the CSS style specific
 * className that are applied to the decorated HTML element.
 *
 * @author dskelton@google.com (Duncan Skelton)
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/utils/typeUtils'
], function(
    TypeUtils) {

  'use strict';

  var StyleDecorator = {

    /**
     * Apply a specified office style to an element.
     * The properties parameter is expected to have a valid document style id.
     * The HTML element is decorated with the appropriate style specific
     * className for a given document style id.
     * Note the style decorator only works with style id not style name.
     * The decorator will replace any existing style that may be set.
     * Passing an empty style id has no effect and leaves the element unchanged.
     * @param {HTMLElement} elm The HTML element to decorate.
     * @param {Object} properties formatting properties to be applied.
     * @param {string} properties.stl style id to be applied to elm.
     * @see /pronto/src/dcp/schemas/model/properties/word/
     *       paragraph_properties.json
     * @see /pronto/src/dcp/schemas/model/properties/word/
     *       character_run_properties.json
     * @public
     */
    decorate: function(elm, properties) {
      properties = properties || {};
      var styleId = properties.stl;
      if (elm && elm.classList && styleId) {
        _removeStyleClass(elm);
        _setStyleClass(elm, styleId);
      }
    },

    /**
     * Remove style specific className from an element.
     * If opt_properties (optional) list of properties is passed
     * the method removes the style className
     * if there is an entry of 'stl' in the list.
     * @param elm {HTML Element} The element to remove the style from.
     * @param opt_properties {array} (optional) array of properties having 'stl'
     * @public
     */
    undecorate: function(elm, opt_properties) {
      var removeStyle = !opt_properties ? true :
          opt_properties.indexOf('stl') !== -1;
      if (removeStyle) {
        _removeStyleClass(elm);
      }
    },

    /**
     * Retrieve the style specific className from element
     * or className string.
     * Example 1:
     * Input: node: HTML Element which has a className 'qowt-stl-Normal'.
     * Output: 'qowt-stl-Normal'
     * Example 2:
     * Input string className: 'blah qowt-stl-Normal blahhhblahh'
     * Output: 'qowt-stl-Normal'
     * @param {string|HTML Element} fromHere If string check for the className,
     *                                       if node check the node's className.
     * @returns {string|undefined} The style specific className.
     * @public
     */
    getStyleClassName: function(fromHere) {
      var styleClassName;
      if (!TypeUtils.isString(fromHere)) {
        fromHere = (fromHere && fromHere.className) ? fromHere.className : '';
      }
      styleClassName = _getStyleClass(fromHere);
      return styleClassName;
    },

    /**
     * Retrieve the office style id from an element or className string.
     * Example 1:
     * Input: node: HTML Element which has a className 'qowt-stl-Normal'.
     * Output: 'Normal'
     * Example 2:
     * Input string className: 'blah qowt-stl-Normal blahhhblahh'
     * Output: 'Normal'
     * @param {string|HTML Element} fromHere If string check for the className,
     *                                       if node check the nodes className.
     * @returns {string|undefined} The office style id.
     * @see getStyleClassName.
     * @public
     */
    getStyleId: function(fromHere) {
      var styleClassName = StyleDecorator.getStyleClassName(fromHere);
      var styleId = _getStyleId(styleClassName);
      return styleId;
    },

    /**
     * Format the className to be applied for a given office style id. For any
     * styleIds passed in with a space, a substitution must be made in place of
     * the space. This is a rare but necessary fix because if there is a space
     * in the className, two classes will be created.
     * Example 1:
     * Input styleId: 'Normal'
     * Output: 'qowt-stl-Normal'
     * Example 2:
     * Input styleId: 'Heading 1'
     * Output: 'qowt-stl-Heading#space#1'
     *
     * @param {string} styleId The office style unique identifier.
     * @return className string.
     * @public
     */
    formatClassName: function(styleId) {
      var className = _kStylePrefix + styleId;
      return className.split(' ').join(_kSpacePlaceholder);
    }
  };

  // ----------------- PRIVATE --------------------

  /**
   * Office Style specific className prefix.
   * className applied: _kStylePrefix + styleId
   * @private
   */
  var _kStylePrefix = 'qowt-stl-';

  /**
   * Placeholder for spaces in class names.
   * @private
   */
  var _kSpacePlaceholder = '#space#';

  /**
   * Get the style specific className from a className string.
   * Input className: 'blah qowt-stl-Normal blahhhblahh'
   * Output 'qowt-stl-Normal'
   *
   * @param {string} className A className string.
   * @return {string} The currently applied style class name.
   * @private
   */
  function _getStyleClass(className) {
    var foundClass;
    if (className) {
      // regex to get qowt-stl-styleId from className.
      var matches = className.match(/\bqowt-stl-\S*/);
      foundClass = matches ? matches[0] : undefined;
    }
    return foundClass;
  }

  /**
   * Get the office style id from a style specific className. If there was a
   * space in the className, it is returned to being a space instead of the
   * placeholder that was input during the formatClassName function.
   * Example 1:
   * Input styleClassName: 'qowt-stl-Heading1'
   * Output 'Heading1'
   * Example 2:
   * Input styleClassName: 'qowt-stl-Heading#space#1'
   * Output 'Heading 1'
   *
   * @param {string|undefined} styleClassName the style related className
   *                                          string.
   * @return {string|undefined} The currently applied office style id.
   * @private
   */
  function _getStyleId(styleClassName) {
    var id;
    if (styleClassName) {
      id = styleClassName.substr(_kStylePrefix.length)
                         .split(_kSpacePlaceholder)
                         .join(' ');
    }
    return id;
  }

  /**
   * Apply the style specific className to the given element,
   * for a given office style id.
   * @param {Element} elm The HTML element to set style class on.
   * @param {string} styleId The office style id to set on elm.
   * @private
   */
  function _setStyleClass(elm, styleId) {
    var className = StyleDecorator.formatClassName(styleId);
    if (className) {
      elm.classList.add(className);
    }
  }

  /**
   * Remove the current style className from the given element.
   * @param {Element} elm The HTML element to remove the style className from.
   * @private
   */
  function _removeStyleClass(elm) {
    var styleClassName = StyleDecorator.getStyleClassName(elm);
    if (styleClassName) {
      elm.classList.remove(styleClassName);
    }
  }

  return StyleDecorator;
});
