
/**
 * @fileoverview The Chart Sheet Manager is a helper for the Workbook Layout
 * Control. The Chart Sheet Manager is responsible for rendering chart sheets in
 * a workbook. A chart sheet is a sheet that contains a single chart that is
 * displayed over a blank grey background (not a grid).
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/controls/grid/floaterManager',
  'qowtRoot/utils/domListener',
  'qowtRoot/configs/sheet',
  'qowtRoot/utils/cssManager',
  'qowtRoot/pubsub/pubsub'
  ], function(FloaterManager,
              DomListener,
              SheetConfig,
              CssManager,
              PubSub) {

  'use strict';

  // Private data
  var _container;
  var _floaterManager;

  var _api = {

    /**
     * Initialise the singleton Chart Sheet Manager
     *
     * @param container {HTMLElement} Container div to be managed by the manager
     * @method init()
     */
    init: function(container) {
      _container = container;
      _floaterManager = FloaterManager.create();
    },

    /**
     * Activate the singleton Chart Sheet Manager.
     * The manager will start listening for window resize events
     *
     * @method activate()
     */
    activate: function() {
      DomListener.addListener(window, 'resize', _handleWindowResize);
    },

    /**
     * Deactivate the singleton Chart Sheet Manager.
     * The manager will stop listening for window resize events
     *
     * @method deactivate()
     */
    deactivate: function() {
      DomListener.removeListener(window, 'resize', _handleWindowResize);
    },

    /**
     * Resets the Chart Sheet Manager.
     * This removes the child chart element of the chart sheet container
     *
     * @method reset()
     */
    reset: function() {
      // remove the chart sheet's child chart floater element
      var chartWidget = _floaterManager.at(0);
      if(chartWidget) {
        _container.removeChild(chartWidget.getNode());
      }
      _floaterManager.reset();
    },

    /**
     * Returns the chart sheet container
     *
     * @method getChartSheetContainer()
     */
    getChartSheetContainer: function() {
      return _container;
    },

    /**
     * Returns a reference to the Chart Sheet Manager's floater manager
     *
     * @return {object} The floater manager
     * @method getFloaterManager()
     */
    getFloaterManager: function() {
      return _floaterManager;
    },

    /**
     * Adjusts the chart sheet layout appropriately for the current zoom scale.
     * This involves positioning the chart element in the center of the chart
     * sheet container and ensuring that the size of the scroll bars remains
     * unchanged
     *
     * @method adjustForZoomScale()
     */
    adjustForZoomScale: function() {
      _positionChartToCenter();
      _reapplyScrollbarSize();
    },

    /**
     * Lays out the floater that is in the chart sheet
     *
     * @param eventData {object} The event data of a "qowt:pane:layoutChanged"
     *                           signal
     * @method layoutFloaters(eventData)
     */
    layoutFloaters: function(eventData) {
      _floaterManager.layoutFloaters(eventData);

      // we want the SheetChartTool to become active for
      // a chart sheet so publish a signal to select it
      var chartFloater = _floaterManager.at(0);
      if(chartFloater) {
        var obj = {
          anchor: {rowIdx: 0, colIdx: 0},
          topLeft: {rowIdx: 0, colIdx: 0},
          bottomRight: {rowIdx: 0, colIdx: 0},
          contentType: chartFloater.getType()
        };
        PubSub.publish("qowt:sheet:requestFocus", obj);
      }
    }
  };

  /**
   * Positions the chart element in the center of the chart sheet container,
   * based on its current height and width in relation to the chart sheet
   * container
   */
  var _positionChartToCenter = function() {
    var chartWidget = _floaterManager.at(0);
    if(chartWidget) {
      var chartNode = chartWidget.getNode();

      var heightDiff = _container.offsetHeight - chartNode.offsetHeight;
      var newTopVal = Math.max(0, (heightDiff / 2));
      chartWidget.setTopPosition(newTopVal);

      var widthDiff = _container.offsetWidth - chartNode.offsetWidth;
      var newLeftVal = Math.max(0, (widthDiff / 2));
      chartWidget.setLeftPosition(newLeftVal);
    }
  };

  /**
   * Reapplies the constant size of the scrollbars, which should always
   * appear with the same dimensions regardless of the current zoom scale
   */
  var _reapplyScrollbarSize = function() {
    var zoom = SheetConfig.ZOOM.levels[SheetConfig.ZOOM.current];
    var sbSize = SheetConfig.kSCROLLBAR_SIZE / zoom + 'px';

    var buttonSelector = ".qowt-chart-sheet::-webkit-scrollbar-button";
    CssManager.addRule(buttonSelector, {
      'width': sbSize,
      'height': sbSize
    });
    var selector = ".qowt-chart-sheet::-webkit-scrollbar";
    CssManager.addRule(selector, {
      'width': sbSize,
      'height': sbSize
    });
  };

  /**
   * Handler method for browser window resize events.
   * When the browser window is resized the chart element is
   * repositioned to the center of the chart sheet container.
   * The height and width of the chart element remains unchanged
   */
  var _handleWindowResize = function() {
    _positionChartToCenter();
  };

  return _api;
});
