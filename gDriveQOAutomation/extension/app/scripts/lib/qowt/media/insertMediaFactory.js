define([
  'qowtRoot/media/insertAudioHandler',
  'qowtRoot/media/insertImageHandler',
  'qowtRoot/media/insertMovieHandler'
], function(
    InsertAudioHandler,
    InsertImageHandler,
    InsertMovieHandler) {
  'use strict';

  var factory_ = {
    create: function(media) {
      var mediaType, instance;
      if (media && media.mimeType) {
        mediaType = media.mimeType.substr(0, media.mimeType.indexOf('/'));
      }
      switch (mediaType) {
        case 'image':
          instance = InsertImageHandler.create(media);
          break;
        case 'movie':
          instance = InsertMovieHandler.create(media);
          break;
        case 'audio':
          instance = InsertAudioHandler.create(media);
          break;
        default :
          throw (new Error('unsupported media type : ' + mediaType));
      }
      return instance;
    }
  };
  return factory_;
});