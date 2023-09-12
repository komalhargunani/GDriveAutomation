define([
  'test/howToMockModules/moduleB',
  'test/howToMockModules/foobar',
  ], function(
    ModuleB,
    Foobar) {

  describe('ModuleB', function() {

    beforeEach(function() {
      // NOTE: this example shows how to stub out the dependency of
      // one of our dependencies. This is to highlight that one can
      // mock/stub/spy anything really (as long as the requireJs module
      // does not do things "onLoad").
      // In reality, we should strive to just mock direct dependencies
      // but there are edge cases where one might want to stub out
      // deps of deps.
      sinon.stub(Foobar, 'getString', function() {
        return 'mocked foobar';
      });
    });

    afterEach(function() {
      Foobar.getString.restore();
    });

    it('should return the correct name', function() {
      assert.equal(ModuleB.getName(), 'ModuleB: undefined');
    });

    it('should return dep string from mock', function() {
      assert.equal(ModuleB.getStringFromSingletonDependency(), 'mocked foobar');
    });

  });

  return {};
});