require([
  'common/elements/ui/justifyButtons/justifyButtonGroup/justifyButtonGroup'],
  function(/* justify button group itself */) {

  'use strict';

  describe('QowtJustifyButtonGroup Polymer Element', function() {

    var justifyButtonGroup;

    beforeEach(function() {
      justifyButtonGroup = new QowtJustifyButtonGroup();
    });
    afterEach(function() {
      justifyButtonGroup = undefined;
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(justifyButtonGroup instanceof QowtJustifyButtonGroup,
          'button group is QowtJustifyButtonGroup');
    });

    it('should have the value of \'jus\' string for formatCode', function() {
      assert.strictEqual(
          justifyButtonGroup.formatCode, 'jus', 'formatCode is jus');
    });

    it('should activate the child justify button with the given alignment',
        function() {
      var alignment = 'R';
      justifyButtonGroup.setActive(alignment);
      assert.isFalse(
          justifyButtonGroup.querySelector('#cmd-textAlignLeft').active,
          'left justify button inactive');
      assert.isFalse(
          justifyButtonGroup.querySelector('#cmd-textAlignCenter').active,
          'center justify button inactive');
      assert.isTrue(
          justifyButtonGroup.querySelector('#cmd-textAlignRight').active,
          'right justify button active');
      assert.isFalse(
          justifyButtonGroup.querySelector('#cmd-textAlignJustify').active,
          'full justify button inactive');
    });

    it('should activate the left justify button by default',
        function() {
      var alignment = null;
      justifyButtonGroup.setActive(alignment);
      assert.isTrue(
          justifyButtonGroup.querySelector('#cmd-textAlignLeft').active,
          'left justify button inactive');
      assert.isFalse
          (justifyButtonGroup.querySelector('#cmd-textAlignCenter').active,
          'center justify button inactive');
      assert.isFalse(
          justifyButtonGroup.querySelector('#cmd-textAlignRight').active,
          'right justify button active');
      assert.isFalse(
          justifyButtonGroup.querySelector('#cmd-textAlignJustify').active,
          'full justify button inactive');
    });
  });
});