/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/dcp/decorators/backgroundDecorator'
], function(BackgroundDecorator) {

  'use strict';

  describe('background decorator ', function() {
    var _domNode, _decorator;

    beforeEach(function() {
      _domNode = document.createElement('SPAN');
      _decorator = BackgroundDecorator.create(_domNode);
    });

    afterEach(function() {
      _domNode = undefined;
      _decorator = undefined;
    });

    it('should ignore an undefined color', function() {
      var color;
      _decorator.decorate(color);
      expect(_domNode.style.backgroundColor).toBe('');
    });

    it('should set the background color if present in dcp', function() {
      var color = '#00FF00';
      _decorator.decorate(color);
      expect(_domNode.style.backgroundColor).toBe('rgb(0, 255, 0)');

    });

    it('should unset the background color if undecorate is called', function() {
      // (1) Verify the INITIAL unset status
      expect(_domNode.style.backgroundColor).toBe('');

      // (2) Verify if the SET works ok
      var color = '#00FF00';
      _decorator.decorate(color);
      expect(_domNode.style.backgroundColor).toBe('rgb(0, 255, 0)');

      // (3) Now verify if the UNSET works ok
      _decorator.undecorate();
      expect(_domNode.style.backgroundColor).toBe('');
    });
  });
});
