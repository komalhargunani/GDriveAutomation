/**
 * @fileoverview
 * Mocha based unit test for the deprecated utility module.
 *
 * @author dtilley@google.com (Dan Tilley)
 * TODO (dtilley) remove this test when the deprecatedUtils module is removed
 */
define([
  'qowtRoot/utils/deprecatedUtils'], function(
  DeprecatedUtils) {

  'use strict';

  describe('Deprecated Utils.', function() {
    it('Should provide NodeType', function() {
      assert.isObject(
        DeprecatedUtils.NodeType,
        'has NodeType object');
    });
    it('Should return percent value', function() {
      assert.strictEqual(
        DeprecatedUtils.computePercentValueOf('10', '250'),
        25,
        '10 of 250 is 25%');
    });
    describe('PlaceHolders.', function() {
      it('Should return empty string for null style', function() {
        assert.strictEqual(
          DeprecatedUtils.getElementStyleString(undefined),
          '',
          'style string for undefined');
      });
      it('Should return css string for a style object', function() {
        var styleObj = {
          'font-weight': 'bold',
          'font-style': 'italic',
          'text-decoration': 'underline line-through',
          'line-height': '120',
          'opacity': '0.7',
          'font-variant': 'small-caps',
          'text-transform': 'uppercase',
          'vertical-align': '40%',
          'font-size': '20px'
        };
        var styleStr = 'font-weight:bold;' +
                       'font-style:italic;' +
                       'text-decoration:underline line-through;' +
                       'line-height:120;' +
                       'opacity:0.7;' +
                       'font-variant:small-caps;' +
                       'text-transform:uppercase;' +
                       'vertical-align:40%;' +
                       'font-size:20px;';
        assert.strictEqual(
          DeprecatedUtils.getElementStyleString(styleObj),
          styleStr,
          'style string for style object');
      });
    });
  });
});
