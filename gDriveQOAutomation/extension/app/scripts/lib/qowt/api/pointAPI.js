/*!
 * Copyright Quickoffice, Inc, 2005-2013
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * PointAPI - the content API for point files
 * Creates a command object and populates what it can
 * then pass the command on to the command manager
 */
define([
  'qowtRoot/pubsub/pubsub'
  ], function(
    PubSub) {

  'use strict';



  var _api = {

    /**
     * Open a presentation file.
     * @param {string} path The full path of the presentation file to open.
     */
    openPresentation: function(path) {
      PubSub.publish('qowt:doAction', {
        'action': 'openPresentation',
        'context': {
          'contentType': 'presentation',
          'path': path
        }
      });
    },

    /**
     * Get the styles.
     */
    getStyles: function() {
      PubSub.publish('qowt:doAction', {
        'action': 'getStyles',
        'context': {
          'contentType': 'presentation'
        }
      });
    },

    /**
     * API for getting ALL thumbnail slide contents.
     * calls constructPresentationSlideCommand
     * this aggregates the commands necessary to get ALL data needed for each
     * thumbnail slide.
     *
     * @param nodeForSlide {node}  node that will take content for the slide.
     * @param slideNumber {number} the number of this slide within the slide
     *        deck
     */
    getSlide: function(nodeForSlide, slideNumber) {
      PubSub.publish('qowt:doAction', {
        'action': 'getSlide',
        'context': {
          'contentType': 'presentation',
          'nodeForSlide': nodeForSlide,
          'slideNumber': slideNumber
        }
      });
    },


    /**
     * Creates moveShape command and calls the command manager
     * @param shapeId id of the shape to move
     * @param deltaX displacement of the shape horizontally
     * @param deltaY displacement of the shape vertically
     */
    moveShape: function(shapeId, deltaX, deltaY) {
      PubSub.publish('qowt:doAction', {
        'action': 'move',
        'context': {
          'contentType': 'shape',
          'shapeId': shapeId,
          'deltaX': deltaX,
          'deltaY': deltaY
        }
      });
    },

    /**
     * Toggles between play and pause state of presentation slide show
     */
    togglePlayPause: function() {
      PubSub.publish("qowt:animationPlayPause", {});
    },

    /**
     * Go to next slide
     */
    goToNextSlide: function() {
      PubSub.publish("qowt:nextSlide", {});
    },

    /**
     * Go to previous slide
     */
    goToPreviousSlide: function() {
      PubSub.publish("qowt:previousSlide", {});
    },

    /**
     * Start a slideshow beginning at the currently selected slide.
     */
    startSlideShow: function() {
      PubSub.publish('qowt:doAction', {
        'action': 'startSlideshow',
        'context': {
          'contentType': 'presentation'
        }
      });
    },

    /**
     * Stops presentation slide show.
     */
    stopSlideShow: function() {
      PubSub.publish('qowt:doAction', {
        'action': 'stopSlideshow',
        'context': {
          'contentType': 'presentation'
        }
      });
    }
  };

  return _api;
});
