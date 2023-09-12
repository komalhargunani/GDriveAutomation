/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit test module for text Style Decorator module.
 *
 * @author dskelton@google.com (Duncan Skelton)
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/dcp/decorators/styleDecorator'
], function(TestUtils, Decorator) {

  'use strict';

  describe('dcp/decorators/styleDecorator.js', function() {
    var testNode, para, styleId, styleClassName;

    beforeEach(function() {
      styleId = 'MyAwesomeStyle';
      styleClassName = 'qowt-stl-' + styleId;
      testNode = TestUtils.createTestAppendArea();
      para = window.document.createElement('P');
      para.style.fontFamily = 'monospace';
      para.style.fontSize = '10px';
      para.textContent = 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ' +
          'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ' +
          'ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ' +
          'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ' +
          'ipsum Lorem ipsum Lorem ipsum';
    });

    afterEach(function() {
      TestUtils.removeTestHTMLElement(testNode);
      para = undefined;
      styleId = undefined;
      styleClassName = undefined;
    });

    describe('getStyleClassName', function() {
      it('should get a style specific className from an element', function() {
        para.className = 'garbage qowt-stl-MyAwesomeStyle moreGarbage';
        expect(Decorator.getStyleClassName(para)).toBe(styleClassName);
      });

      it('should return undefined for element with no style specifc',
         function() {
           para.className = 'garbage moreGarbage';
           expect(Decorator.getStyleClassName(para)).not.toBeDefined();
         });

      it('should return undefined for style className if no class name is set',
          function() {
            delete para.className;
            expect(Decorator.getStyleClassName(para)).not.toBeDefined();
          });
    });

    describe('getStyleId', function() {
      it('should get a style id from an element', function() {
        para.className = 'garbage qowt-stl-MyAwesomeStyle moreGarbage';
        expect(Decorator.getStyleId(para)).toBe(styleId);
      });

      it('should return undefined for style id if not set on an element',
          function() {
            para.className = 'garbage moreGarbage';
            expect(Decorator.getStyleId(para)).not.toBeDefined();
          });

      it('should return undefined for style id if no class name is set',
          function() {
            delete para.className;
            expect(Decorator.getStyleId(para)).not.toBeDefined();
          });

      it('should replace #space# with spaces from the className to styleId',
          function() {
            para.className = 'qowt-stl-My#space#Awesome#space#Style';
            expect(Decorator.getStyleId(para)).toBe('My Awesome Style');
          });
    });

    describe('decorate', function() {
      it('should apply a style class to the given element', function() {
        Decorator.decorate(para, {stl: styleId});
        expect(para.className).toMatch(styleClassName);
      });

      it('should do nothing if not given a valid element', function() {
        Decorator.decorate(undefined, {stl: styleId});
        expect(para.className).toBe('');
      });

      it('should do nothing if given an undefined style id',
          function() {
            Decorator.decorate(para, {stl: undefined});
            expect(para.className).toBe('');
          });

      it('should do nothing if given an empty style id', function() {
        Decorator.decorate(para, {stl: ''});
        expect(para.className).toBe('');
      });
    });

    describe('undecorate', function() {
      it('should remove the style class from the given element', function() {
        Decorator.decorate(para, {stl: styleId});
        expect(para.className).toMatch(styleClassName);
        Decorator.undecorate(para);
        expect(para.className).toBe('');
      });

      it('should remove the style class for given properties', function() {
        Decorator.decorate(para, {stl: styleId});
        expect(para.className).toMatch(styleClassName);
        Decorator.undecorate(para, ['stl']);
        expect(para.className).toBe('');
      });

      it('should not remove the style class for given properties', function() {
        Decorator.decorate(para, {stl: styleId});
        expect(para.className).toMatch(styleClassName);
        Decorator.undecorate(para, ['someOtherProperty']);
        expect(para.className).toMatch(styleClassName);
      });
    });

    describe('formatClassName', function() {
      it('should replace spaces with "#space#" when creating a className',
        function() {
          var className = Decorator.formatClassName('My Awesome Style');
          expect(className).toMatch('qowt-stl-My#space#Awesome#space#Style');
        });
    });
  });
});
