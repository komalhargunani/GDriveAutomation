define([
  'qowtRoot/configs/common',
  'qowtRoot/media/insertMediaHandler',
  'qowtRoot/utils/idGenerator',
  'utils/analytics/googleAnalytics'
], function(
    CommonConfig,
    InsertMediaHandler,
    IdGenerator,
    GA) {
  'use strict';

  var factory_ = {
    /**
     * Creates a handler to insert the image in the dom.
     * @param {Object} image - the context/ image data to be inserted in dom
     * @return {Object} InsertImageHandler
     */
    create: function(image) {
      if (!image) {
        throw (new Error('image data missing in context'));
      }
      if (!image.src) {
        throw (new Error('image src missing in context'));
      }
      if (!image.mimeType) {
        throw (new Error('image mimeType missing in context'));
      }
      if (!(image.data instanceof ArrayBuffer)) {
        throw (new Error('image data is not array buffer'));
      }
      if (!image.properties) {
        throw (new Error('image properties missing in the context'));
      }
      if (!image.properties.wdt) {
        throw (new Error('image width missing in the context'));
      }
      if (!image.properties.hgt) {
        throw (new Error('image height missing in the context'));
      }


      function module() {
        var image_ = image;
        var api_ = InsertMediaHandler.create();

        /**
         * Inserts the image in the DOM.
         */
        api_.insertMedia = function() {
          if (isUnsupportedImage_()) {
            var msg = api_.getMediaExtensionFromMimeType(image_.mimeType) +
                ' images are not supported';
            // TODO(umesh.kadam) This should instead be a message on butter bar
            // or a modal dialog? Discuss with Ha.
            console.log(msg);
            GA.sendException({msg: msg, fatal: false});
            return;
          }
          updateImageObjToFitTheNeed_();
          api_.tryToRegisterMedia(image_);
          var drawingEle = getDrawingElementPrepared_();
          api_.insertMediaInDOM_(drawingEle);
        };


        // private functions
        /**
         * Updates the image object by uniques src name and adjusts the image
         * dimensions such that it fits in page.
         * @private
         */
        function updateImageObjToFitTheNeed_() {
          // TODO(umesh.kadam): What if the binary data is the same ? consider
          // optimising such cases.
          image_.src = api_.getUniqueNameForMedia(
              image_.src, 'image' /*media type*/);
          // this ensures that the image fits in page.
          api_.getMediaDimensionsAdjusted(image_.properties);
        }


        /**
         * @return {QowtDrawing} - The drawing element to be inserted in the dom
         * @private
         */
        function getDrawingElementPrepared_() {
          var newEidForDrawing = IdGenerator.getUniqueId('E-');
          var newEidForImage = IdGenerator.getUniqueId('E-');
          var imageElement = new QowtWordImage();
          imageElement.setEid(newEidForImage);
          var imageModel = {
            imageProperties: image_.properties,
            src: image_.src,
            frmt: api_.getMediaExtensionFromMimeType(image_.mimeType)
          };
          imageElement.setModel(imageModel);

          var drawingElement = new QowtDrawing();
          drawingElement.setEid(newEidForDrawing);
          drawingElement.setModel(api_.getDefaultModelForDrawing_());
          drawingElement.appendChild(imageElement);
          return drawingElement;
        }


        function isUnsupportedImage_() {
          var extension = api_.getMediaExtensionFromName(image_.src);
          extension = extension.toLowerCase();
          return !CommonConfig.SUPPORTED_IMAGE_FORMATS[extension];
        }

        return api_;
      }
      var instance = module();
      return instance;
    }
  };
  return factory_;
});
