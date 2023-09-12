define([], function() {

  'use strict';

  describe('Bullet color mixin', function() {
    var testEl;

    beforeEach(function() {
      this.stampOutTempl('bullet-color-test-template');
      var td = this.getTestDiv();
      testEl = td.querySelector('#bullet-color-test-element');
    });

    afterEach(function() {
      testEl = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl.decorate, 'should have decorate function');
      assert.isFunction(testEl.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "bulletColor"', function() {
      assert(testEl.supports('bulletColor'), 'element supports color');
    });

    it('Should be possible to decorate bullet color', function() {
      var props = {
        bulletColor: {
          type: 'srgbClr',
          clr: '#ff0000'
        }
      };
      var defaultColorRule = 'rgb(123, 234, 213)';
      var expectedColorRule = 'rgb(255, 0, 0)';

      // Decorate and verify.
      testEl.decorate(props, true);
      var decs = testEl.getComputedDecorations();
      assert.equal(decs.bulletColor, expectedColorRule, 'after decorate');

      var computedStylesBefore = window.getComputedStyle(testEl, 'before');
      assert.equal(computedStylesBefore.color, expectedColorRule,
          'have a colorFamily');

      // Undecorate and verify.
      props = {
        bulletColor: undefined
      };
      testEl.decorate(props, true);
      decs = testEl.getComputedDecorations();
      assert.equal(decs.bulletColor, defaultColorRule,
          'properties after undecorate');
      computedStylesBefore = window.getComputedStyle(testEl, 'before');
      assert.equal(computedStylesBefore.color, defaultColorRule,
          'have a default colorFamily');
    });

    it('Should add support for "bulletColorFollowText"', function() {
      assert(testEl.supports('bulletColorFollowText'),
          'element supports bulletColorFollowText');
    });

    it('Should be possible to decorate bullet color for bulletColorFollowText',
        function() {
          var span = new QowtPointRun();
          span.style.color = 'rgb(255, 0, 0)';
          var expectedColorRule = 'rgb(255, 0, 0)',
              props = {
                bulletColorFollowText: true
              };

          while (testEl.hasChildNodes()) {
            testEl.removeChild(testEl.firstChild);
          }
          // Decorate, append new span and then verify
          testEl.decorate(props, true);
          testEl.appendChild(span);
          testEl.observeFirstRun_();

          var decs = testEl.getComputedDecorations();
          assert.equal(decs.bulletColorFollowText, true, 'after decorate');

          var computedStylesBefore = window.getComputedStyle(testEl, 'before');
          assert.equal(computedStylesBefore.color, expectedColorRule,
              'have a expected color');

          // Undecorate and verify.
          props = {
            bulletColorFollowText: undefined
          };
          testEl.decorate(props, true);
          decs = testEl.getComputedDecorations();
          assert.equal(decs.bulletColorFollowText, false,
              'properties after undecorate');
          computedStylesBefore = window.getComputedStyle(testEl, 'before');
          assert.equal(computedStylesBefore.color, expectedColorRule,
              'have a expected color');
        });
  });
  return {};
});
