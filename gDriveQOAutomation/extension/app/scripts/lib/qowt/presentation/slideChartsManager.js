/**
 * @fileoverview manages charts on thumb-nails and slides.
 *
 * @author devesh.chanchlani@quickoffice.com (Devesh Chanchlani)
 */
define([
  'qowtRoot/utils/charts/chartRenderer',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/variants/configs/point',
  'qowtRoot/models/point'
], function(ChartRenderer, DeprecatedUtils, PointConfig, PointModel) {

  'use strict';

  /**
   * this json map keeps track of all the charts on a slide.
   * The charts again are stored as id-to-div map.
   */
  var _chartIdDivMap = {};

  var _api = {

    /**
     * appends / updates the map of chart-id to graphic-div
     * @param {String} chartId Id of teh chart to render
     * @param {HTMLElement} chartDiv The container where the chart is to be
     *                               rendered
     * @param {HTMLElement} slideNode Node in which chart is rendered
     */
    addToChartIdDivMap: function(chartId, chartDiv, slideNode) {

      // While rendering charts from master and layout, slideNode is not
      // available as it is not created yet. So in this case we use
      // currentSlideEId from PointModel and for editing operations like chart
      // move, we use slideNode.
      // Another reason to use slideNode instead of PointModel.currentSlideEId
      // in case of editing is, currentSlideEId and current slide node id is not
      // always same as currentSlideEId is only set in getSlideInfo command and
      // is not updated after that.

      var slideEid = slideNode ? slideNode.id : PointModel.currentSlideEId;

      if (!_chartIdDivMap[slideEid]) {
        _chartIdDivMap[slideEid] = {};
      }
      _chartIdDivMap[slideEid][chartId] = chartDiv;
    },

    /**
     * renders all the charts in the current slide
     */
    renderThumbnailChart: function() {
      var chartsOnSlide = _chartIdDivMap[PointModel.currentSlideEId];
      for (var chartId in chartsOnSlide) {
        var origChartDiv = chartsOnSlide[chartId];
        var chartParentNode = origChartDiv.parentNode;

        ChartRenderer.render(origChartDiv, chartId);

        DeprecatedUtils.
          cloneAndAttach(origChartDiv, chartParentNode, undefined);
        chartParentNode.removeChild(origChartDiv);
      }
    },

    /**
     * Clones thumbnail charts onto the slide.
     *
     * @param {HTML} slideNode - slide node.
     */
    updateSlideCharts: function(slideNode) {
      var slideEid = _getSlideEidFromNode(slideNode);
      if (!slideEid) {
        return;
      }
      var chartsOnSlide = _chartIdDivMap[slideEid];

      for (var chartId in chartsOnSlide) {
        var origChartDiv = chartsOnSlide[chartId];
        var chartDivId = PointConfig.kTHUMB_ID_PREFIX + origChartDiv.id;
        var slideChartDiv = slideNode.querySelector("[id=" + chartDivId + "]");

        var slideChartParentNode = slideChartDiv.parentNode;
        slideChartParentNode.appendChild(origChartDiv);
        slideChartParentNode.removeChild(slideChartDiv);
      }
    },

    /**
     * Delete entry for slide from the chart-id to graphic-div map
     *
     * @param {Object} slideNode - slide node whose entry is to be deleted.
     */
    deleteSlideEntryFromChartMap: function(slideNode) {
      var slideEid = _getSlideEidFromNode(slideNode);
      delete _chartIdDivMap[slideEid];
    },

    /**
     * Get number of entries in the chart-id to graphic-div map
     * This method has been introduced only for unit tests.
     *
     * @return {Number} Number of entries in the map
     */
    getSlidesContainingChartsCount: function() {
      return Object.keys(_chartIdDivMap).length;
    }
  };

  /**
   * Deduce the eid of slide using slide node
   *
   * @param {Object} slideNode node of slide
   * @return {String | undefined} eid of slide or undefined if slide data not
   *                              available.
   *
   * @private
   */
  function _getSlideEidFromNode(slideNode) {
    var currentSlide = slideNode.querySelector('[qowt-divtype="slide"]');
    if (currentSlide) {
      var slideId = currentSlide.id;
      return slideId.split('-')[1];
    }
    return undefined;
  }

  return _api;
});
