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
 * JsDoc description
 */
define([
    'qowtRoot/utils/charts/chartRenderer'
    ],
    function(ChartRenderer) {

  'use strict';



  var _MetricUnits = 'px';
  var _positioningDiv = [];

  var _api = {
    /* DCP Type Code
       This is used by the DCP Manager to register this Handler */
       etp: 'wch',

       visit: function(v) {
           if (!v && !v.el && !v.el.etp && (v.el.etp !== _api.etp)) {
               return undefined;
           }

           var chartId = v.el.chid;
           _positioningDiv[chartId] = window.document.createElement('div');
           _positioningDiv[chartId].id = 'chpos-' + chartId;
           _positioningDiv[chartId].chid = chartId;

           _positioningDiv[chartId].style.position = 'relative';
           _positioningDiv[chartId].style.display = 'inline-block';
           _positioningDiv[chartId].classList.add('qowt-word-chart-holder');
           _positioningDiv[chartId].style.height = v.el.hgt + _MetricUnits;
           _positioningDiv[chartId].style.width = v.el.wdt + _MetricUnits;

           v.node.appendChild(_positioningDiv[chartId]);

           //we need interval -> DCP arch is not effective
           var _tmp = function(){
               var chid = v.el.chid;
               var tmpNode = _positioningDiv[chid];
               while( tmpNode !== null ){
                   if( tmpNode === document ){
                       break;
                   }
                   tmpNode = tmpNode.parentNode;
               }
               if( tmpNode ){
                   ChartRenderer.render(_positioningDiv[chid], chid);
                   _positioningDiv[chid] = undefined;
               }else{
                   setTimeout(_tmp,50);
               }
           };
           _tmp();

           // Now we insert the image into the positioning div and return the
           // element
           return _positioningDiv[chartId];
       }
  };

  return _api;
});
