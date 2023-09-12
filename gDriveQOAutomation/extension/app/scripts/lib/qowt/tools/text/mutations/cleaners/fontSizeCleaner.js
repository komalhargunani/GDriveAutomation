// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview mutation tool cleaner to remove style="font-size: medium",
 * and convert style="font-size: x px" to style="font-size: y pt", which
 * both seem to be added by drag and drop. Note that medium is the browser's
 * default font size. It is safe to remove style="font-size: medium", because
 * we will never add that to an element ourselves.
 *
 * This is a singleton
 *
 * @author ganetsky@google.com (Jason Ganetsky)
 */

define([
  'qowtRoot/tools/text/mutations/tags',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/models/env'
  ], function(Tags, Converter, EnvModel) {

  'use strict';

  function _cleanFontSize(summary, node) {
    summary = summary || {};

    if (node.style.fontSize) {
      // ignore old legacy type font sizes
      var legacyFontSizes = ['xx-small' , 'x-small', 'small', 'medium', 'large',
          'x-large', 'xx-large'];
      if (legacyFontSizes.indexOf(node.style.fontSize.toLowerCase()) !== -1) {
        node.style.fontSize = '';
      }
      else {
        var cssSize = node.style.fontSize;
        var fontUnit = cssSize.substr(-2);

        if (fontUnit !== EnvModel.fontUnit) {
          // at the moment we only support 'pt' & 'em' for units used in the app
          switch (EnvModel.fontUnit) {
            case 'pt':
              cssSize = Converter.cssSize2pt(cssSize);
              break;
            case 'em':
              cssSize = Converter.cssSize2em(cssSize);
              break;
            default:
              // to be safe, remove the cssSize
              cssSize = undefined;
              break;
          }
          node.style.fontSize = cssSize ? (cssSize + EnvModel.fontUnit) : '';
        }
      }
    }
  }


  return {
    /**
     * The config object used to register this cleaner to the mutation registry.
     */
    cleanerConfig: {
      filterConfig: {
        type: Tags.ADDED | Tags.MOVED | Tags.FORMAT | Tags['ATTRIB-STYLE'],
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['P', 'SPAN']
      },
      callback: _cleanFontSize
    }
  };
});
