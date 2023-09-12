define([], function() {

  'use strict';

  describe('tab stop mixin', function() {
    var testElm_, td_, officeStyles;

    beforeEach(function() {
      officeStyles = new QowtOfficeStyles();
      document.body.appendChild(officeStyles);
      officeStyles.reset();
      this.stampOutTempl('tab-stop-decorator-test-template');
      td_ = this.getTestDiv();
      testElm_ = td_.querySelector('#testElement');
    });

    afterEach(function() {
      officeStyles.remove();
      testElm_ = undefined;
      td_ = undefined;
      officeStyles = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testElm_.decorate, 'should have decorate function');
      assert.isFunction(testElm_.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "tabs"', function() {
      assert(testElm_.supports('tabs'), 'element supports tab stop');
    });

    it('Should be possible to decorate tab stop', function() {

      var props = {
        tabs:[{
          "align":"left",
          "pos":288}
        ]
      };

      // Decorate and verify.
      testElm_.decorate(props, true);
      var tab = testElm_.querySelector('span[qowt-runtype="qowt-tab"]');
      assert.isDefined(tab.style.paddingLeft, 'padding left to be defined');
      assert.isNumber(parseInt(tab.style.paddingLeft, 10), 'after decorate');
    });
  });

  return {};
});
