define([
  'qowtRoot/widgets/point/moveSlideDragHandler',
  'qowtRoot/widgets/point/thumbnailStrip'],
function(MoveSlideDragHandler, ThumbnailStrip) {

  'use strict';

  var handler_;
  var dragging_ = false;

  var api_ = {
    is: 'qowt-point-thumbnail',
    listeners: {
      'track': 'track'
    },

    track: function(event) {
      switch(event.detail.state) {
        case 'start':
          if (!dragging_) {
            var highlightedThumbs = ThumbnailStrip.getHighlightedThumbs();
            handler_ = new MoveSlideDragHandler(highlightedThumbs.m_arr);
            handler_.onMouseDown(event);
            event.preventDefault();
            event.stopPropagation();
            dragging_ = true;
          }
          handler_.onDragStart(event);
          break;
        case 'track':
          handler_.onDrag(event);
          break;
        case 'end':
          handler_.onDragEnd(event);
          dragging_ = false;
          break;
        default:
          throw new Error('Invalid state for tracking event on thumbnail');
      }
    }
  };

  window.QowtPointThumbnail = Polymer(api_);
});
