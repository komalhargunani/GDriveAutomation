
define([
  'qowtRoot/utils/typeUtils',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError'
], function(TypeUtils,
            ErrorCatcher,
            QowtSilentError) {

  'use strict';

  /**
   * Creates a color instance with red, green and blue channel values.
   *
   * @param {string | undefined} colorString  Color instance can be created by
   *     sending in a color string in this format - "rgba(<R>, <G>, <B>, <A>)".
   *     It parses and creates an instance initialized with corresponding
   *     values.
   *
   *     If no color string is passed, empty color instance is created with null
   *     color channel values.
   *
   *  @constructor
   */
  var Color = function(colorString) {
    this.R = this.G = this.B = null;

    if (testRGBAColorStringFormat_(colorString)) {
      var color = rgbaColorToRGBForm_(colorString);
      this.R = color.R;
      this.G = color.G;
      this.B = color.B;
    } else if (colorString) {
      ErrorCatcher.handleError(new QowtSilentError('Color: Passed color ' +
          'string is not in a valid format. Not setting the colors.'));
    }
  };

  /**
   * Checks if this instance has empty color channel values.
   *
   * @return {boolean}  True if any channel is null or undefined.
   * False otherwise.
   */
  Color.prototype.isEmpty = function() {
    return this.R === null || this.G === null || this.B === null;
  };

  // -------------------- PRIVATE ----------------------
  var RGBA_COLOR_STRING_FORMAT = new RegExp(
      'rgba\\(([\\d]+,[\\s]*){3}[\\.\\d]+\\)');

  /**
   * Parses color string to an object with RGB values. Skips the alpha value.
   *
   * @param {string} colorString  Color string to parse (specified in
   *     'rgba(<R>, <G>, <B>, <A>)' format)
   * @return {{R: <number>, G: <number>, B: <number>}}
   *
   * @private
   */
  var rgbaColorToRGBForm_ = function(colorString) {
    var temp = colorString.substring(colorString.indexOf('(') + 1,
        colorString.indexOf(')'));
    temp = temp.split(/,\s*/);

    // For performance reasons, we need to always maintain channel values in
    // number form as against equivalent string form.
    // Using the '+' trick to achieve the same
    return {
      R: +temp[0],
      G: +temp[1],
      B: +temp[2]
    };
  };

  /**
   * Checks if supplied color string is in "rgba(<R>, <G>, <B>, <A>)" format
   *
   * @param {string} colorString  Color string to test
   * @return {boolean} True if string id in the  mentioned format. Otherwise
   * false.
   *
   * @private
   */
  var testRGBAColorStringFormat_ = function(colorString) {
    return colorString && TypeUtils.isString(colorString) &&
        colorString.search(RGBA_COLOR_STRING_FORMAT) !== -1;
  };

  return Color;
});
