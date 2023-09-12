// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Utilities for QOWT markers
 *
 * @author rasika.tandale@quickoffice.com (Rasika Tandale)
 */

define([], function() {

  'use strict';


  var _api = {
    /**
     * This function sets attributes for an HTML div
     * @param node the HTML div for which attribute should be set
     * @param propertyName name of the attribute
     * @param propertyValue value of the attribute
     *
     */
    addQOWTMarker: function(node, propertyName, propertyValue) {
      if (node) {
        var propertyToAppend = propertyName + '<' + propertyValue + '>;';
        var attributeList = node.getAttribute('qowt-marker');
        if (attributeList === null) {
          attributeList = '';
        }
        attributeList += propertyToAppend;
        node.setAttribute('qowt-marker', attributeList);
      }
    },

    /**
     * This function returns the value of an attribute for an HTML div
     * @param node the HTML div for which attribute should be fetched
     * @param propertyName name of the attribute
     * @return propertyValue value of the attribute
     */
    fetchQOWTMarker: function(node, propertyName) {
      if (node) {
        var attributeList = node.getAttribute('qowt-marker');
        if (attributeList !== null) {
          attributeList = attributeList.split('>;');
          for (var i = 0; i < attributeList.length; i++) {
            var attribute = attributeList[i];
            attribute = attribute.split('<');
            if (attribute[0] === propertyName) {
              return attribute[1];
            }
          }
        }
      }
      return undefined;
    }
  };

  return _api;
});
