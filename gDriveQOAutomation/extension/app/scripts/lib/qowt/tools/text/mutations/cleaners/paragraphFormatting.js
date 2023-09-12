/**
 * @fileoverview
 * Mutation tool cleaner to reinstate text styles that have been
 * removed from paragraphs.
 *
 * Note: This is a temporary solution to ensure the following CrBug
 * http://crbug/387960 does not cause crashes.
 *
 * TODO dtilley Add support to the formatNodes translator for text
 * formatting on paragraphs and then remove this cleaner.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/tools/text/mutations/tags'], function(
  Tags) {

  'use strict';

  // Regular expressions to capture the removed style,
  // should have one capture group for the entire style rule.
  var stylesToReinstate_ = [
    /(font-size\s?:[^;]+;?)/g
  ];

  function reinstateParagraphFormatting_(summary, node) {
    var newStyle = node.getAttribute('style') || '',
        oldStyle = summary.getOldAttribute(node, 'style') || '';
    stylesToReinstate_.forEach(function(re) {
      if (!match_(re, newStyle)) {
        var matched = match_(re, oldStyle);
        node.setAttribute('style', newStyle + matched);
      }
    });
  }

  function match_(re, str) {
    re.lastIndex = 0;
    var test = re.exec(str);
    return (test && test.length > 1) ? test[1] : '';
  }

  return {
    cleanerConfig: {
      filterConfig: {
        type: Tags['ATTRIB-STYLE'],
        nodeType: Node.ELEMENT_NODE,
        nodeNames: ['P']
      },
      callback: reinstateParagraphFormatting_
    }
  };

});
