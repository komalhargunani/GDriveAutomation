define(['qowtRoot/pubsub/pubsub',
  'qowtRoot/models/env',], function(PubSub, EnvModel) {

    'use strict';

    var _api = {

      updateFocusedElementInPoint: function() {
        var activeElement = document.activeElement;
        if(activeElement.tagName === 'QOWT-POINT-SHAPE' ||
          activeElement.tagName === 'QOWT_POINT_THUMBNAIL' ||
          (activeElement.parentElement.getAttribute('id') === 'slide-notes-div')
        ) {
          PubSub.publish('qowt:focusedElementInPoint', activeElement);
        }
      },

      setApplicationSpecificFocusedElement: function(focusedPointElement) {
        switch(EnvModel.app) {
            case 'word':
              var doc = document.querySelector('qowt-msdoc');
              if(doc) {
                doc.querySelector('div').focus();
              }
              break;
            case 'point':
            if(focusedPointElement) {
              focusedPointElement.focus();
            }
            break;
            case 'sheet':
              var sheet =
              document.getElementsByClassName('qowt-sheet-container-panes')[0];
              sheet.focus();
              break;
            default: break;
          }
      }
    };

    // vvvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvv

    return _api;
  });
