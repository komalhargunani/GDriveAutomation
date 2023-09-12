/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/utils/idGenerator'
], function(
    IdGenerator) {

  'use strict';

  describe('utils/idGenerator.js tests', function() {

    it('should increment the generated id over successive calls.', function() {
      var id = IdGenerator.getUniqueId('ELM-', 1);
      expect(id).toBe('ELM-1');
      id = IdGenerator.getUniqueId('ELM-');
      expect(id).toBe('ELM-2');
      id = IdGenerator.getUniqueId('ELM-');
      expect(id).toBe('ELM-3');
    });

    it('should generate unique ids on every call', function() {
      var IDS_TO_GENERATE = 100;
      var PREFIX = 'uid_';
      var idList = {};
      var identifier;

      for (var idx = 0; idx < IDS_TO_GENERATE; idx++) {
        identifier = PREFIX + IdGenerator.getUniqueId();
        expect(idList.hasOwnProperty(identifier)).toBe(false);
        idList[identifier] = 1;
      }
    });

    it('should return just a number when called with no arguments', function() {
      var id = IdGenerator.getUniqueId();
      expect(id - id).toBe(0);
    });

    it('should return a prefixed number when called with a prefix string.',
       function() {
         var id = IdGenerator.getUniqueId('PREFIX');
         expect(id.substring(0, 6)).toBe('PREFIX');
         var numeral = id.substring(6);
         expect(numeral - numeral).toBe(0);
       });
  });
});
