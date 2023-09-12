/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Responsible for resolving the style inheritance hierarchy.
 *
 * A style may inherit from another style of the same type
 * (paragraph, character etc.). The style inheritance is defined via
 * the basedOn element, which specifies the styleId of the parent style.
 * This means that the style inherit all the properties from the parent style,
 * and those properties can be overridden.
 *
 * In order to compile the complete set of paragraph and character properties
 * specified by any given style, the rule of style inheritance
 * is followed to determine each property in that set.
 * Style inheritance states that styles of any given style type can inherit
 * from other styles of that style type, and therefore the style information
 * is built up by following the inheritance tree (roll up all styles in the
 * style chain).
 *
 * Example:
 * Normal Style (Font: Arial, Size: 12) {font: “Arial”, siz: 12}
 * Style 1 (Based on Normal, Size: 16, bold: on) {siz: 16, bold: on}
 * Resolved/Flattened Style 1 {font: “Arial”, siz: 16, bold: on}
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([], function() {

  'use strict';

  var StyleResolver = {

    /**
     * Resolves the style formatting properties.
     * Flattens the style formatting properties by tracing the
     * style inheritance tree.
     * The style object is modified such that a new object called
     * resolved is added with all the resolved character run properties(rpr)
     * and paragraph properties (ppr).
     *
     * @param {object} style style object being resolved.
     * @param {string} style.id The style unique identifier.
     * @param {string} style.type The type of this style
     *                            (like: char, par, table..).
     * @param {string} style.name The style name used for display.
     * @param {string} style.basedOn The id of the style (if any) that this
     *                               style inherits from. (could be empty)
     * @param {boolean} style.isDefault True if it is the default style.
     * @param {object|undefined} style.rpr character run properties.
     * @param {object|undefined} style.ppr paragraph properties.
     * @public
     */
    resolve: function(style) {
      if (!style) {
        throw new Error(
            'styleResolver.resolve() could not resolve invalid style');
      }
      var resolvedRunProperties = {}, resolvedParagraphProperties = {};
      _officeStyles = document.querySelector('[is="qowt-office-styles"]');
      _resolveRunProperties(style, resolvedRunProperties);
      _resolveParagraphProperties(style, resolvedParagraphProperties);
      style.resolved = {rpr: resolvedRunProperties,
                        ppr: resolvedParagraphProperties};
    }
  };

  var _officeStyles;

  // --------------------------- PRIVATE ----------------------------

  /**
   * Resolves the character run properties for the given style object.
   * Walks up the style inheritance tree and resolves the character run
   * properties of the style object and populates the
   * passed in resolvedRunProperties.
   *
   * @param style style object to be resolved.
   * @param resolvedRunProperties character run properties to be resolved.
   * @private
   */
  function _resolveRunProperties(style, resolvedRunProperties) {
    if (!style || !resolvedRunProperties) {
      return;
    }

    if (style.rpr) {
      _resolveProperties(style.rpr, resolvedRunProperties);
    }
    if (style.basedOn) {
      var parentStyle = _officeStyles.getStyle(style.basedOn);
      if (parentStyle) {
        _resolveRunProperties(parentStyle, resolvedRunProperties);
      }
    }
  }

  /**
   * Resolves the paragraph properties for the given style object.
   * Walks up the style inheritance tree and resolves the paragraph
   * properties for the style object and populates the
   * passed in resolvedParagraphProperties.
   *
   * @param style style object to be resolved.
   * @param resolvedParagraphProperties paragraph properties to be resolved.
   * @private
   */
  function _resolveParagraphProperties(style, resolvedParagraphProperties) {
    if (!style || !resolvedParagraphProperties) {
      return;
    }

    if (style.ppr) {
      _resolveProperties(style.ppr, resolvedParagraphProperties);
    }
    if (style.basedOn) {
      var parentStyle = _officeStyles.getStyle(style.basedOn);
      if (parentStyle) {
        _resolveParagraphProperties(parentStyle, resolvedParagraphProperties);
      }
    }
  }

  /**
   * Takes the passed in inputProperties and resolves the resolvedProperties.
   * This means if a property does exists in inputProperties and does not
   * exist in resolvedProperties, the property is added to the
   * resolvedProperties.
   *
   * @param inputProperties input properties.
   * @param resolvedProperties output properties to be resolved.
   * @private
   */
  function _resolveProperties(inputProperties, resolvedProperties) {
    resolvedProperties = resolvedProperties || {};
    if (inputProperties) {
      for (var property in inputProperties) {
        if (!(property in resolvedProperties)) {
          resolvedProperties[property] = inputProperties[property];
        }
      }
    }
  }

  return StyleResolver;
});
