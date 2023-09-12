require([
  'common/elements/ui/cellAlignDropdown/cellAlignButton/cellAlignButton'
], function(/* cellAlignButton*/) {

  'use strict';

  describe('Test QowtCellAlignButton Polymer Element', function() {

    var cellAlignButton;

    beforeEach(function() {
      cellAlignButton = new QowtCellAlignButton();
    });

    afterEach(function() {
      cellAlignButton = undefined;
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(cellAlignButton instanceof QowtCellAlignButton,
          'button should be instance of QowtCellAlignButton');
    });

    it('should have the value of empty string for action', function() {
      assert.strictEqual(cellAlignButton.action, '',
          'action should be empty string');
    });

    it('should have the value of \'cellAlign\' string for formatCode',
      function() {
        assert.strictEqual(cellAlignButton.formatCode, 'cellAlign',
            'formatCode should be cellAlign');
      });

    it('should set formatting when button is active', function() {
      var formatting = {};
      cellAlignButton.setFormattingByButtonState_(formatting, true);
      assert.isTrue('cellAlign' in formatting, 'formatting has cellAlign');
    });
  });
});
