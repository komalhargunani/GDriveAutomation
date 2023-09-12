define(['qowtRoot/utils/converters/px2pt'], function(Px2Pt) {

  'use strict';

  describe('Bullet size mixin', function() {
    var testEl;

    beforeEach(function() {
      this.stampOutTempl('bullet-size-test-template');
      var td = this.getTestDiv();
      testEl = td.querySelector('#bullet-size-test-element');
    });

    afterEach(function() {
      testEl = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl.decorate, 'should have decorate function');
      assert.isFunction(testEl.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "bulletSizePoints"', function() {
      assert(testEl.supports('bulletSizePoints'), 'element supports typeface');
    });

    it('Should add support for "bulletSizeFollowText"', function() {
      assert(testEl.supports('bulletSizeFollowText'), 'element supports' +
          ' bulletSizeFollowText');
    });

    it('Should be possible to decorate bullet size in points', function() {
      var props = {
        bulletSizePoints: 4200
      };

      var propsUndecorate = {
        bulletSizeFollowText: true,
        bulletSizePoints: undefined
      };
      // Decorate and verify.
      testEl.decorate(props, true);
      var decs = testEl.getComputedDecorations();
      var propsApplied = {bulletSizeFollowText: false,
        bulletSizePercentage: undefined,
        bulletSizePoints: props.bulletSizePoints / 100};
      assert.deepEqual(decs, propsApplied, 'after decorate');
      var size = Px2Pt.pt2px(propsApplied.bulletSizePoints).toString() + 'px';
      var computedStylesBefore = window.getComputedStyle(testEl, 'before');
      assert.equal(computedStylesBefore.fontSize, size,
          'have a fontSize');

      // Undecorate and verify.
      testEl.decorate(propsUndecorate, true);
      decs = testEl.getComputedDecorations();
      propsApplied = {bulletSizeFollowText: true,
        bulletSizePercentage: undefined,
        bulletSizePoints: undefined};
      assert.deepEqual(decs, propsApplied, 'properties after undecorate');
    });

    it('Should be possible to decorate bullet size in percentage', function() {
      var mockedComputedStyle = {
        siz: 100
      };

      var props = {
        bulletSizePercentage: 1000
      };

      var propsUndecorate = {
        bulletSizePercentage: undefined,
        bulletSizeFollowText: true
      };

      var x = new QowtPointRun();
      x.textContent = 'some text';
      sinon.stub(x, 'getComputedDecorations').returns(mockedComputedStyle);

      while (testEl.hasChildNodes()) {
        testEl.removeChild(testEl.firstChild);
      }
      testEl.appendChild(x);

      // Decorate and verify.
      testEl.decorate(props, true);
      var decs = testEl.getComputedDecorations();
      var propsApplied = {bulletSizeFollowText: false,
        bulletSizePercentage: props.bulletSizePercentage,
        bulletSizePoints: undefined};
      assert.deepEqual(decs, propsApplied, 'after decorate');

      var textFontSize = parseInt(mockedComputedStyle.siz, 10);
      var computedStylesBefore = window.getComputedStyle(testEl, 'before');
      var bulletFontSize = parseInt(computedStylesBefore.fontSize, 10) / 1000;
      var bulletSizePercentage =
          parseInt((bulletFontSize * 100 / textFontSize), 10);
      assert.equal(bulletSizePercentage, props.bulletSizePercentage / 1000,
          'Bullet size applied correctly');

      // Undecorate and verify.
      testEl.decorate(propsUndecorate, true);
      decs = testEl.getComputedDecorations();

      propsApplied = {bulletSizeFollowText: true,
        bulletSizePercentage: undefined,
        bulletSizePoints: undefined};
      assert.deepEqual(decs, propsApplied, 'properties after undecorate');
    });

    it('Bullet should follow text size', function() {
      var mockedComputedStyle = {
        siz: 100
      };
      var props = {
        bulletSizeFollowText: true
      };

      var propsUndecorate = {
        bulletSizePoints: 7200,
        bulletSizeFollowText: false
      };
      var x = new QowtPointRun();
      x.textContent = 'some text';
      sinon.stub(x, 'getComputedDecorations').returns(mockedComputedStyle);

      while (testEl.hasChildNodes()) {
        testEl.removeChild(testEl.firstChild);
      }
      testEl.appendChild(x);

      // Decorate and verify.
      testEl.decorate(props, true);
      var decs = testEl.getComputedDecorations();

      assert.equal(decs.bulletSizeFollowText, true, 'properties after ' +
          'decorate');

      var fontSize = parseInt(Px2Pt.pt2px(mockedComputedStyle.siz), 10);
      var computedStylesBefore = window.getComputedStyle(testEl, 'before');
      var bulletFontSize = parseInt(computedStylesBefore.fontSize, 10);
      assert.equal(bulletFontSize, fontSize,
          'Bullet following text size');
      // Undecorate and verify.
      testEl.decorate(propsUndecorate, true);
      decs = testEl.getComputedDecorations();

      assert.equal(decs.bulletSizeFollowText, false, 'properties after ' +
          'undecorate');
      computedStylesBefore = window.getComputedStyle(testEl, 'before');
      var size = Px2Pt.pt2px(propsUndecorate.bulletSizePoints / 100).
          toString() + 'px';
      assert.equal(computedStylesBefore.fontSize, size,
          'have a fontSize based on bulletSizePoints');
    });
  });
  return {};
});
