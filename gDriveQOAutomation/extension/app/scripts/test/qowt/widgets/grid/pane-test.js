define([
  'qowtRoot/widgets/grid/colHeaderContainer',
  'qowtRoot/widgets/grid/pane',
  'qowtRoot/widgets/grid/rowHeaderContainer'
], function(
    ColHeaderContainer,
    Pane,
    RowHeaderContainer) {

  'use strict';

  describe('A pane widget', function() {

    var sandbox_;

    beforeEach(function() {
      sandbox_ = sinon.sandbox.create();
      ColHeaderContainer.init();
      RowHeaderContainer.init();
    });

    afterEach(function() {
      ColHeaderContainer.destroy();
      RowHeaderContainer.destroy();
      sandbox_.restore();
    });

    it('should delegate the call to floating editor when ' +
        'strikethroughOptimistically is called on the pane' , function() {
         var rootNode = document.createElement('div');
         var pane = Pane.create(rootNode, true);
         var floatingEditor = pane.getFloatingEditor();
         sinon.stub(floatingEditor, 'setStrikethrough');

         pane.setCellStrikethroughOptimistically();
         assert.isTrue(floatingEditor.setStrikethrough.called);
    });
  });
});
