define([
  'qowtRoot/widgets/grid/sysClipboard'
], function(
    SysClipboard) {

  'use strict';

  describe('The sheet system clipboard widget', function() {

    var sandbox;
    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      sandbox.stub(document, 'createElement', function() {
        return {
          select: function(){},
          blur: function(){}
        };
      });
      SysClipboard.init();
    });

    afterEach(function() {
      sandbox.restore();
      SysClipboard.destroy();
    });

    it('should remove all selection ranges after copy/cut operation',
        function() {
      sandbox.spy(window.getSelection(), 'removeAllRanges');
      SysClipboard.copyCellContent();
      sinon.assert.called(window.getSelection().removeAllRanges);
    });

    it('should remove all selection ranges after paste operation', function() {
      sandbox.spy(window.getSelection(), 'removeAllRanges');
      SysClipboard.getContents();
      sinon.assert.called(window.getSelection().removeAllRanges);
    });
  });
});

