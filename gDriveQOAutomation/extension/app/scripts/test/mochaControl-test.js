define([], function() {
  'use strict';
  /**
   * NOTE: this test is only here to verify that the Chai plugin is working
   * correctly, in that the assert and expect routines work. This is not testing
   * QOWT, the app, or the Array implementation
   */
  describe('Array', function(){
    describe('#indexOf()', function(){
      it('should return -1 when the value is not present', function(){
        // You can use assert
        assert.equal(-1, [1,2,3].indexOf(5));
        assert.equal(-1, [1,2,3].indexOf(0));
        // You can use expect
        expect([1,2,3].indexOf(5)).to.equal(-1);
        expect([1,2,3].indexOf(0)).to.equal(-1);
        // See http://chaijs.com/ for more information
      });
    });
  });
  return {};
});
