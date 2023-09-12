describe('core-platform-info', function() {
  var api;

  beforeEach(function() {
    api = window.__polymer_core_platform_info;
  });

  it('should be available on the global object', function() {
    assert.isObject(window.__polymer_core_platform_info,
        'platform info is a global object.');
  });

  it('should be frozen', function() {
    assert.isTrue(Object.isFrozen(window.__polymer_core_platform_info),
        'core-platform-info should be frozen.');
  });

  it('should return non-null descriptive OS name and locale.', function() {
    assertHasNonEmptyStringProperties(api, ['name', 'locale']);
  });

  it('should have boolean OS query properties', function() {
    assertHasBooleanProperties(api, [
        'isOther', 'isUnix', 'isWindows', 'isOsx', 'isLinux', 'isCros']);
  });

  function assertHasNonEmptyStringProperties(obj, propertyList) {
    propertyList.forEach(function(propertyName) {
      assertApiHasProperty(obj, propertyName);
      var result = obj[propertyName];
      assert.isString(result);
      assert.notEqual(result, '', propertyName + ' name cannot be empty');
    });
  }

  function assertHasBooleanProperties(obj, propertyList) {
    propertyList.forEach(function(propertyName) {
      assertApiHasProperty(obj, propertyName);
      assert.isBoolean(obj[propertyName],
          propertyName + ' should give a boolean value.');
    });
  }

  function assertApiHasProperty(obj, property) {
    assert.property(obj, property, 'core-platform-info');
  }
});
