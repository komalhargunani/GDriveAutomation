define([
  'qowtRoot/widgets/grid/floatingEditor'
], function(
    FloatingEditor) {

  'use strict';

  describe('A floating editor', function() {
    var rootNode_, floatingEditor_;

    beforeEach(function() {
      rootNode_ = document.createElement('div');
      document.body.appendChild(rootNode_);

      floatingEditor_ = FloatingEditor.create();
      floatingEditor_.appendTo(rootNode_);
    });


    afterEach(function() {
      document.body.removeChild(rootNode_);
      rootNode_ = undefined;
      floatingEditor_ = undefined;
    });


    it('should set and unset strikethrough formatting of the floating editor',
        function() {

          assert.isFalse(floatingEditor_.hasStrikethrough());
          floatingEditor_.setStrikethrough(true);

          assert.isTrue(floatingEditor_.hasStrikethrough());
          floatingEditor_.setStrikethrough(false);

          assert.isFalse(floatingEditor_.hasStrikethrough());
    });


    it('should have a resetTextFormatting() method which resets the ' +
        'formatting to strikethrough', function() {

          //ensure that the floating editor does not have any formatting.
          assert.isFalse(floatingEditor_.hasStrikethrough());
          assert.isFalse(floatingEditor_.hasBold());
          assert.isFalse(floatingEditor_.hasItalic());

          //set some formatting to the floating editor.
          floatingEditor_.setBoldness(true);
          floatingEditor_.setItalics(true);
          floatingEditor_.setStrikethrough(true);

          //ensure that the formatting is applied
          assert.isTrue(floatingEditor_.hasStrikethrough());
          assert.isTrue(floatingEditor_.hasBold());
          assert.isTrue(floatingEditor_.hasItalic());

          var formatting = {
            bld: false,
            itl: false,
            strikethrough: true
          };

          //reset the formatting to strikethrough.
          floatingEditor_.resetTextFormatting(formatting);
          assert.isTrue(floatingEditor_.hasStrikethrough());
          assert.isFalse(floatingEditor_.hasBold());
          assert.isFalse(floatingEditor_.hasItalic());
    });
  });
});