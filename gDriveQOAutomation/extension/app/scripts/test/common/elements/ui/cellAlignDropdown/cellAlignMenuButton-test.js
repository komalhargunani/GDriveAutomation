require([
  'common/elements/ui/cellAlignDropdown/cellAlignMenuButton'
],function(/* cellAlignMenuButton*/) {

    'use strict';

    describe('QowtCellAlignMenuButton Polymer Element', function() {

      var cellAlignMenuButton;

      beforeEach(function() {
        cellAlignMenuButton = new QowtCellAlignMenuButton();
      });


      afterEach(function() {
        cellAlignMenuButton = undefined;
      });

      it('should support Polymer constructor creation', function() {
        assert.isTrue(cellAlignMenuButton instanceof QowtCellAlignMenuButton,
            'button should be instance of QowtCellAlignMenuButton');
      });
    });
  });
