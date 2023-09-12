define([
  'test/howToMockModules/moduleA'
  ], function(
    ModuleA) {

  describe('ModuleA', function() {

    it('should return the correct name', function() {
      assert.equal(ModuleA.getName(), 'ModuleA: foobar');
    });

    it('should return foobar as dep string', function() {
      assert.equal(ModuleA.getStringFromSingletonDependency(), 'foobar');
    });

  });

  return {};
});