/**
 * Tests for QOWT.DCP.Decorators.TextDecoratorFactory
 *
 */

define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/dcp/decorators/textDecorator',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/errors/qowtError',
  'qowtRoot/models/env'
], function(UnittestUtils,
            TextDecorator,
            Converter,
            QOWTError,
            EnvModel) {

  'use strict';

  describe('DCP.Decorators.TextDecorator', function() {
    var span, formatting, testAppendArea, previousFontUnit;

    beforeEach(function() {
      span = document.createElement('span');
      // span.style.fontSize = '10px';
      // span.style.fontface = 'Garamond';
      span.textContent = 'This unit test case is written to test the ' +
          'behaviour of TextDecorator';

      testAppendArea = UnittestUtils.createTestAppendArea();

      // Mock the converter module
      spyOn(Converter, 'pt2em').andReturn(0);
      previousFontUnit = EnvModel.fontUnit;
      EnvModel.fontUnit = 'pt';
    });

    afterEach(function() {
      span = undefined;
      UnittestUtils.removeTestAppendArea();
      EnvModel.fontUnit = previousFontUnit;
    });

    describe('font size, fontface, color and text background color',
        function() {
          it('should display text with properties', function() {
            formatting = {
              siz: '20pt',
              font: 'Times New Roman',
              clr: 'rgb(0, 0, 255)',
              hgl: 'rgb(255, 0, 255)'
            };
            TextDecorator.decorate(span, formatting);

            // font size
            expect(span.style.fontSize).toEqual(formatting.siz);
            // font face
            expect(
                span.classList.contains('qowt-font1-TimesNewRoman')).toBe(true);
            // font color
            expect(span.style.color).toEqual(formatting.clr);
            // text background color
            expect(span.style.backgroundColor).toEqual(formatting.hgl);
          });
        });

    describe('setFontSize', function() {
      it('should do no conversion when font unit is points', function() {
        TextDecorator.setFontSize(span, 20);
        expect(span.style.fontSize).toEqual('20pt');
      });

      it('should support font unit conversion', function() {
        EnvModel.fontUnit = 'em';
        TextDecorator.setFontSize(span, 20);
        expect(span.style.fontSize).toEqual('0em');
      });

      it('should fail on unsupported font unit', function() {
        EnvModel.fontUnit = 'incorrect';
        expect(function() {
          TextDecorator.setFontSize(span, formatting);
        }).toThrow(new QOWTError('Unsupported font unit conversion.'));
      });
    });

    describe('getFontFace and getFontSize', function() {
      var styledSpan;

      beforeEach(function() {
        styledSpan = document.createElement('span');
        styledSpan.style.visibility = 'hidden';
        testAppendArea.appendChild(styledSpan);
      });

      describe('getFontFace', function() {
        it('should work on fonts that are known to our font manager.',
            function() {
              styledSpan.style.fontFamily = "Arial, 'fallback 1', sans-serif";

              var ff = TextDecorator.getFontFace(styledSpan);
              expect(ff).toBe('Arial');
            });

        it('should work on fonts that are not known to our font manager.',
            function() {
              styledSpan.style.fontFamily = 'uniqueFontName';

              var ff = TextDecorator.getFontFace(styledSpan);
              expect(ff).toBe('uniqueFontName');
            });

        it('should return undefined on an unstyled span', function() {
          var unstyledSpan = document.createElement('span');
          expect(TextDecorator.getFontFace(unstyledSpan)).toBeUndefined();
        });
      });

      describe('getFontSizePoints', function() {
        it('should return points font size, in points', function() {
          styledSpan.style.fontSize = '72pt';

          var fs = TextDecorator.getFontSizePoints(styledSpan);
          expect(fs).toBe(72);
        });

        it('should return em font size, in points', function() {
          styledSpan.style.fontSize = '6em';

          var fs = TextDecorator.getFontSizePoints(styledSpan);
          expect(fs).toBe(72);
        });

        it('should return inch font size, in points', function() {
          styledSpan.style.fontSize = '1in';

          var fs = TextDecorator.getFontSizePoints(styledSpan);
          expect(fs).toBe(72);
        });

        it('should return undefined on an unstyled span', function() {
          var unstyledSpan = document.createElement('span');
          expect(TextDecorator.getFontSizePoints(unstyledSpan)).toBeUndefined();
        });
      });
    });

    describe('underline and strike through', function() {
      it('should display text with underline', function() {
        formatting = {
          udl: true
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.textDecoration).toEqual('underline');
      });

      it('should not show underline when set to none', function() {
        formatting = {
          udl: false
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.textDecoration).not.toMatch('underline');
      });

      it('should not set udl when finding undefined value for attribute in ' +
          'the dcp', function() {
            formatting = {
              udl: undefined
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.textDecoration).toBeFalsy();
         });

      it('should display text with line-through property for strikethrough ' +
          'property in dcp', function() {
            formatting = {
              strikethrough: true
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.textDecoration).toEqual('line-through');
          });

      it('should not set strikethrough when finding false in the dcp',
          function() {
            formatting = {
              strikethrough: false
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.textDecoration).toBeFalsy();
      });

      it('should not set strikethrough when finding undefined value for ' +
          'attribute in the dcp', function() {
            formatting = {
              strikethrough: undefined
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.textDecoration).toBeFalsy();
          });

      it('should display text with line-through property for dstr property ' +
          'in dcp', function() {
            formatting = {
              dstr: true
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.textDecoration).toEqual('line-through');
          });

      it('should not set dstr when finding undefined value for attribute in ' +
          'the dcp', function() {
            formatting = {
              dstr: undefined
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.textDecoration).toBeFalsy();
          });
    });

    describe('small-caps and all-caps', function() {
      it('should display text in small-caps', function() {
        formatting = {
          scp: true
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.fontVariant).toEqual('small-caps');
      });

      it('should not set scp when finding false in the dcp', function() {
        formatting = {
          scp: false
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.fontVariant).toEqual('normal');
      });

      it('should not set scp when finding undefined value for attribute in ' +
          'the dcp', function() {
            formatting = {
              scp: undefined
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.fontVariant).toBeFalsy();
          });

      it('should display text in all-caps', function() {
        formatting = {
          acp: true
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.textTransform).toEqual('uppercase');
      });

      it('should set acp to none when finding false in the dcp', function() {
        formatting = {
          acp: false
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.textTransform).toEqual('none');
      });

      it('should not set acp when finding undefined value for attribute in ' +
          'the dcp', function() {
            formatting = {
              acp: undefined
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.textTransform).toBeFalsy();
          });
    });

    describe('superscript and subscript', function() {
      it('should display text with superscript', function() {
        formatting = {
          sup: true
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.verticalAlign).toEqual(TextDecorator.
            getPolicy('superscript_vertical_align'));
      });

      it('should not set sup when finding false in the dcp', function() {
        formatting = {
          sup: false
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.verticalAlign).toEqual('');
      });

      it('should not set sup when finding undefined value for attribute in ' +
          'the dcp', function() {
            formatting = {
              sup: undefined
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.verticalAlign).toBeFalsy();
          });

      it('should display text with subscript', function() {
        formatting = {
          sub: true
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.verticalAlign).toEqual(TextDecorator.
            getPolicy('subscript_vertical_align'));
      });

      it('should not set sub when finding false in the dcp', function() {
        formatting = {
          sub: false
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.verticalAlign).toEqual('');
      });

      it('should not set sub when finding undefined value for attribute in ' +
          'the dcp', function() {
            formatting = {
              sub: undefined
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.verticalAlign).toBeFalsy();
          });
    });

    describe('bold, italic and hidden', function() {
      it('should display text with bold', function() {
        formatting = {
          bld: true
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.fontWeight).toEqual('bold');
      });

      it('should set bld to normal when finding false in the dcp', function() {
        formatting = {
          bld: false
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.fontWeight).toEqual('normal');
      });

      it('should not set bld when finding undefined value for attribute in ' +
          'the dcp', function() {
            formatting = {
              bld: undefined
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.fontWeight).toBeFalsy();
          });

      it('should display text with italic', function() {
        formatting = {
          itl: true
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.fontStyle).toEqual('italic');
      });

      it('should set itl when finding false in the dcp', function() {
        formatting = {
          itl: false
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.fontStyle).toEqual('normal');
      });

      it('should not set itl when finding undefined value for attribute in ' +
          'the dcp', function() {
            formatting = {
              itl: undefined
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.fontStyle).toBeFalsy();
          });

      it('should not display text when true', function() {
        formatting = {
          hid: true
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.display).toEqual('none');
      });

      it('should display text when finding false in the dcp', function() {
        formatting = {
          hid: false
        };
        TextDecorator.decorate(span, formatting);
        expect(span.style.display).toEqual('inline-block');
      });

      it('should not set hid when finding undefined value for attribute in ' +
          'the dcp', function() {
            formatting = {
              hid: undefined
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.display).toBeFalsy();
          });
    });

    describe('superscript and subscript', function() {
      it('should display text with subscript and font size should be 75% of ' +
          'actual size', function() {
            formatting = {
              sub: true,
              siz: 8
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.verticalAlign).toEqual(TextDecorator.getPolicy(
                'subscript_vertical_align'));
            expect(span.style.zoom).toEqual(TextDecorator.getPolicy(
                'sub_or_super_script_font_ratio'));
          });

      it('should display text with superscript and font size should be 75% ' +
          'of actual size', function() {
            formatting = {
              sup: true,
              siz: 8
            };
            TextDecorator.decorate(span, formatting);
            expect(span.style.verticalAlign).toEqual(TextDecorator.getPolicy(
                'superscript_vertical_align'));
            expect(span.style.zoom).toEqual(TextDecorator.getPolicy(
                'sub_or_super_script_font_ratio'));
          });
    });

    describe('setUnderline', function() {
      it('should set explicit underline on a virgin element', function() {
        TextDecorator.setUnderline(span, true);
        expect(span.style.textDecoration).toMatch('underline');
      });

      it('should set explicit no-underline on a virgin element', function() {
        TextDecorator.setUnderline(span, false);
        expect(span.style.textDecoration).not.toMatch('underline');
      });

      it('should set explicit no-underline on an element that had explicit ' +
          'underline', function() {
            TextDecorator.setUnderline(span, true);
            TextDecorator.setUnderline(span, false);
            expect(span.style.textDecoration).not.toMatch('underline');
          });

      it('should set explicit underline on an element that had explicit ' +
          'no-underline', function() {
            TextDecorator.setUnderline(span, false);
            TextDecorator.setUnderline(span, true);
            expect(span.style.textDecoration).toMatch('underline');
          });
    });

    describe('setStrikethrough', function() {
      it('should set explicit strikethrough on a virgin element', function() {
        TextDecorator.setStrikethrough(span, true);
        expect(span.style.textDecoration).toMatch('line-through');
      });

      it('should set explicit no-strikethrough on a virgin element',
          function() {
            TextDecorator.setStrikethrough(span, false);
            expect(span.style.textDecoration).not.toMatch('line-through');
          });

      it('should set explicit no-strikethrough on an element that had ' +
          'explicit strikethrough', function() {
            TextDecorator.setStrikethrough(span, true);
            TextDecorator.setStrikethrough(span, false);
            expect(span.style.textDecoration).not.toMatch('line-through');
          });

      it('should set explicit strikethrough on an element that had explicit ' +
          'no-strikethrough', function() {
            TextDecorator.setStrikethrough(span, false);
            TextDecorator.setStrikethrough(span, true);
            expect(span.style.textDecoration).toMatch('line-through');
          });
    });

    describe('setUnderline and setStrikethrough interactions', function() {
      // First let's test the underline combos on something that has
      // strikethrough
      it('should set explicit underline on a virgin element that has ' +
          'strikethrough', function() {
            TextDecorator.setStrikethrough(span, true);
            TextDecorator.setUnderline(span, true);
            expect(span.style.textDecoration).toMatch('line-through');
            expect(span.style.textDecoration).toMatch('underline');
          });

      it('should set explicit no-underline on a virgin element that has ' +
          'strikethrough', function() {
            TextDecorator.setStrikethrough(span, true);
            TextDecorator.setUnderline(span, false);
            expect(span.style.textDecoration).toMatch('line-through');
            expect(span.style.textDecoration).not.toMatch('underline');
          });

      it('should set explicit no-underline on an element that had explicit ' +
          'underline with strikethrough', function() {
            TextDecorator.setStrikethrough(span, true);
            TextDecorator.setUnderline(span, true);
            TextDecorator.setUnderline(span, false);
            expect(span.style.textDecoration).toMatch('line-through');
            expect(span.style.textDecoration).not.toMatch('underline');
          });

      it('should set explicit underline on an element that had explicit ' +
          'no-underline with strikethrough', function() {
            TextDecorator.setStrikethrough(span, true);
            TextDecorator.setUnderline(span, false);
            TextDecorator.setUnderline(span, true);
            expect(span.style.textDecoration).toMatch('line-through');
            expect(span.style.textDecoration).toMatch('underline');
          });

      // Now let's test the strikethrough combos on something that has
      // underline.
      it('should set explicit strikethrough on a virgin element that has ' +
          'underline', function() {
            TextDecorator.setUnderline(span, true);
            TextDecorator.setStrikethrough(span, true);
            expect(span.style.textDecoration).toMatch('underline');
            expect(span.style.textDecoration).toMatch('line-through');
          });

      it('should set explicit no-strikethrough on a virgin element that has ' +
          'underline', function() {
            TextDecorator.setUnderline(span, true);
            TextDecorator.setStrikethrough(span, false);
            expect(span.style.textDecoration).toMatch('underline');
            expect(span.style.textDecoration).not.toMatch('line-through');
          });

      it('should set explicit no-strikethrough on an element that had ' +
          'explicit strikethrough with underline', function() {
            TextDecorator.setUnderline(span, true);
            TextDecorator.setStrikethrough(span, true);
            TextDecorator.setStrikethrough(span, false);
            expect(span.style.textDecoration).toMatch('underline');
            expect(span.style.textDecoration).not.toMatch('line-through');
          });

      it('should set explicit strikethrough on an element that had ' +
          'explicit no-strikethrough with underline', function() {
            TextDecorator.setUnderline(span, true);
            TextDecorator.setStrikethrough(span, false);
            TextDecorator.setStrikethrough(span, true);
            expect(span.style.textDecoration).toMatch('underline');
            expect(span.style.textDecoration).toMatch('line-through');
          });
    });
  });
});
