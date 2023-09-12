define([], function() {

  'use strict';

  describe('QowtToolTip Polymer Element', function() {

    var toolTip, testDiv;
    beforeEach(function() {
      this.stampOutTempl('qowt-tool-tip-test-template');
      testDiv = this.getTestDiv();
      toolTip = testDiv.querySelector('#testToolTip');
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(toolTip instanceof QowtToolTip,
          'toolTip is QowtToolTip');
    });

    it('should visible the toolTip when user mouse hover on a button',
        function() {
          var button = {
            name: 'underline',
            dimensions: toolTip.getBoundingClientRect()
          };

          toolTip.show(button);
          assert.strictEqual(toolTip.style.visibility, 'visible',
              'toolTip is visible');
        });

    it('should hide the toolTip when user mouse out on a button',
        function() {
          toolTip.hide();
          assert.strictEqual(toolTip.style.visibility, 'hidden',
              'toolTip is invisible');
        });

    it('should show toolTip pointer heads when tooltip is shown',
        function() {
          var dummyHostDimensions = {
            bottom: 25,
            left: 8,
            width: 16
          };
          var button = {
            name: 'underline',
            dimensions: dummyHostDimensions
          };
          toolTip.show(button);
          // Check left and top properties applied to toolTip pointer heads
          assert.strictEqual(toolTip.customStyle["--left-pos"], '16px;',
              'Custom property --left-pos applied');
          assert.strictEqual(toolTip.customStyle["--top-pos"], '25px;',
              'Custom property --top-pos applied');
        });
  });
});
