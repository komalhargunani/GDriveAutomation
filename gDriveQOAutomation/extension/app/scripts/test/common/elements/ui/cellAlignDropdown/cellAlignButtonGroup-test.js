define([
  'common/elements/ui/cellAlignDropdown/cellAlignButtonGroup/' +
    'cellAlignButtonGroup'
], function(/* cellAlignButtonGroup */) {

  'use strict';

  describe('Test QowtCellAlignButtonGroup Polymer Element', function() {

    var cellAlignButtonGroup;

    beforeEach(function() {
      cellAlignButtonGroup = new QowtCellAlignButtonGroup();
    });


    afterEach(function() {
      cellAlignButtonGroup = undefined;
    });


    it('should support Polymer constructor creation', function() {
      assert.isTrue(cellAlignButtonGroup instanceof QowtCellAlignButtonGroup);
    });

    it('should have the value of \'cellAlign\' string for formatCode',
      function() {
        assert.strictEqual(cellAlignButtonGroup.formatCode, 'cellAlign',
            'formatCode should be cellAlign');
      });
  });
});
