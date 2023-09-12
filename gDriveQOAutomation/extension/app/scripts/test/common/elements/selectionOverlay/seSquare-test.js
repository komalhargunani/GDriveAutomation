define([
  'common/elements/selectionOverlay/constants',
  'common/elements/selectionOverlay/selectionOverlay',
  'common/elements/selectionOverlay/squares/seSquare'
], function(
    Constants
    /*selectionOverlay*/
    /*seSquare*/) {
  'use strict';

  var kSide_ = Constants.kSide;
  var kUnit_ = Constants.kUnit;

  xdescribe('Test seSquare.js', function() {

    var selectionOverlay_, seSquare_, elmPos_, sandbox_;

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

      seSquare_ = new QowtSESquare(selectionOverlay_);
      selectionOverlay_.appendChild(seSquare_);

      assert.strictEqual(selectionOverlay_.clientWidth, elmPos_.clientWidth);
      assert.strictEqual(selectionOverlay_.clientHeight, elmPos_.clientHeight);
      assert.strictEqual(selectionOverlay_.offsetLeft, elmPos_.offsetLeft);
      assert.strictEqual(selectionOverlay_.offsetTop, elmPos_.offsetTop);
    });


    afterEach(function() {
      selectionOverlay_.removeChild(seSquare_);
      selectionOverlay_ = undefined;
      sandbox_.restore();
    });


    it('should lie on the bottom right corner of the overlay', function() {
      var expectedLeftPos = selectionOverlay_.offsetLeft +
          selectionOverlay_.clientWidth - kSide_ / 2 + kUnit_;
      var expectedTopPos = selectionOverlay_.offsetTop +
          selectionOverlay_.clientHeight - kSide_ / 2 + kUnit_;
      assert.strictEqual(expectedLeftPos, seSquare_.customLeftPos);
      assert.strictEqual(expectedTopPos, seSquare_.customTopPos);
    });
  });

  return {};
});
