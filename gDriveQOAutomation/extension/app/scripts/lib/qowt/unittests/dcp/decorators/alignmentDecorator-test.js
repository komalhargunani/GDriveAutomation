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
  'qowtRoot/dcp/decorators/alignmentDecorator'
], function(AlignmentDecorator) {

  'use strict';

  describe('alignment decorator ', function() {
    var _domNode, _decorator;

    beforeEach(function() {
      _domNode = document.createElement('DIV');
      _decorator = AlignmentDecorator.create(_domNode);
    });

    afterEach(function() {
      _domNode = undefined;
      _decorator = undefined;
    });

    it('should ignore dcp that contains no alignment information', function() {
      var horizontalAlignment,
          verticalAlignment;

      _decorator.decorate(horizontalAlignment, verticalAlignment);

      expect(_domNode.className).not.toMatch('.*qowt-horizontal-align-.*');
      expect(_domNode.className).not.toMatch('.*qowt-vertical-align-.*');
    });

    it('should ignore dcp that contains erroneous alignment information',
        function() {
          var horizontalAlignment = 'blah';
          var verticalAlignment = 'blah blah';

          _decorator.decorate(horizontalAlignment, verticalAlignment);

          expect(_domNode.className).not.toMatch('.*qowt-horizontal-align-.*');
          expect(_domNode.className).not.toMatch('.*qowt-vertical-align-.*');
        });

    it('should set horizontal alignment LEFT if present in dcp', function() {
      var horizontalAlignment = 'left';
      var verticalAlignment;

      _decorator.decorate(horizontalAlignment, verticalAlignment);

      expect(_domNode.className).toMatch('.*qowt-horizontal-align-left.*');
      expect(_domNode.className).not.toMatch('.*qowt-vertical-align-.*');
    });

    it('should set horizontal alignment RIGHT if present in dcp', function() {
      var horizontalAlignment = 'right';
      var verticalAlignment;

      _decorator.decorate(horizontalAlignment, verticalAlignment);

      expect(_domNode.className).toMatch('.*qowt-horizontal-align-right.*');
      expect(_domNode.className).not.toMatch('.*qowt-vertical-align-.*');
    });

    it('should set horizontal alignment CENTRE if present in dcp', function() {
      var horizontalAlignment = 'centre';
      var verticalAlignment;

      _decorator.decorate(horizontalAlignment, verticalAlignment);

      expect(_domNode.className).toMatch('.*qowt-horizontal-align-center.*');
      expect(_domNode.className).not.toMatch('.*qowt-vertical-align-.*');
    });

    it('should set horizontal alignment JUSTIFIED if present in dcp',
        function() {
          var horizontalAlignment = 'justified';
          var verticalAlignment;

          _decorator.decorate(horizontalAlignment, verticalAlignment);

          expect(_domNode.className).
              toMatch('.*qowt-horizontal-align-justify.*');
          expect(_domNode.className).not.toMatch('.*qowt-vertical-align-.*');
        });

    it('should set vertical alignment TOP if present in dcp', function() {
      var horizontalAlignment;
      var verticalAlignment = 'top';

      _decorator.decorate(horizontalAlignment, verticalAlignment);

      expect(_domNode.className).not.toMatch('.*qowt-horizontal-align-.*');
      expect(_domNode.className).toMatch('.*qowt-vertical-align-top.*');
    });

    it('should set vertical alignment CENTRE if present in dcp', function() {
      var horizontalAlignment;
      var verticalAlignment = 'centre';

      _decorator.decorate(horizontalAlignment, verticalAlignment);

      expect(_domNode.className).not.toMatch('.*qowt-horizontal-align-.*');
      expect(_domNode.className).toMatch('.*qowt-vertical-align-center.*');
    });

    it('should set vertical alignment BOTTOM if present in dcp', function() {
      var horizontalAlignment;
      var verticalAlignment = 'bottom';

      _decorator.decorate(horizontalAlignment, verticalAlignment);

      expect(_domNode.className).not.toMatch('.*qowt-horizontal-align-.*');
      expect(_domNode.className).toMatch('.*qowt-vertical-align-bottom.*');
    });

    it('should set a random combination of alignment settings if present ' +
        'in dcp', function() {
          var horizontalAlignment = 'right';
          var verticalAlignment = 'bottom';

          _decorator.decorate(horizontalAlignment, verticalAlignment);

          expect(_domNode.className).toMatch('.*qowt-horizontal-align-right.*');
          expect(_domNode.className).toMatch('.*qowt-vertical-align-bottom.*');
        });

    it('should overwrite previous alignment settings', function() {
      // set alignment first
      var horizontalAlignment = 'right';
      var verticalAlignment = 'bottom';

      _decorator.decorate(horizontalAlignment, verticalAlignment);

      expect(_domNode.classList.contains('qowt-horizontal-align-right')).toBe(
          true);
      expect(_domNode.classList.contains('qowt-vertical-align-bottom')).toBe(
          true);

      // now try updating alignment
      horizontalAlignment = 'left';
      verticalAlignment = 'top';

      _decorator.decorate(horizontalAlignment, verticalAlignment);

      expect(_domNode.classList.contains('qowt-horizontal-align-right')).
          toBe(false);
      expect(_domNode.classList.contains('qowt-vertical-align-bottom')).
          toBe(false);
      expect(_domNode.classList.contains('qowt-horizontal-align-left')).
          toBe(true);
      expect(_domNode.classList.contains('qowt-vertical-align-top')).toBe(true);
    });

    it('should have an undecorate() method which undecorates the node',
        function() {
          var horizontalAlignment = 'right';
          var verticalAlignment = 'bottom';

          _decorator.decorate(horizontalAlignment, verticalAlignment);

          expect(_domNode.className).toMatch('.*qowt-horizontal-align-right.*');
          expect(_domNode.className).toMatch('.*qowt-vertical-align-bottom.*');

          _decorator.undecorate();

          expect(_domNode.className).toMatch('');
          expect(_domNode.className).toMatch('');
       });

    it('should have a setHorizontalAlignment() method which sets the ' +
        'horizontal alignment', function() {
          var horizontalAlignment = 'left';
          _decorator.setHorizontalAlignment(horizontalAlignment);
          expect(_domNode.className).toMatch('.*qowt-horizontal-align-left.*');
        });

    it('should have a setVerticalAlignment() method which sets the vertical ' +
        'alignment', function() {
          var verticalAlignment = 'bottom';
          _decorator.setVerticalAlignment(verticalAlignment);
          expect(_domNode.className).toMatch('.*qowt-vertical-align-bottom.*');
        });

    it('should have a getHorizontalAlignment() method which returns the ' +
        'horizontal alignment', function() {
          var horizontalAlignment = 'right';
          _decorator.setHorizontalAlignment(horizontalAlignment);
          expect(_decorator.getHorizontalAlignment()).toEqual('r');
        });

    it('should have a getVerticalAlignment() method which returns the ' +
        'vertical alignment', function() {
          var verticalAlignment = 'top';
          _decorator.setVerticalAlignment(verticalAlignment);
          expect(_decorator.getVerticalAlignment()).toEqual('t');
        });
  });
});
