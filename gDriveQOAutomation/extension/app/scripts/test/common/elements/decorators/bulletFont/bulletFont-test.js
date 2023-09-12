define([], function() {

  'use strict';

  describe('Bullet font mixin', function() {
    var testEl;

    beforeEach(function() {
      this.stampOutTempl('bullet-font-test-template');
      var td = this.getTestDiv();
      testEl = td.querySelector('#bullet-font-test-element');
    });

    afterEach(function() {
      testEl = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl.decorate, 'should have decorate function');
      assert.isFunction(testEl.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "bulletFont" and "bulletFontFollowText"',
        function() {
          assert(testEl.supports('bulletFont'), 'element supports bulletFont');
          assert(testEl.supports('bulletFontFollowText'),
              'element supports bulletFontFollowText');
        });

    it('Should be possible to decorate bullet font', function() {
      var props = {
        bulletFont: 'fake'
      };

      var defaultBulletStyle = {
        bulletFont: 'Calibri'
      };
      // Decorate and verify.
      testEl.decorate(props, true);
      var decs = testEl.getComputedDecorations();
      assert.deepEqual(decs.bulletFont, props.bulletFont, 'after decorate');
      var computedStylesBefore = window.getComputedStyle(testEl, 'before');
      assert.equal(computedStylesBefore.fontFamily, 'fake',
          'have a fontFamily');

      // Undecorate and verify.
      testEl.decorate({bulletFont: undefined}, true);
      decs = testEl.getComputedDecorations();
      assert.deepEqual(decs.bulletFont, defaultBulletStyle.bulletFont,
          'properties after undecorate');
      computedStylesBefore = window.getComputedStyle(testEl, 'before');
      assert.equal(computedStylesBefore.fontFamily,
          defaultBulletStyle.bulletFont, 'have a default fontFamily');
    });

    it('Should be possible to decorate bullet font for bulletFontFollowText',
        function() {
          var props = {
            bulletFontFollowText: true
          };

          var mockedComputedStyle = {
            font: 'Calibri'
          };

          var span = new QowtPointRun();
          span.textContent = 'some text';
          sinon.stub(span, 'getComputedDecorations').
              returns(mockedComputedStyle);

          while (testEl.hasChildNodes()) {
            testEl.removeChild(testEl.firstChild);
          }
          testEl.appendChild(span);

          // Decorate and verify.
          testEl.decorate(props, true);
          testEl.observeFirstRun_();
          var decs = testEl.getComputedDecorations();
          assert.deepEqual(decs.bulletFont, mockedComputedStyle.font,
              'after decorate');
          var computedStylesBefore =
              window.getComputedStyle(testEl, 'before');
          assert.equal(computedStylesBefore.fontFamily,
              mockedComputedStyle.font, 'have first runs fontFamily');

          // Undecorate and verify.
          props.bulletFontFollowText = undefined;
          props.bulletFont = 'fake';
          testEl.decorate(props, true);
          decs = testEl.getComputedDecorations();
          assert.deepEqual(decs.bulletFont, props.bulletFont,
              'properties after undecorate');
          computedStylesBefore = window.getComputedStyle(testEl, 'before');
          assert.equal(computedStylesBefore.fontFamily, props.bulletFont,
              'have explicit fontFamily');
          span.getComputedDecorations.restore();
        });

    it('Should decorate numbered bullet with first runs font', function() {
      testEl.classList.add('list-type-buAuto');
      var props = {
        bulletFont: 'fake'
      };

      var mockedComputedStyle = {
        font: 'Calibri'
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
      testEl.observeFirstRun_();
      var decs = testEl.getComputedDecorations();
      assert.deepEqual(decs.bulletFont, mockedComputedStyle.font,
          'after decorate');
      var computedStylesBefore = window.getComputedStyle(testEl, 'before');
      assert.equal(computedStylesBefore.fontFamily,
          mockedComputedStyle.font, 'have first runs fontFamily');

      // Undecorate and verify.
      testEl.decorate({bulletFont: undefined}, true);
      testEl.observeFirstRun_();
      decs = testEl.getComputedDecorations();
      assert.deepEqual(decs.bulletFont, mockedComputedStyle.font,
          'properties after undecorate');
      computedStylesBefore = window.getComputedStyle(testEl, 'before');
      assert.equal(computedStylesBefore.fontFamily,
          mockedComputedStyle.font, 'have first runs fontFamily');
      x.getComputedDecorations.restore();
    });
  });
  return {};
});
