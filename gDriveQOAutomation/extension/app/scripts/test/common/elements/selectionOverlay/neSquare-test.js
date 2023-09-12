define([
  'common/elements/selectionOverlay/constants',
  'common/elements/selectionOverlay/selectionOverlay',
  'common/elements/selectionOverlay/squares/neSquare'
], function(
    Constants
    /*selectionOverlay*/
    /*neSquare*/) {
  'use strict';

  var kSide_ = Constants.kSide;
  var kUnit_ = Constants.kUnit;

  xdescribe('Test neSquare.js', function() {

    var selectionOverlay_, neSquare_, elmPos_, sandbox_;

    beforeEach(function() {
      var rect = {left: 0, top: 0, width: 100, height: 100};
      sandbox_ = sinon.sandbox.create();
      sandbox_.stub(document, 'getElementsByTagName', function() {
        var elm = {getBoundingClientRect: function() {return rect;}};
        return [elm];
      });
      elmPos_ = {
        getBoundingClientRect: function() {return rect;},
        offsetLeft: 0,
        offsetTop: 0,
        clientWidth: 100,
        clientHeight: 100
      };
      this.stampOutTempl('selectionOverlay-test-template');
      var testDiv = this.getTestDiv();
      selectionOverlay_ = new QowtSelectionOverlay(elmPos_);
      testDiv.appendChild(selectionOverlay_);

      neSquare_ = new QowtNESquare(selectionOverlay_);
      selectionOverlay_.appendChild(neSquare_);

      assert.strictEqual(selectionOverlay_.clientWidth, elmPos_.clientWidth);
      assert.strictEqual(selectionOverlay_.clientHeight, elmPos_.clientHeight);
      assert.strictEqual(selectionOverlay_.offsetLeft, elmPos_.offsetLeft);
      assert.strictEqual(selectionOverlay_.offsetTop, elmPos_.offsetTop);
    });


    afterEach(function() {
      selectionOverlay_.removeChild(neSquare_);
      selectionOverlay_ = undefined;
      sandbox_.restore();
    });


    it('should lie on the top right corner of the overlay', function() {
      var expectedLeftPos = selectionOverlay_.offsetLeft +
          selectionOverlay_.clientWidth - kSide_ / 2 + kUnit_;
      var expectedTopPos = selectionOverlay_.offsetTop - kSide_ / 2 + kUnit_;
      assert.strictEqual(expectedLeftPos, neSquare_.customLeftPos);
      assert.strictEqual(expectedTopPos, neSquare_.customTopPos);
    });
  });

  return {};
});
