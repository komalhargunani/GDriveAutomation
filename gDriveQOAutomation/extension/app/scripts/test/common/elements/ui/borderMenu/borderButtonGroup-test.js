require([
  'common/elements/ui/borderMenu/borderButtonGroup/borderButtonGroup'
], function(/* border button group itself */) {

  'use strict';

  describe('QowtBorderButtonGroup Polymer Element', function() {

    var borderButtonGroup;

    beforeEach(function() {
      borderButtonGroup = new QowtBorderButtonGroup();
    });

    afterEach(function() {
      borderButtonGroup = undefined;
    });

    it('should support Polymer constructor creation', function() {
      assert.isTrue(borderButtonGroup instanceof QowtBorderButtonGroup,
        'border button is QowtBorderButtonGroup');
    });

    it('should have the value of \'borders\' string for formatCode',
      function() {
      assert.strictEqual(borderButtonGroup.formatCode, 'borders',
        'formatCode is borders');
    });
  });
});
