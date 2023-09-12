/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Preset shape data map
 * Holds preset shape data against preset id
 *
 * Preset shape id to preset name table is depicted on quicknet page
 * @see http://quicknet/display/WOSTABLET/Supplementary+information+for+DCP+APIs
 *      #SupplementaryinformationforDCPAPIs-Presetshapenametopresetshapeidmap
 */
define([
  'qowtRoot/drawing/geometry/presets/_all'
], function(PresetArray) {

  'use strict';


  var _api = {

    /**
     * Get preset shape data for given preset shape id.
     * Returns cached preset shape data.
     * If preset shape data is not available in cache, then get it and cache.
     *
     * @param presetId preset shape id for which data to be returned
     * @return preset shape data for given preset shape id, undefined if no
     *         shape data available for preset id
     */
    getPresetData: function(presetId) {
      return PresetArray[presetId];
    }
  };


  return _api;
});
