define([
  'qowtRoot/errors/unique/outOfMemoryError',
  'qowtRoot/utils/i18n'
], function(
    OutOfMemoryError,
    I18n) {

  'use strict';

  describe('OutOfMemoryError', function() {
    it('should create OutOfMemoryError', function() {
      var oomError = new OutOfMemoryError();
      var title = 'out_of_memory_error_short_msg';
      var message = 'out_of_memory_error_msg';
      assert.equal(oomError.title, I18n.getMessage(title));
      assert.equal(oomError.details, I18n.getMessage(message));
      assert.equal(oomError.nonRecoverable, true);
      assert.equal(oomError.gaState, 'OutOfMemory');
      assert.equal(oomError.name, 'OutOfMemoryError');
    });
  });
});
