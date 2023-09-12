require([
    'common/elements/customSelector'
    ],
  function(
    CustomSelector
    ) {

  'use strict';

  describe('qowt-toggle-item element', function() {
    var item;
    var styledElement;

    beforeEach(function() {
      this.stampOutTempl('qowt-toggle-item-test-template');
      item = this.getTestDiv().querySelector('qowt-toggle-item');

      styledElement = document.createElement('span');
      styledElement.getComputedDecorations = function() {
        return {bld: (styledElement.style.fontWeight === 'bold')};
      };
    });

    it('should have the correct prototype chain', function() {
      assert.instanceOf(item, QowtToggleItem, 'is a qowt-toggle-item');
    });

    it('should not be set initially', function() {
      assert.isFalse(item.active, 'should not be set');
    });

    it('should return a correct config from a good configId and state false.',
        function() {
          assert.deepEqual(item.config, {
            action: 'bold',
            context: {
              formatting: {bld: false}}}, 'false bold config');
        });

    it('should return a correct config after a set change to true.',
        function() {
          item.active = true;
          assert.deepEqual(item.config, {
            action: 'bold',
            context: {
              formatting: {bld: true}}}, 'true bold config');
        });

    it('should not include changes to the returned config object in ' +
        ' subsequent get of config.', function() {
      var firstConfig = item.config;
      var secondConfig;
      firstConfig.newPropertyX = 'foo';
      firstConfig.context.formatting = 32;
      secondConfig = item.config;
      assert.isObject(secondConfig.context.formatting);
      assert.deepEqual(secondConfig.context.formatting, {bld: false});
      assert.isUndefined(secondConfig.newPropertyX);
    });

    it('should set model true when triggered with a bold styled element',
        function() {
      assert.isFalse(item.active, 'initially non-bold');
      styledElement.style.fontWeight = 'bold';
      testToggleHandlerWithElement(styledElement);
      assert.isTrue(item.active, 'expect bold set to true');
    });

    it('should set model false when triggered with a non-bold styled element.',
        function() {
      item.active = true;
      styledElement.style.fontWeight = 'normal';
      testToggleHandlerWithElement(styledElement);
      assert.isFalse(item.active, 'expect bold set to false');
    });

    it('should reenable a disabled item when triggered with a supporting ' +
        'element', function() {
      item.disabled = true;
      styledElement.style.fontWeight = 'normal';
      testToggleHandlerWithElement(styledElement);
      assert.isFalse(item.disabled, 'disabled');
    });

    // TODO(dskelton) Renable the test below when this blocking issue has
    // been resolved. See qowt-toggle-item.js
    // https://code.google.com/p/chromium/issues/detail?id=434451
    // it('should set item disabled when triggered with an element that ' +
    //     'has no bold support.', function() {
    //   assert.isFalse(item.disabled, 'initially enabled');
    //   testToggleHandlerWithElement(undefined);
    //   assert.isTrue(item.disabled, 'unsupported actions');
    //   assert.isFalse(item.set, 'unchanged state');
    // });

    function testToggleHandlerWithElement(stubElement) {
      sinon.stub(CustomSelector, 'findInSelectionChain').returns(stubElement);
      item.toggleHandler_('unused signal', {});
      CustomSelector.findInSelectionChain.restore();
    }
  });
});
