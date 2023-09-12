define([
  'qowtRoot/dcp/charRunHandler',
  'qowtRoot/fixtures/_all',
  'qowtRoot/models/dcp'
], function(
    CharRunHandler,
    FIXTURES,
    DCPModel) {

  'use strict';

  describe('QOWT/dcp/charRunHandler.js', function() {

    var rootNode, handler, returnValue;
    var visitableEl;
    var _nextCharRun, _checkSimpleNode;
    var _visitableSingleCharEl;

    beforeEach(function() {
      _checkSimpleNode = true;
      rootNode = document.createElement('DIV');
      handler = CharRunHandler;
      visitableEl = {
        el: FIXTURES.nestedCharRun(20),
        node: rootNode,
        accept: function() {}
      };
      _visitableSingleCharEl = function() {
        var _that = {
          el: FIXTURES.nestedCharRun(1),
          node: rootNode,
          accept: function() {}
        };
        return _that;
      };
      // Ensure QOWT knows that we are testing DCP version 2
      DCPModel.version = 2;
    });

    afterEach(function() {
      if (_checkSimpleNode) {
        expect(returnValue).toBeDefined();
        expect(visitableEl.node.childNodes.length).toEqual(1);
        expect(_nextCharRun.nodeName).toBe('SPAN');
        expect(_nextCharRun.textContent.length > 0).toBeTruthy();
      }
    });

    it('should create a span html element with correct font-name for a ncr ' +
        'DCP element with font', function() {
          // With new font support in QOWT the font face is now an attribute
          visitableEl.el.setStyles({
            rpr: {font: 'Arial'}
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(
              _nextCharRun.classList.contains('qowt-font1-Arial')).toBe(true);
        });

    it('should create a span html element with correct font-size for a ncr ' +
        'DCP element with size', function() {
          _checkSimpleNode = false;
          for (var i = 0; i <= 9; i++) {
            var _visitable = _visitableSingleCharEl();
            _visitable.el.setStyles({
              rpr: {siz: i + 1}
            });
            returnValue = handler.visit(_visitable);
            _nextCharRun = _visitable.node.childNodes[i];
            expect(_nextCharRun.style.fontSize).toBe((i + 1) + 'pt');
          }
        });

    it('should create a span html element with correct color for a ncr DCP ' +
        'element with color', function() {
          visitableEl.el.setStyles({
            rpr: {clr: '#ff0000'}
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(_nextCharRun.style.color).toBe('rgb(255, 0, 0)');
        });

    it('should create a span html element with correct  background color for' +
        ' a ncr DCP element with highlight', function() {
          visitableEl.el.setStyles({
            rpr: {hgl: '#112233'}
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(_nextCharRun.style.backgroundColor).toBe('rgb(17, 34, 51)');
        });

    it('should create a span html element with correct font-style for a ncr ' +
        'DCP element with italics', function() {
          visitableEl.el.setStyles({
            rpr: {itl: true}
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(_nextCharRun.style.fontStyle).toBe('italic');
        });

    it('should create a span html element with correct font-weight for a ncr ' +
        'DCP element with bold', function() {
          visitableEl.el.setStyles({
            rpr: {bld: true}
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(_nextCharRun.style.fontWeight).toBe('bold');
        });

    it('should create a span html element with correct text-decoration for a ' +
        'ncr DCP element with underline', function() {
          visitableEl.el.setStyles({
            rpr: {udl: true}
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(_nextCharRun.style.textDecoration).toBe('underline');
        });

    it('should create a span html element with correct text-decoration for a ' +
        'ncr DCP element with strikethrough', function() {
          visitableEl.el.setStyles({
            rpr: {str: true}
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(_nextCharRun.style.textDecoration).toBe('line-through');
        });

    it('should create a span html element with correct text-decoration for a ' +
        'ncr DCP element with blink', function() {
          visitableEl.el.setStyles({
            rpr: {bli: true}
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          // not all user agents support blink (eg safari) so cannot guarantee
          // it, therefore do not test.
        });

    it('should create a span html element with correct text-decoration for a ' +
        'ncr DCP element with strikethrough, underline and blink', function() {
          visitableEl.el.setStyles({
            rpr: {
              str: true,
              udl: true,
              bli: true
            }
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(_nextCharRun.style.textDecoration).toContain('line-through');
          expect(_nextCharRun.style.textDecoration).toContain('underline');
          // not all user agents support blink (eg safari) so cannot guarantee
          // it, therefore do not test.
        });

    it('should create a span html element with correct display for a ncr DCP ' +
        'element with hidden', function() {
          visitableEl.el.setStyles({
            rpr: {hid: true}
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(_nextCharRun.style.display).toBe('none');
        });

    it('should create a span html element with correct vertical alignment for' +
        ' a ncr DCP element with subscript', function() {
          visitableEl.el.setStyles({
            rpr: {sub: true}
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(_nextCharRun.style.verticalAlign).toBe('sub');
        });

    it('should create a span html element with correct vertical alignment for' +
        ' a ncr DCP element with superscript', function() {
          visitableEl.el.setStyles({
            rpr: {sup: true}
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(_nextCharRun.style.verticalAlign).toBe('super');
        });

    it('should create a span html element with correct capitalization for a ' +
        'ncr DCP element with all caps', function() {
          visitableEl.el.setStyles({
            rpr: {acp: true}
          });
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(_nextCharRun.style.textTransform).toBe('uppercase');
        });

    it('should not have incorrect dependencies between attributes.',
        function() {
          visitableEl.el.setStyles({
            rpr: {
              font: 'Arial',
              siz: 12,
              clr: '#ff0000',
              hgl: '#112233',
              bld: true,
              itl: true,
              udl: true,
              str: true,
              bli: true,
              hid: true,
              sub: true,
              sup: true
            }
          });
          // Note: subscript and superscript are mutually exclusive, so which
          // comes last in the handler wins through.
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];
          expect(
              _nextCharRun.classList.contains('qowt-font1-Arial')).toBe(true);
          expect(_nextCharRun.style.color).toBe('rgb(255, 0, 0)');
          expect(_nextCharRun.style.backgroundColor).toBe('rgb(17, 34, 51)');
          expect(_nextCharRun.style.fontWeight).toBe('bold');
          expect(_nextCharRun.style.fontStyle).toBe('italic');
          expect(_nextCharRun.style.textDecoration).toContain('underline');
          expect(_nextCharRun.style.textDecoration).toContain('line-through');
          // note: not testing the blink because some browsers (eg safari) do
          // not set the style on the element since they dont support it...
          expect(_nextCharRun.style.display).toBe('none');
          expect(_nextCharRun.style.verticalAlign).toBe('super');
        });

  });

});
