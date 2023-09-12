/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([], function() {

  'use strict';

  var _api;

  _api = {

    /**
     * perform canvas draw operations for meta files
     * @param canvas shape-canvas
     * @param pathLst path lists for canvas to draw
     */
    paintCanvas: function(canvas, pathLst, scaleFactor) {
      // console.log('Inside MetaFilePainter - paintCanvas method');
      var context = canvas.getContext("2d");

      context.scale(scaleFactor.x, scaleFactor.y);

      pathLst.forEach(function(shapePath) {

        shapePath.paths.forEach(function(command) {

          var func = command.p;
          var args = command.a;
          var argsArray;

          /**
           * TODO instead of getting command.a as object try to get it as array
           * directly from DCP.
           * This will help to avoid below calculations and hence improved
           * performance at JS
           */
          if (args) {
            argsArray = [];
            for (var key in args) {
              argsArray.push(args[key]);
            }
          }

          var fn = context[func];

          /**
           * if fn is function then invoke it on context
           * else treat is as context property and assign it with value
           * (command.a)
           */
          if (typeof fn === 'function') {
            if (argsArray) {
              /**
               * When func is drawImage, we need to handle it in different way.
               * The way to handle images to render on canvas is
               *      1. Create Image element and assign source to it
               *      2. provide callback for image load (img.onload); and in
               *         callback, call drawImage function (fn) on canvas
               *         context
               *
               * From DCP we are getting drawImage command as
               * {
               *      p: "drawImage"
               *      a: {
               *          path: "image source path to load"
               *          x: "0" // x coordinate
               *          y: "0" // y coordinate
               *          }
               * }
               *
               * using above we form argsArray as
               * ["image source path to load", "0", "0"]
               *
               * Then we create image element using source path and
               * first entry of the argsArray is replaced with image element
               * so our modified argsArray, now, is look like
               * [imageElement, "0", "0"]
               *
               * while doing so, we do provide imageElement onload callBack
               * where we invoke drawImage function on canvas, viz.
               *
               * imageElement.onload = function(){
               *      fn.apply(context, argsArray)
               * }
               *
               * TODO the way we are rendering images on canvas is through
               * imageElement onload callback.
               * There is a problem with this. image will be drawn on canvas
               * when its loaded.
               * What if we have two consecutive drawImage commands and we want
               * to draw images as per command sequence, we cant guarantee that
               * this will happen with current approach.
               * Need to provide some mechanism where we guarantee that commands
               * are fully run in sequence. A good example for it is overlapped
               * images.
               *
               * Other way to render image on canvas is to have image data
               * passed instead of cached image's location and in this case we
               * will not come across above problem, but yes, it will kill
               * performance as we will get image data as part of DCP JSON
               */
              if (func === "drawImage") {
                /**
                 * JSLint doesn't know about the Image
                 */
                /*jsl:ignore*/
                var img = new Image();
                /*jsl:END*/
                img.src = argsArray[0];
                argsArray[0] = img;
                img.onload = function() {
                  fn.apply(context, argsArray);
                };
              } else {
                fn.apply(context, argsArray);
              }
            } else {
              fn.apply(context);
            }
          } else {
            context[func] = args;
          }
        }); // end of shapePath.paths.each
      }); // end of pathLst.each
    } // end of paintCanvas
  }; // end of _api

  return _api;
});
