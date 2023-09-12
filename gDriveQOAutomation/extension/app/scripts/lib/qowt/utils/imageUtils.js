
define([
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError'
], function(ErrorCatcher,
            QowtSilentError) {

  'use strict';

  /**
   * Utilities that assist in working with images.
   *
   * @constructor
   */
  var ImageUtils = function() {};

  ImageUtils.prototype.constructor = ImageUtils;

  /**
   * Applies all the recolor effects on an image that's passed as a blob and
   * returns a promise if the effects *can* be applied or null otherwise.
   *
   * It requires a 'RecolorRequest' object containing every recolor effect's
   * details to be applied on the image.
   *
   * @param {String} imageBlob  Image blob or url of the original image that
   *     is to be recolored
   * @param {RecolorRequest} recolorRequest  Request object containing data
   *     about various recolor effects that are to be applied.
   *
   * @return {Promise | null} A promise is returned in case effects *can* be
   * applied on the the image blob based on the the inputs like the supplied
   * recolor request. Null otherwise.
   *
   * The promise resolves with a recolored image's data url that can be used
   * as-is as image src or in background-image css property.
   *
   * In case of any issues/errors, the promise is rejected with an error that
   * was encountered.
   */
  ImageUtils.applyEffects = function(imageBlob, recolorRequest) {
    var applierPromise = null;

    // Check if effects data is complete and can be applied
    if (!imageBlob || !recolorRequest) {
      ErrorCatcher.handleError(new QowtSilentError('ImageUtils: Effects' +
          ' requested to be applied but either of the params or effects data' +
          ' is incomplete!'));
    } else {

      applierPromise = new Promise(function(resolveFn, rejectFn) {
        var image, handlers;

        // Instantiate an image and attach it's listener
        image = new Image();
        handlers = applyEffectsImageEventHandlers_(image, recolorRequest,
            resolveFn, rejectFn);
        handlers.addListeners();

        // Load the image, set the dominoes in motion
        image.src = imageBlob;
      });
    }

    return applierPromise;
  };

  // -------------------- PRIVATE ----------------------
  /**
   * Helps in deciding if the image data supports transparency. Detects if the
   * image data has alpha channel values other than 255.
   *
   * @param {Array} imageData  An array containing color values in RGBA sequence
   * @return {boolean}  True if any pixel's alpha channel is not 255 (meaning
   * the image is not opaque). False, otherwise.
   *
   * @private
   */
  var checkAlpha_ = function(imageData) {
    var length = imageData.length;
    for (var index = 0; index < length; index += 4) {
      if (imageData[index + 3] < 255) {
        return true;
      }
    }
    return false;
  };

  /**
   * Applies all the effects on each pixel of image.
   *
   * @param {HTMLImageElement} image  image element with the original image
   *     loaded
   * @param {RecolorRequest} recolorRequest  Request object containing data
   *     about various recolor effects that are to be applied.
   *
   * @return {String | undefined} Recolored image's data URL or undefined in
   * case of any errors.
   *
   * @private
   */
  var applyEffects_ = function(image, recolorRequest) {
    var canvas = document.createElement('canvas'),
        canvasContext,
        imageWidth,
        imageHeight,
        imageData,
        imagePixelData,
        imageType,
        backgroundImageDataUrl;

    // Prepare a temporary canvas and draw the image in it
    canvas.width = imageWidth = image.width;
    canvas.height = imageHeight = image.height;

    canvasContext = canvas.getContext('2d');
    canvasContext.drawImage(image, 0, 0);

    // Get image's pixels data
    imageData = canvasContext.getImageData(0, 0, imageWidth, imageHeight);
    imagePixelData = imageData.data;

    // process all effects on all image pixels
    recolorRequest.apply(imagePixelData);

    // set image data into canvas and render
    canvasContext.putImageData(imageData, 0, 0);

    // Determine the image type, jpeg/png, by checking for any transparent pixel
    imageType = 'image/jpeg';
    if (checkAlpha_(imagePixelData)) {
      imageType = 'image/png';
    }

    backgroundImageDataUrl = canvas.toDataURL(imageType);

    // Avoid leaks
    canvasContext = undefined;
    canvas = undefined;

    return backgroundImageDataUrl;
  };

  /**
   * Provides convenient apis for 'applyEffects' method to interact with it's
   * 'image'.
   *
   * @param {HTMLImageElement} image
   * @param {RecolorRequest} recolorRequest
   * @param {Function} resolveFn
   * @param {Function} rejectFn
   * @return {Object}
   * @private
   */
  var applyEffectsImageEventHandlers_ = function(image, recolorRequest,
                                                 resolveFn, rejectFn) {
    var removeListeners = function() {
      if (image) {
        image.removeEventListener('load', onLoadHandler, true);
        image.removeEventListener('error', onErrorHandler, true);
      }
    };

    var onLoadHandler = function(event) {
      var recoloredImageDataUrl;

      try {
        // apply effects on the loaded image as per the recolor request
        recoloredImageDataUrl = applyEffects_(event.target,
            recolorRequest);

        resolveFn(recoloredImageDataUrl);
      } catch (ex) {
        ErrorCatcher.handleError(new QowtSilentError('ImageUtils: ' +
            'Effects couldn\'t be processed!'));

        rejectFn(ex);
      } finally {
        // cleanup
        removeListeners();
      }
    };

    var onErrorHandler = function() {
      // cleanup
      removeListeners();

      rejectFn('Image to be recolored could not be loaded!');
    };

    return {
      addListeners: function() {
        image.addEventListener('load', onLoadHandler, true);
        image.addEventListener('error', onErrorHandler, true);
      }
    };
  };

  return ImageUtils;
});
