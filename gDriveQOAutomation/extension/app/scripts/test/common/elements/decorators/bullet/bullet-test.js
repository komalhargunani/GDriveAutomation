define([
  'qowtRoot/variants/utils/resourceLocator'
], function(ResourceLocator) {

  'use strict';

  describe('Bullet mixin', function() {
    var testEl, decs;

    beforeEach(function() {
      this.stampOutTempl('bullet-test-template');
      var td = this.getTestDiv();
      testEl = td.querySelector('#bullet-test-element');
    });

    afterEach(function() {
      testEl = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl.decorate, 'should have decorate function');
      assert.isFunction(testEl.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "type"', function() {
      assert(testEl.supports('type'), 'element supports type');
      assert(testEl.supports('char'), 'element supports type');
    });

    it('Should be possible to decorate a character bullet', function() {
      var props = {
        type: 'buChar',
        char: '•'
      };

      var unset = {
        type: 'buNone',
        char: undefined
      };

      // Decorate and verify.
      testEl.decorate(props, true);
      decs = testEl.getComputedDecorations();
      assert.deepEqual(decs, props, 'after decorate');
      var computedStylesBefore = window.getComputedStyle(testEl, 'before');
      var content = computedStylesBefore.content.replace(/'|"/g, '');
      assert.equal(content, props.char, 'have a bullet');
      assert.isTrue(testEl.classList.contains('list-type-buChar'),
          'has the buChar class in classList');

      // Undecorate and verify.
      testEl.decorate({type: undefined}, true);
      decs = testEl.getComputedDecorations();
      assert.deepEqual(decs, unset, 'properties after undecorate');
      computedStylesBefore = window.getComputedStyle(testEl, 'before');
      assert_oneOf(computedStylesBefore.content, ['', 'none'],
          'have no bullet');
      assert.isFalse(testEl.classList.contains('list-type-buChar'),
          'the buChar class is removed from the classList');
    });

    it('Should be possible to decorate a number bullet', function() {
      var props = {
        type: 'buAuto',
        char: undefined
      };

      var unset = {
        type: 'buNone',
        char: undefined
      };

      // Decorate and verify.
      testEl.decorate(props, true);
      decs = testEl.getComputedDecorations();
      assert.deepEqual(decs, props, 'after decorate');
      var computedStylesBefore = window.getComputedStyle(testEl, 'before');
      var content = computedStylesBefore.content;
      assert.isNotNull(content.match(/counter/), 'have a counter');
      var expected = 'qowt-lc-1 0 qowt-lc-2 0 qowt-lc-3 0 qowt-lc-4 0 ' +
          'qowt-lc-5 0 qowt-lc-6 0 qowt-lc-7 0 qowt-lc-8 0 qowt-lc-9 0';
      assert.equal(testEl.style.counterReset, expected, 'reset other levels');
      assert.isTrue(testEl.classList.contains('list-type-buAuto'),
          'has the buAuto class in classList');

      // Undecorate and verify.
      testEl.decorate({type: undefined}, true);
      decs = testEl.getComputedDecorations();
      assert.deepEqual(decs, unset, 'properties after undecorate');
      computedStylesBefore = window.getComputedStyle(testEl, 'before');
      assert_oneOf(computedStylesBefore.content, ['', 'none'],
          'have no bullet');
      assert.equal(testEl.style.counterReset, '', 'does not reset counters');
      assert.isFalse(testEl.classList.contains('list-type-buAuto'),
          'the buAuto class is removed from the classList');
    });

    it('Should be possible to decorate a bullet with buNone', function() {
      var props = {
        type: 'buNone',
        char: undefined
      };

      // Decorate and verify.
      testEl.decorate(props, true);
      decs = testEl.getComputedDecorations();
      assert.deepEqual(decs, props, ' after decorate');
      assert.isTrue(testEl.classList.contains('list-type-buNone'),
          'has the buNone class in classList');

      // Undecorate and verify.
      testEl.decorate({type: undefined}, true);
      decs = testEl.getComputedDecorations();
      assert.deepEqual(decs, props, 'properties after undecorate');
      assert.isFalse(testEl.classList.contains('list-type-buNone'),
          'the buNone class is removed from the classList');
    });

    it('should be possible to decorate a bullet with buBlip', function() {
      var props = {
        type: 'buBlip',
        buImg: {
          src: 'some location'
        }
      };
      var unset = {
        type: 'buNone',
        char: undefined
      };
      sinon.stub(ResourceLocator, 'pathToUrl').returns('some location');
      testEl.style.fontSize = '10px';

      // Decorate and verify.
      testEl.decorate(props, true);
      decs = testEl.getComputedDecorations();
      var computedStylesBefore = window.getComputedStyle(testEl, 'before');

      assert.equal(decs.type, props.type, ' after decorate');
      assert.isTrue(testEl.classList.contains('list-type-buBlip'),
          'has the buBlip class in classList');
      assert.isTrue(ResourceLocator.pathToUrl.calledOnce,
          'ResourceLocator.pathToUrl called once by create');
      assert.isDefined(computedStylesBefore['background-image']);
      assert.equal(computedStylesBefore['background-repeat'],
          'no-repeat', 'have background-repeat as none');
      assert.equal(computedStylesBefore['background-size'], '10px 10px',
          'have background-size');

      // Undecorate and verify.
      testEl.decorate({type: undefined}, true);
      decs = testEl.getComputedDecorations();
      computedStylesBefore = window.getComputedStyle(testEl, 'before');

      assert.deepEqual(decs, unset, 'properties after undecorate');
      computedStylesBefore = window.getComputedStyle(testEl, 'before');
      assert_oneOf(computedStylesBefore.content, ['', 'none'],
          'have no bullet');
      assert.isFalse(testEl.classList.contains('list-type-buBlip'),
          'the buBlip class is removed from the classList');
      assert.equal(computedStylesBefore['background-image'], 'none',
          'have background-repeat as none');
      assert.equal(computedStylesBefore['background-repeat'], 'repeat',
          'have background-repeat as none');
      assert.equal(computedStylesBefore['background-size'], 'auto',
          'have background-size');
      assert.isFalse(ResourceLocator.pathToUrl.calledTwice,
          'ResourceLocator.pathToUrl should not called');
      ResourceLocator.pathToUrl.restore();
    });
  });


  /**
   * TODO(umesh.kadam) : This is temporary, and should be expunged once the
   * chai library is updated.
   *
   * @param {!Object} valToFind - value to be found in the list
   * @param {Array} list - list of values
   * @param {String} message - error msg
   */
  function assert_oneOf(valToFind, list, message) {
    var isInList = _.some(list, function(val) {
      return val === valToFind;
    });
    if (!isInList) {
      throw (new Error(message + ': Expected : ' + valToFind +
          ' to be one of : ' + JSON.stringify(list)));
    }
  }

  return {};

});
