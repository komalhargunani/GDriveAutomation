/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE: The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
    'qowtRoot/controls/grid/chartSheetManager',
    'qowtRoot/controls/grid/paneManager',
    'qowtRoot/errors/errorCatcher',
    'qowtRoot/errors/qowtSilentError',
    'qowtRoot/widgets/grid/floaterChart',
    'qowtRoot/models/sheet'
    ],
    function(
      ChartSheetManager,
      PaneManager,
      ErrorCatcher,
      QOWTSilentError,
      SheetFloaterChart,
      SheetModel) {

  'use strict';

  var kCenter = 'center';

  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'sch',

    visit: function(v) {
      var anchor;
      if (!v && !v.el && !v.el.etp && (v.el.etp !== _api.etp)) {
        return undefined;
      }

      anchor = v.el.elm[0].ancr;

      if (!anchor) {
        ErrorCatcher.handleError(new QOWTSilentError('Missing chart anchor'));
        return;
      }

      // if current sheet is chart sheet, change the anchor type to 'center'.
      // anchor type is used by floaterChart widget to differentiate between
      // chartSheet's chart and normal floating chart.
      anchor.type = SheetModel.activeChartSheet ? kCenter : anchor.type;

      var config = {
        anchor: anchor,
        chartId: v.el.chid
      };

      var chartFloaterWidget;

      var floaterMgr = SheetModel.activeChartSheet ?
        ChartSheetManager.getFloaterManager() :
        PaneManager.getMainPane().getFloaterManager();

      // For a GetSheetContent command ALL of the chart data for the entire
      // sheet is returned from the service (at the end of the GetSheetContent
      // response), regardless of what row range the GetSheetContent cmd asked
      // for. Therefore whenever a chart is returned by the service we need to
      // check whether it has already been returned and processed (because we do
      // not want to create duplicate instances of the chart).We should optimise
      // this in the service such that a chart is only returned once, as part of
      // the service response for the row range that it is anchored in
      var floaterCount = floaterMgr.count();
      for (var ii = 0; ii < floaterCount; ii++) {
        var curFloater = floaterMgr.at(ii);

        if (curFloater.getChartId &&
          curFloater.getChartId() === config.chartId) {
          chartFloaterWidget = curFloater;
          break;
        }
      }

      if (!chartFloaterWidget) {
        chartFloaterWidget = SheetFloaterChart.create(config);
        floaterMgr.attachWidget(chartFloaterWidget);
        chartFloaterWidget.appendTo(v.node);
      }

      // if a 'contextmenu' event (i.e. a right click) occurs on
      // a chart then we don't want the QO context menu to appear (if there is
      // one)
      chartFloaterWidget.getNode().oncontextmenu = function(e) {
        // prevents the event from reaching the context menu widget
        e.stopPropagation();
      };

      return undefined;
    }

  };

  return _api;
});
