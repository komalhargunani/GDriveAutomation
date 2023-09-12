// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview wrapper around chrome metricsPrivate module
 *
 * BIG WARNING!!! DO NOT CHANGE ANY OF THIS MODULE WITHOUT CHANGING
 * THE EQUIVALENT src/tools/histograms/histograms.xml IN CHROME-INTERNAL
 * IN OTHER WORDS DO NOT TOUCH THIS UNLESS YOU KNOW WHAT YOU ARE DOING!
 *
 * @author jelte@google.com (Jelte Liebrand)
 *         dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/features/utils',
  'qowtRoot/utils/typeUtils'
  ], function(
    Features,
    TypeUtils) {

  'use strict';

  // constants
  var _kUMAId = 'Quickoffice',
      _kFileFormatHistogram = 'FileFormat';

  var _api = {

    recordFileType: function(fileExtension) {
      if (fileExtension) {
        _ext = fileExtension.toLowerCase();
        _recordEnum(_kFileFormatHistogram, _ext, _validFormats);
      }
    },

    /**
     * General utility to record data point values per file type.
     *
     * @param {Object} context Contextual data.
     * @param {String} context.dataPoint The name of a predefined data point.
     * @param {Integer} context.value The value for the specified data point.
     */
    recordCount: function(context) {
      context = context || {};
      var label = context.dataPoint || '',
          count = context.value || 0;

      _recordCount(_ext + label, count, _validDataPoints);
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvv
  var _ext;

  // BIG WARNING!!! DO NOT CHANGE THIS (NOT EVEN THE ORDER!) WITHOUT CHANGING
  // THE EQUIVALENT src/tools/metrics/histograms/histograms.xml
  // IN CHROME-INTERNAL.
  // IN OTHER WORDS DO NOT TOUCH THIS UNLESS YOU KNOW WHAT YOU ARE DOING!
  var _validFormats = [
        "doc",
        "docx",
        "docm",
        "xls",
        "xlsx",
        "xlsm",
        "ppt",
        "pptx",
        "pptm",
        "pps",
        "ppsx",
        "ppsm",
        "csv"];

  // These are the names of predefined histograms in chromium source.
  // Do not alter these strings - they must match what is defined in chromium.
  // See chromium/src/tools/metrics/histograms/histograms.xml
  var _validDataPoints = [
    'csvNonEmptyCellCount',
    'csvSheetCount',
    'csvFormattedCellCount',
    'docPageCount',
    'docSectionCount',
    'docParagraphCount',
    'docxPageCount',
    'docxSectionCount',
    'docxParagraphCount',
    'pptSlideCount',
    'pptMasterCount',
    'pptxSlideCount',
    'pptxMasterCount',
    'xlsNonEmptyCellCount',
    'xlsSheetCount',
    'xlsFormattedCellCount',
    'xlsxNonEmptyCellCount',
    'xlsxSheetCount',
    'xlsxFormattedCellCount'];

  /**
   * Record an enum value.
   *
   * @param {string} name Metric name.
   * @param {Object} value Enum value.
   * @param {Array.<Object>|number} validValues Array of valid values
   *                                            or a boundary number value.
   */
  function _recordEnum(name, value, validValues) {
    if(chrome && chrome.metricsPrivate && chrome.metricsPrivate.recordValue) {

      var boundaryValue;
      var index;
      if(validValues.constructor.name === 'Array') {
        index = validValues.indexOf(value);
        boundaryValue = validValues.length;
      } else {
        index = value;
        boundaryValue = validValues;
      }

      // ignore values that are not valid
      if(index < 0 || index > boundaryValue) {
        console.warn('Ignoring metrics record for unknown value: ' + value);
      } else {
        // Setting min to 1 looks strange but this is exactly the recommended
        // way of using histograms for enum-like types. Bucket #0 works as a
        // regular bucket AND the underflow bucket.
        // (Source: UMA_HISTOGRAM_ENUMERATION definition
        // in base/metrics/histogram.h)
        var metricDescr = {
          'metricName': _kUMAId + '.' + name,
          'type': 'histogram-linear',
          'min': 1,
          'max': boundaryValue,
          'buckets': boundaryValue + 1
        };

        // We support ineraction tests for UMA in debug mode. The E2E framework
        // mocks out the chrome metrics API. Checking explicitly for this mock
        // here allows us to record UMA data in that setup. Its not ideal  to
        // have knowledge of the mock here but it gets the job done.
        if (Features.isDebug() && window.__umaMock === undefined) {
          console.log('UMA not supported in debug mode');
        } else {
          chrome.metricsPrivate.recordValue(metricDescr, index);
        }
      }
    }
  }

  /**
   * Records a count against a given data point.
   *
   * @param {String} dataPoint The data point we are recording a value for.
   * @param {Integer} value The count to record aginst the data point.
   * @param {Array} validNames A list of the support data points.
   */
  function _recordCount(dataPoint, value, validNames) {
    if (!TypeUtils.isString(name) || !TypeUtils.isNumber(value) ||
        !TypeUtils.isList(validNames)) {
      console.warn('Metrics cannot record count - invalid parameters');
      return;
    }

    if (!_isValid(dataPoint, validNames)) {
      console.warn('Ignoring unknown metrics record ' + dataPoint +
          ' with value: ' + value);
    } else {
      if (!Features.isDebug() &&
          chrome && chrome.metricsPrivate && chrome.metricsPrivate) {
        var metricName = _kUMAId + '.' + dataPoint;
        switch(dataPoint) {
          case 'docPageCount':
          case 'docxPageCount':
            if (chrome.metricsPrivate.recordValue) {
              // 50 buckets is the default for count histograms; matching this.
              var histogram = {
                'metricName': metricName,
                'type': 'histogram-log',
                'min': 1,
                'max': 1000,
                'buckets': 50
              };
              chrome.metricsPrivate.recordValue(histogram, value);
            }
            break;
          case 'docParagraphCount':
          case 'docxParagraphCount':
            // Records counts in the range of 0 to 10,000 in 50 buckets.
            if (chrome.metricsPrivate.recordMediumCount) {
              chrome.metricsPrivate.recordMediumCount(metricName, value);
            }
            break;
          case 'csvSheetCount':
          case 'docSectionCount':
          case 'docxSectionCount':
          case 'xlsSheetCount':
          case 'xlsxSheetCount':
          case 'pptSlideCount':
          case 'pptxSlideCount':
          case 'pptMasterCount':
          case 'pptxMasterCount':
            // Records counts in the range of 0 to 100 in 50 buckets.
            if (chrome.metricsPrivate.recordSmallCount) {
              chrome.metricsPrivate.recordSmallCount(metricName, value);
            }
            break;
          case 'csvNonEmptyCellCount':
          case 'xlsNonEmptyCellCount':
          case 'xlsxNonEmptyCellCount':
          case 'csvFormattedCellCount':
          case 'xlsFormattedCellCount':
          case 'xlsxFormattedCellCount':
            // Records counts in the range of 0 to 1,000,000 in 50 buckets.
            if (chrome.metricsPrivate.recordCount) {
              chrome.metricsPrivate.recordCount(metricName, value);
            }
            break;
          default:
            console.warn('Record count ignored unknown metric ' + metricName);
            break;
        }
      }
    }
  }

  /**
   * Qurey if value is valid according to validValues.
   *
   * @param {Object} value Enum value.
   * @param {Array.<Object>|number} validValues Array of valid values
   *                                            or a boundary number value.
   */
  function _isValid(value, validValues) {
    var boundaryValue, index;
    if (TypeUtils.isList(validValues)) {
      index = validValues.indexOf(value);
      boundaryValue = validValues.length;
    } else {
      index = value;
      boundaryValue = validValues;
    }
    return index >= 0 && index <= boundaryValue;
  }

  return _api;
});
