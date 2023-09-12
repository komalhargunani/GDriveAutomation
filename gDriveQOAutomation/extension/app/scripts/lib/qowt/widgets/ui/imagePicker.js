define([
  'qowtRoot/pubsub/pubsub',
  'utils/analytics/googleAnalytics'
], function(
    PubSub,
    GA) {

  'use strict';
  var imagePickerId_ = 'imagePickerInputElement';

  // TODO(umesh.kadam): This should be replaced with image picker implemented in
  // polymer 1.0
  // Implementing this using plain HTML and not polymer 0.3.5 so that we don't
  // cause issues while we integrating this CL in master
  var api_ = {
    invokeNativePicker: function() {
      createImagePickerElement_();
      var imagePickerElement = document.getElementById(imagePickerId_);
      if (!imagePickerElement) {
        var msg = 'There seems to be a problem while launching the image ' +
            'picker. Please try again later.';
        // TODO(umesh.kadam) This should instead be a message on butter bar
        // or a modal dialog? Discuss with Ha.
        console.log(msg);
        GA.sendException({msg: msg, fatal: false});
        return;
      }
      imagePickerElement.click();
    }
  };


  /**
   * Add the original dimensions of the image to the image object and publish
   * qowt:requestAction
   *
   * @param {Object} image - The image to be inserted in document.
   * @private
   */
  function updateDimensionsAndPublishRequest_(image) {
    image.properties = {};
    image.properties.wdt = this.width;
    image.properties.hgt = this.height;
    // we have the necessary data to insert the image; publish the
    // requestAction for the same.
    var signalData = {
      action: 'insertMedia',
      context: image
    };
    PubSub.publish('qowt:requestAction', signalData);
  }


  function handleFileSelection_() {
    // Currently multiple file selection is disabled. User can only select
    // a single file.
    for (var i = 0, len = this.files.length; i < len; i++) {
      var file = this.files[i];
      var fileReader = new FileReader();
      fileReader.onload = function() {
        var image = {};
        image.src = file.name;
        image.mimeType = file.type;
        image.data = this.result;

        var url = window.URL || window.webkitURL;
        var tempImage = new Image();
        tempImage.onload =
            updateDimensionsAndPublishRequest_.bind(tempImage, image);
        tempImage.src = url.createObjectURL(file);

      };
      fileReader.readAsArrayBuffer(file);
    }
    // Remove the image-picker-element once its purpose is served.
    var imagePickerElement = document.getElementById(imagePickerId_);
    imagePickerElement.parentNode.removeChild(imagePickerElement);
  }


  function createImagePickerElement_() {
    if (!document.getElementById(imagePickerId_)) {
      var imagePickerElement = document.createElement('input');
      imagePickerElement.type = 'file';
      imagePickerElement.style.display = 'none';
      imagePickerElement.id = imagePickerId_;
      imagePickerElement.accept = 'image/*';
      imagePickerElement.onchange = handleFileSelection_;
      document.body.appendChild(imagePickerElement);
    }
  }

  return api_;
});
