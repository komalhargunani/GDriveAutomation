/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 * Mocha based unit test for the QOWT platform utility module.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/platform'], function(
  Platform) {

  'use strict';

  // JsHint does not like the ChaiJs expect format EG: expect(1).to.be.ok;
  // you should disable this check for tests that use this.
  /* jshint -W030 */

  describe('QOWT Platform Utility Module', function() {

    it('should provide platform.name', function() {
      expect(Platform.name).to.exist;
      expect(Platform.name).to.be.a('string');
      expect(Platform.name).to.not.be.empty;
    });

    it('should provide platform.locale', function() {
      expect(Platform.locale).to.exist;
      expect(Platform.locale).to.be.a('string');
      expect(Platform.locale).to.not.be.empty;
    });

    it('should provide platform type booleans, ' +
       'one of which should be true', function() {
      var bools = [
        Platform.isOther,
        Platform.isUnix,
        Platform.isWindows,
        Platform.isOsx,
        Platform.isLinux,
        Platform.isCros
      ];
      bools.forEach(function(prop) {
        expect(prop).to.exist;
        expect(prop).to.be.a('boolean');
      });
      expect(bools.filter(function(elm) {
        return elm;
      }).length).to.equal(1);
    });

  });

});
