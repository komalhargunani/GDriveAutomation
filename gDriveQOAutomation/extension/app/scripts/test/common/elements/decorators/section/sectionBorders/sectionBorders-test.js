define([
  'qowtRoot/utils/converters/converter'], function(
    Converter) {

  'use strict';

  describe('section borders mixin', function() {
    var sectionElm_, pageElm_, td;

    beforeEach(function() {
      this.stampOutTempl('section-borders-decorator-test-template');
      td = this.getTestDiv();
      sectionElm_ = td.querySelector('#section-test-element');
    });

    afterEach(function() {
      pageElm_ = undefined;
      sectionElm_ = undefined;
      td = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(sectionElm_.decorate, 'should have decorate function');
      assert.isFunction(sectionElm_.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "borders"', function() {
      assert(sectionElm_.supports('borders'),
          'element supports section bottom margin');
    });

    it('Should be possible to decorate section borders', function() {

      var props = {
        borders: {
          left: {
            style: 'solid',
            width: 8
          }
        }
      };

      var unset = {
        borders: {
          left: {
            style: 'none',
            width: 0
          }
        }
      };

      // Decorate and verify.
      sectionElm_.decorate(props, true);
      pageElm_ = td.querySelector('qowt-page');
      var borderNode = pageElm_.$.pageBorders;
      assert.equal(parseInt(borderNode.style.borderLeftWidth, 10),
          Converter.eighthpt2pt(props.borders.left.width), 'after decorate');
      assert.deepEqual(borderNode.style.borderLeftStyle,
          props.borders.left.style, 'after decorate');

      // Undecorate and verify.
      sectionElm_.decorate(unset, true);
      assert.equal(parseInt(borderNode.style.borderLeftWidth, 10),
          Converter.eighthpt2pt(unset.borders.left.width), 'after undecorate');
      assert.deepEqual(borderNode.style.borderLeftStyle,
          unset.borders.left.style, 'after undecorate');
    });
  });

  return {};
});
