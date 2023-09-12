/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit test for the Field Decorator.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/dcp/decorators/fieldDecorator'
], function(
    FieldDecorator) {

  'use strict';

  describe('dcp/decorator/fieldDecorator.js', function() {
    var _domNode;

    beforeEach(function() {
      _domNode = document.createElement('a');
    });

    afterEach(function() {
      _domNode = undefined;
    });

    describe('decorate', function() {
      it('should throw if it is not a valid element', function() {
        expect(function() {
          FieldDecorator.decorate(undefined, {});
        }).toThrow();
        expect(_domNode.className).toBe('');
      });

      it('should throw if it is not a valid field type', function() {
        expect(function() {
          FieldDecorator.decorate(_domNode);
        }).toThrow();
        expect(_domNode.className).toBe('');

        expect(function() {
          FieldDecorator.decorate(_domNode, {});
        }).toThrow();
        expect(_domNode.className).toBe('');

        expect(function() {
          FieldDecorator.decorate(_domNode, {spam: 'eggs'});
        }).toThrow();
        expect(_domNode.className).toBe('');
      });

      it('should decorate field type hyperlink', function() {
        FieldDecorator.decorate(_domNode, {type: 'hyperlink'});
        expect(_domNode.className).not.toBe('');
        var verify = FieldDecorator.verify(_domNode, {type: 'hyperlink'});
        expect(verify).toBe(true);
      });

    });

    describe('verify', function() {
      it('should throw if it is not a valid element', function() {
        expect(function() {
          FieldDecorator.verify(undefined, {});
        }).toThrow();
        expect(_domNode.className).toBe('');
      });

      it('should throw if it is not a valid field type', function() {
        expect(function() {
          FieldDecorator.verify(_domNode);
        }).toThrow();
        expect(_domNode.className).toBe('');

        expect(function() {
          FieldDecorator.verify(_domNode, {});
        }).toThrow();
        expect(_domNode.className).toBe('');

        expect(function() {
          FieldDecorator.verify(_domNode, {spam: 'eggs'});
        }).toThrow();
        expect(_domNode.className).toBe('');
      });

    });

    describe('undecorate', function() {
      it('should throw if it is not a valid element', function() {
        expect(function(){
          FieldDecorator.undecorate(undefined, {});
        }).toThrow();
        expect(_domNode.className).toBe('');
      });

      it('should throw if it is not a valid field type', function() {
        expect(function() {
          FieldDecorator.undecorate(_domNode);
        }).toThrow();
        expect(_domNode.className).toBe('');

        expect(function() {
          FieldDecorator.undecorate(_domNode, {});
        }).toThrow();
        expect(_domNode.className).toBe('');

        expect(function() {
          FieldDecorator.undecorate(_domNode, {spam: 'eggs'});
        }).toThrow();
        expect(_domNode.className).toBe('');
      });

      it('should undecorate field type hyperlink', function() {
        FieldDecorator.decorate(_domNode, {type: 'hyperlink'});
        expect(_domNode.className).not.toBe('');
        FieldDecorator.undecorate(_domNode, {type: 'hyperlink'});
        expect(_domNode.className).toBe('');
      });

    });

  });
});
