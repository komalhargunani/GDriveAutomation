define([
  'qowtRoot/media/insertImageHandler'
], function(
    InsertImageHandler) {

  'use strict';

  describe('Test insertImageHandler.js', function() {
    describe('InsertImageHandler.create', function() {
      var image_;

      beforeEach(function() {
        image_ = {
          src: 'someImage.jpg',
          data: new ArrayBuffer(),
          mimeType: 'image/jpg',
          properties: {
            wdt: '100',
            hgt: '100'
          }
        };
      });


      it('should throw error if image is undefined', function() {
        image_ = undefined;
        assert.throw(function() {
          InsertImageHandler.create(image_);
        }, Error, 'image data missing in context');
      });


      it('should throw error if image.src is undefined', function() {
        delete image_.src;
        assert.throw(function() {
          InsertImageHandler.create(image_);
        }, Error, 'image src missing in context');
      });


      it('should throw error if image.mimeType is undefined', function() {
        delete image_.mimeType;
        assert.throw(function() {
          InsertImageHandler.create(image_);
        }, Error, 'image mimeType missing in context');
      });


      it('should throw error if image.data is undefined', function() {
        delete image_.data;
        assert.throw(function() {
          InsertImageHandler.create(image_);
        }, Error, 'image data is not array buffer');
      });


      it('should throw error if image.data is not an ArrayBuffer', function() {
        image_.data = 'some other data type but array buffer';
        assert.throw(function() {
          InsertImageHandler.create(image_);
        }, Error, 'image data is not array buffer');
      });


      it('should throw error if image.properties is undefined', function() {
        delete image_.properties;
        assert.throw(function() {
          InsertImageHandler.create(image_);
        }, Error, 'image properties missing in the context');
      });


      it('should throw error if image.properties.wdt is undefined', function() {
        delete image_.properties.wdt;
        assert.throw(function() {
          InsertImageHandler.create(image_);
        }, Error, 'image width missing in the context');
      });


      it('should throw error if image.properties.hgt is undefined', function() {
        delete image_.properties.hgt;
        assert.throw(function() {
          InsertImageHandler.create(image_);
        }, Error, 'image height missing in the context');
      });


      it('should return true if image has all necessary data', function() {
        assert.doesNotThrow(function() {
          InsertImageHandler.create(image_);
        });
      });
    });
  });
});
