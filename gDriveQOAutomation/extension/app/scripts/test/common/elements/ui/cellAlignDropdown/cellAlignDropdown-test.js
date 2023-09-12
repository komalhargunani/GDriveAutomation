require([
  'common/elements/ui/cellAlignDropdown/cellAlignDropdown'
],function(/* cellAlignDropdown*/) {

    'use strict';

    describe('Test QowtCellAlignDropdown Polymer Element', function() {

      var cellAlignDropdown;

      beforeEach(function() {
        cellAlignDropdown = new QowtCellAlignDropdown();
      });


      afterEach(function() {
        cellAlignDropdown = undefined;
      });


      it('should support Polymer constructor creation', function() {
        assert.isTrue(cellAlignDropdown instanceof QowtCellAlignDropdown,
            'dropdown should be instance of QowtCellAlignDropdown');
      });


      it('should have the value of \'cellAlign\' for id', function() {
        assert.strictEqual(cellAlignDropdown.id, 'cmd-cellAlign',
            'dropdown id should be cmd-cellAlign');
      });


      // TODO: Enable this once we have verbalization in place
//    it('should create the aria label on the cell align button', function() {
//      assert.strictEqual(cellAlignButton.getAttribute('aria-label'),
//        '_aria_spoken_word');
//    });

    });
  });
