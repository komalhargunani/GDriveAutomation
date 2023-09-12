/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */


/**
 * Handler for presentation element
 */

/**
 * Presentation model object used for relationships among different parts of
 * presentation
 */
define([
    'qowtRoot/configs/point',
    'qowtRoot/dcp/pointHandlers/util/cssManagers/presentation',
    'qowtRoot/messageBus/messageBus',
    'qowtRoot/models/charts',
    'qowtRoot/models/point',
    'qowtRoot/presentation/placeHolder/defaultTextStyleManager'],
  function(
    PointConfig,
    Presentation,
    MessageBus,
    ChartsModel,
    PointModel,
    DefaultTextStyleManager
  ) {

  'use strict';


  var _api = {

    /* DCP Type Code
     This is used by the DCP Manager to register this Handler */
    etp: 'prs',

    /*
     * visit method contributing in visitor pattern for DCP manager
     */
    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {

        if (v.el.sc) {
          PointModel.numberOfSlidesInPreso = v.el.sc;
          _recordData('SlideCount', PointModel.numberOfSlidesInPreso);
        }

        DefaultTextStyleManager.cacheDefTxtStyle(v.el.txStl);
        PointModel.filePath = v.el.pa;

        if (v.el.hasOwnProperty('sldSz')) {
          var item = v.el.sldSz;
          Presentation.createSlideSize(item.cx, item.cy);
        }

        ChartsModel.backgroundColor = PointConfig.CHART_BACKGROUND_COLOR;
      }
    }

  };

  // vvvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

  /**
   * Write file statistics to the user metrics module.
   * @private
   * @param {String} dataPoint The name of the data point to log.
   * @param {Integer} count The value to log against the data point.
   */
  function _recordData(dataPoint, count) {
    MessageBus.pushMessage({
      id: 'recordCount', context: {
        dataPoint: dataPoint,
        value: count
      }
    });
  }

  return _api;
});
