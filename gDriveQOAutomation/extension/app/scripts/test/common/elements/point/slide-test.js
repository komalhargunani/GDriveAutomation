define([
  'qowtRoot/widgets/point/slide',
  'qowtRoot/pubsub/pubsub'
], function(
    Slide,
    PubSub) {

  'use strict';


  describe('Point slide element', function() {

    var slide_, sandbox_;
    beforeEach(function() {
      var parentNode = document.createElement('div');
      slide_ = Slide.create(0, parentNode, true);
      sandbox_ = sinon.sandbox.create();
      sandbox_.spy(PubSub, 'publish');
    });

    afterEach(function() {
      sandbox_.restore();
      sandbox_ = undefined;
      slide_ = undefined;
    });

    it('should update slide menu when slide widget is a thumbnail and its ' +
        'highlighted', function() {
          sandbox_.stub(slide_, 'isHighlighted').returns(true);
          slide_.setHiddenInSlideShow(true);
          assert.strictEqual(PubSub.publish.getCall(0).args[0],
              'qowt:updateSlideMenu');
        });

    it('should not update slide menu when slide widget is a thumbnail but ' +
        'its not highlighted', function() {
          sandbox_.stub(slide_, 'isHighlighted').returns(false);
          slide_.setHiddenInSlideShow(true);
          assert.strictEqual(PubSub.publish.callCount, 0);
        });
  });
});
