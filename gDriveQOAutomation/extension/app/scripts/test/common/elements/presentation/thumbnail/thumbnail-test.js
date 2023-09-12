define(['qowtRoot/widgets/point/moveSlideDragHandler',
  'qowtRoot/widgets/point/thumbnailStrip',
  'common/elements/presentation/thumbnail/thumbnail'],
function(MoveSlideDragHandler, ThumbnailStrip) {
  'use strict';

  describe('<qowt-point-thumbnail>', function() {

    var element_, sandbox_ = sinon.sandbox.create();

    beforeEach(function() {
      this.stampOutTempl('thumbnail-test-template');
      element_ = this.getTestDiv().querySelector('qowt-point-thumbnail');
    });

    afterEach(function() {
      element_ = undefined;
    });

    it('should get highlighted thumbs and and create an instance of ' +
        'moveSlideDragHandler on track start', function() {
          var dummyEvent = {
            detail: { state: 'start' },
            preventDefault: function() {},
            stopPropagation: function() {}
          };
          sandbox_.stub(ThumbnailStrip, 'getHighlightedThumbs').returns(
              {m_arr: []});
          sandbox_.stub(MoveSlideDragHandler.prototype, 'onMouseDown');
          sandbox_.stub(MoveSlideDragHandler.prototype, 'onDragStart');
          sandbox_.stub(dummyEvent, 'preventDefault');
          sandbox_.stub(dummyEvent, 'stopPropagation');
          element_.track(dummyEvent);
          assert.isTrue(ThumbnailStrip.getHighlightedThumbs.called,
              'highlightedThumbs fetched from thumbnail strip');
          assert.isTrue(MoveSlideDragHandler.prototype.onMouseDown.
              calledWith(dummyEvent), 'onMouseDown called on drag handler');
          assert.isTrue(MoveSlideDragHandler.prototype.onDragStart.
              calledWith(dummyEvent), 'onDragStart called on drag handler');
          assert.isTrue(dummyEvent.preventDefault.called,
              'event default behavior prevented');
          assert.isTrue(dummyEvent.stopPropagation.called,
              'event propogation stopped');
        });

    it('should initiate onDrag on moveSlideDragHandler for track', function() {
      var dummyEvent = { detail: { state: 'track' } };
      sandbox_.stub(MoveSlideDragHandler.prototype, 'onDrag');
      element_.track(dummyEvent);
      assert.isTrue(MoveSlideDragHandler.prototype.onDrag.
          calledWith(dummyEvent), 'onDrag called on drag handler');
    });

    it('should initiate onDragEnd on moveSlideDragHandler for trackend',
        function() {
          var dummyEvent = { detail: { state: 'end'} };
          sandbox_.stub(MoveSlideDragHandler.prototype, 'onDragEnd');
          element_.track(dummyEvent);
          assert.isTrue(MoveSlideDragHandler.prototype.onDragEnd.
              calledWith(dummyEvent), 'onDragEnd called on drag handler');
        });
  });

  return {};
});
