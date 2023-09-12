define(['common/elements/drawing/drawing'], function() {
  'use strict';

  describe('<qowt-drawing>', function() {

    var testEl_, sandbox_;

    beforeEach(function() {
      this.stampOutTempl('drawing-test-template');
      testEl_ = this.getTestDiv().querySelector('qowt-drawing');
      sandbox_ = sinon.sandbox.create();

      sandbox_.stub(testEl_, 'horizontalPositionChanged_');
      sandbox_.stub(testEl_, 'horizontalPositionRelChanged_');
      sandbox_.stub(testEl_, 'horizontalPosOffsetChanged_');
      sandbox_.stub(testEl_, 'verticalPositionChanged_');
      sandbox_.stub(testEl_, 'verticalPositionRelChanged_');
      sandbox_.stub(testEl_, 'verticalPosOffsetChanged_');
      sandbox_.stub(testEl_, 'wrappingStyleChanged_');
      sandbox_.stub(testEl_, 'distanceFromTextChanged_');
      sandbox_.stub(testEl_, 'relativeHeightChanged_');
    });

    afterEach(function() {
      sandbox_.restore();
      testEl_ = undefined;
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(testEl_.isQowtElement, 'should mixin QowtElement');
    });

    it('should mixin absolute position decorators', function() {
      assert.isTrue(testEl_.supports('horizontalPosition'),
          'support horizontal position');
      assert.isTrue(testEl_.supports('verticalPosition'),
          'support vertical position');
      assert.isTrue(testEl_.supports('horizontalPositionRel'),
          'support relative horizontal position');
      assert.isTrue(testEl_.supports('verticalPositionRel'),
          'support relative vertical position');
      assert.isTrue(testEl_.supports('horizontalPosOffset'),
          'support horizontal position offset');
      assert.isTrue(testEl_.supports('verticalPosOffset'),
          'support vertical position offset');
      assert.isTrue(testEl_.supports('wrapText'), 'support wrap text');
      assert.isTrue(testEl_.supports('wrappingStyle'),
          'support wrapping style');
      assert.isTrue(testEl_.supports('distanceFromText'),
          'support distance from text');
      assert.isTrue(testEl_.supports('relativeHeight'),
          'support relative height');
    });

    it('should call drawing observers after setting model', function() {
      var el = {
        etp: 'drawing',
        horizontalPosOffset: 567,
        horizontalPosition: 'absolute',
        horizontalPositionRel: 'column',
        verticalPosOffset: 851,
        verticalPosition: 'absolute',
        verticalPositionRel: 'paragraph',
        wrapText: 'bothSides',
        wrappingStyle: 'inFrontOfText',
        distanceFromText: {b: 0, l: 180, r: 180, t: 0},
        relativeHeight: 2
      };


      testEl_.setModel(el);
      assert.isTrue(testEl_.horizontalPositionChanged_.called,
          'horizontalPositionRelChanged_ method has been called');
      assert.isTrue(testEl_.horizontalPositionRelChanged_.called,
          'horizontalPositionRelChanged_ method has been called');
      assert.isTrue(testEl_.horizontalPosOffsetChanged_.called,
          'horizontalPosOffsetChanged_ method has been called');
      assert.isTrue(testEl_.verticalPositionChanged_.called,
          'verticalPositionChanged_ method has been called');
      assert.isTrue(testEl_.verticalPositionRelChanged_.called,
          'horizontalPosOffsetChanged_ method has been called');
      assert.isTrue(testEl_.verticalPosOffsetChanged_.called,
          'verticalPositionChanged_ method has been called');
      assert.isTrue(testEl_.wrappingStyleChanged_.called,
          'wrappingStyleChanged_ method has been called');
      assert.isTrue(testEl_.distanceFromTextChanged_.called,
        'distanceFromTextChanged_ method has been called');
      assert.isTrue(testEl_.relativeHeightChanged_.called,
        'relativeHeightChanged_ method has been called');
    });

    // TODO: Remove this Test once we start supporting editing header & footer
    it('should not select the drawing in header and footer', function() {
      sandbox_.stub(testEl_, 'isInHF_').returns(true);
      sandbox_.stub(testEl_, 'select');

      assert.isTrue(_.isFunction(testEl_.onTapHandler_));
      testEl_.onTapHandler_();
      assert.isFalse(testEl_.select.called);
    });

    it('should select the drawing that are not in header and footer',
        function() {
          sandbox_.stub(testEl_, 'isInHF_').returns(false);
          sandbox_.stub(testEl_, 'isValidClick_').returns(true);
          sandbox_.stub(testEl_, 'select');

          assert.isTrue(_.isFunction(testEl_.onTapHandler_));
          testEl_.onTapHandler_();
          assert.isTrue(testEl_.select.called);
        });
  });

  return {};
});
