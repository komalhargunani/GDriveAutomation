/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Document Image Fixture, the unit test data.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define(['qowtRoot/fixtures/fixtureBase'], function(FIXTURES) {

  'use strict';

  return {
    /**
     * Image element containing a single image,
     *
     * @param {Object} dimensions which contains
     * @param {Number} width of the image.
     * @param {Number} height of the image.
     *
     * @param {Object} crop which contains
     *                 the top, right, bottom, left percentages of
     *                 the crop rectangle.
     */
    imageElement: function(dimensions, crop) {
      FIXTURES.idCounter++;
      var el = {
        addChild: FIXTURES.addChild,
        etp: 'img',
        eid: FIXTURES.idCounter,
        wdt: (dimensions.wdt !== undefined) ? dimensions.wdt :
          dimensions.hgt,
        hgt: dimensions.hgt,
        crop: crop,
        src: 'image_source'
      };
      return el;
    }
  };

});
