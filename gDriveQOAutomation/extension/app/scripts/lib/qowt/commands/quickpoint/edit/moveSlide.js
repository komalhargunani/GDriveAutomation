// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview qowt command to move slides
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/commands/quickpoint/edit/editCommandBase',
  'qowtRoot/widgets/point/thumbnailStrip'
], function(
    CommandBase,
    ThumbnailStrip) {

  'use strict';

  var factory_ = {
    /**
     * Creates a new moveSlide command and returns it.
     *
     * @param {Object} context context data for the command
     * @return {Object} move slide command object
     */
    create: function(context) {
      var command = context.command;
      // don't try to execute if it's missing crucial data
      if (command === undefined) {
        throw new Error('Move slide command missing command data');
      }
      if (command.slideNumbers === undefined) {
        throw new Error('Move slide cmd missing slideNumbers');
      }
      if (command.moveSlideToPosition === undefined) {
        throw new Error('Move slide cmd missing moveSlideToPosition');
      }

      var callsService = (command.type && command.type === 'dcpCommand') ?
          false :
          true;
      // use module pattern for instance object
      var module = function() {
        // extend default command (optimistic==true)
        var api_ = CommandBase.create('moveSld', true, callsService);

        // Create a map to store the thumbnail selected and its original slide
        // index
        var originalSlideNumberMap = {};
        var commandSlidesToMove = command.slideNumbers;
        for (var i = 0; i < commandSlidesToMove.length; i++) {
          var thumbnail = ThumbnailStrip.thumbnail(commandSlidesToMove[i] - 1);
          originalSlideNumberMap[commandSlidesToMove[i]] = thumbnail;
        }

        /**
         * @override
         */
        api_.changeHtml = function() {
          ThumbnailStrip.moveSlides(command.slideNumbers,
              command.moveSlideToPosition, context.position);
        };

        if (command.type !== 'dcpCommand') {
          /**
           * @override
           */
          api_.doRevert = function() {
            var slidesTobeMoved = command.slideNumbers;
            // If the slides have been moved in "up" or "start" direction then
            // while reverting the command, sort the slide indices to be moved
            // in descending order and then move.
            if (context.position === 'up' || context.position === 'start') {
              slidesTobeMoved = slidesTobeMoved.sort(function(a, b) {
                return b - a;
              });
            }
            var movedToIndex;
            for (var i = 0; i < slidesTobeMoved.length; i++) {
              movedToIndex = originalSlideNumberMap[slidesTobeMoved[i]].
                  getSlideIndex();
              ThumbnailStrip.reorderThumbnails(movedToIndex,
                  slidesTobeMoved[i] - 1);
            }
          };

          /**
           * Return an object with the data to be used as the payload of the
           * DCP request.
           * Request manager will add the unique ID to this payload to track
           * and match client-server request-response
           * The name property is mandatory.
           *
           * @return  {Object} The JSON Payload data to send to the dcp service
           * @see     TODO need dcp schema reference.
           */
          api_.dcpData = function() {
            command.name = 'moveSld';
            return command;
          };
        } else {
          // If its a Core generated command then the operation has already been
          // performed on Core so doRevert should not be defined.
          api_.doRevert = undefined;
        }
        return api_;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return factory_;
});
