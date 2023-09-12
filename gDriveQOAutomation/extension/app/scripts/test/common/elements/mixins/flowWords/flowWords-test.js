define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/flowWords'
], function(
  MixinUtils,
  QowtElement,
  FlowWords
  ) {
  'use strict';

  xdescribe('FlowWords algorithm', function() {
    before(function(){
      Polymer(MixinUtils.mergeMixin(
        QowtElement, FlowWords,
        { is: 'flow-words-test-element' }));
    });

    beforeEach(function() {
      this.stampOutTempl('flow-words-mixin-test-template');
    });

    it('should flow the text correctly', function() {
      runFlowTest_();
    });

    it('should flow the text correctly with multiple columns',
        function() {
      var container = document.getElementById('container');
      container.firstElementChild.style['-webkit-column-count'] = '2';
      runFlowTest_();
      container.firstElementChild.style['-webkit-column-count'] = '';
    });

    it('should reflow from more than one flowInto node if needed', function() {
      var run, flow1, flow2, flow3, flow4;
      var container = document.getElementById('container');
      container.boundingBox = function() {
        return {
          top: 0,
          left: 0,
          right: 10000,
          bottom: 10000,
          height: 10000,
          width: 10000
        };
      };
      run = document.createElement('flow-words-test-element');
      flow1 = run.createFlowInto();
      flow2 = flow1.createFlowInto();
      flow3 = flow2.createFlowInto();
      flow4 = flow3.createFlowInto();
      assert.strictEqual(
          run.flowLength(), 5,
          'flow length is correct');
      run.innerText = 'hello ';
      flow1.innerText = 'how ';
      flow2.innerText = 'are ';
      flow3.innerText = 'you ';
      flow4.innerText = 'doing?';
      run.flow(container);
      assert.strictEqual(
          run.innerText, 'hello how are you doing?',
          'all text');
      assert.strictEqual(
          run.flowLength(), 1,
          'flow length is correct');
      assert.isFalse(
          run.isFlowing(),
          'no longer flowing');
    });

    function runFlowTest_() {
      var container, testElement, originalTextLength,
          flowInto, total;
      container = document.getElementById('container');
      container.boundingBox = function() {
        return this.getBoundingClientRect();
      };
      testElement = container.firstElementChild;
      originalTextLength = testElement.textContent.length;
      assert.isTrue(
          testElement.getBoundingClientRect().bottom >
          container.boundingBox().bottom,
          'element too big');
      flowInto = testElement.createFlowInto();
      testElement.flow(container);
      assert.isTrue(
          testElement.getBoundingClientRect().bottom <=
          container.boundingBox().bottom,
          'element fits');
      assert.isTrue(
          testElement.textContent.length < originalTextLength,
          'flowed words');
      total = testElement.textContent.length + flowInto.textContent.length;
      assert.strictEqual(
          total, originalTextLength,
          'did not lose any text');
      testElement.unflow();
      assert.strictEqual(
          testElement.textContent.length, originalTextLength,
          'words back');
      assert.strictEqual(
          flowInto.textContent.length, 0,
          'flowInto empty');
      assert.isFalse(
          testElement.isFlowing(),
          'no longer flowing');
      assert.isUndefined(
          testElement.flowInto,
          'no more flowInto link');
      assert.isUndefined(
          flowInto.flowFrom,
          'no more flowFrom link');
    }
  });

  return {};
});
