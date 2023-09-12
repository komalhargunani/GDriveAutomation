// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Text Field handler Test
 *
 * @author bhushan.shitole@quickoffice.com (Bhushan Shitole)
 */

define([
  'qowtRoot/dcp/pointHandlers/textFieldHandler',
  'qowtRoot/models/point',
  'qowtRoot/utils/dateFormatter',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager'
], function(TextFieldHandler,
            PointModel,
            DateFormatter,
            PlaceHolderTextStyleManager,
            DefaultTextStyleManager) {

  'use strict';

  describe('Text Field handler Test', function() {
    var v;

    var _textParagraph = {
      appendChild: function() {
      }
    };

    beforeEach(function() {
      PointModel.isExplicitTextBody = true;

      v =
          {
            node: _textParagraph,
            el: {
              etp: 'txfld',
              eid: '123',
              uid: 111,
              type: 'slidenum',
              rpr: {},
              ppr: {},
              lvl: 0,
              data: '12/15/2012'
            }
          };

      spyOn(_textParagraph, 'appendChild');
      spyOn(DateFormatter, 'formatDate').andReturn('12/15/2012');
      spyOn(PlaceHolderTextStyleManager, 'resolveRunPropertyFor').
          andReturn(undefined);
      spyOn(DefaultTextStyleManager, 'resolveRunPropertyFor').
          andReturn(undefined);
    });

    describe('pre-condition check', function() {

      it('should return undefined, when v is undefined', function() {
        v = undefined;

        var result = TextFieldHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when v.el is undefined', function() {
        v.el = undefined;

        var result = TextFieldHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when v.el.etp is undefined', function() {
        v.el.etp = undefined;

        var result = TextFieldHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when v.el.etp is not -txfld-', function() {
        v.el.etp = 'random';

        var result = TextFieldHandler.visit(v);
        expect(result, undefined);
      });

      it('should return undefined, when PointModel.isExplicitTextBody is false',
          function() {
            PointModel.isExplicitTextBody = false;

            var result = TextFieldHandler.visit(v);
            expect(result, undefined);
          });

    });

    describe('behaviour check', function() {

      it('should call formatDate method of DateFormatter when type is datetime',
          function() {
            v.el.type = 'datetime';

            TextFieldHandler.visit(v);

            expect(DateFormatter.formatDate).toHaveBeenCalled();
          });

      it('should set correct slide number in text field ', function() {

        v.el.data = '11';

        var textFieldElement = TextFieldHandler.visit(v);

        expect(textFieldElement.textContent).toEqual('11');
      });

      it('should set current slide number in text field when text is undefined',
          function() {

            v.el.data = undefined;
            PointModel.SlideId = 22;

            var textFieldElement = TextFieldHandler.visit(v);

            expect(textFieldElement.textContent).toEqual('22');
            PointModel.SlideId = undefined;
          });

    });

    describe('Test different date formats', function() {

      beforeEach(function() {
        v.el.type = 'datetime';
      });

      it('should set correct date format when format is default ', function() {
        TextFieldHandler.visit(v);

        expect(DateFormatter.formatDate.calls[0].args[0]).toEqual(undefined);
      });

      it('should set correct date format when format is MM/DD/YYYY ',
          function() {
            v.el.format = 'MM/dd/yyyy';

            TextFieldHandler.visit(v);

            expect(DateFormatter.formatDate.calls[0].args[0]).
                toEqual('MM/dd/yyyy');
          });

      it('should set correct date format when format is Day, Month DD, YYYY ',
          function() {

            v.el.format = 'dddd, MMMM dd, yyyy';

            TextFieldHandler.visit(v);

            expect(DateFormatter.formatDate.calls[0].args[0]).
                toEqual('dddd, MMMM dd, yyyy');
          });

      it('should set correct date format when format is DD Month YYYY ',
          function() {

            v.el.format = 'dd MMMM yyyy';

            TextFieldHandler.visit(v);

            expect(DateFormatter.formatDate.calls[0].args[0]).
                toEqual('dd MMMM yyyy');
          });

      it('should set correct date format when format is Month DD, YYYY ',
          function() {

            v.el.format = 'MMMM dd, yyyy';

            TextFieldHandler.visit(v);

            expect(DateFormatter.formatDate.calls[0].args[0]).
                toEqual('MMMM dd, yyyy');
          });

      it('should set correct date format when format is DD-Mon-YY ',
          function() {

            v.el.format = 'dd-MMM-yy';

            TextFieldHandler.visit(v);

            expect(DateFormatter.formatDate.calls[0].args[0]).
                toEqual('dd-MMM-yy');
          });

      it('should set correct date format when format is Month YY ', function() {

        v.el.format = 'MMMM yy';

        TextFieldHandler.visit(v);

        expect(DateFormatter.formatDate.calls[0].args[0]).toEqual('MMMM yy');
      });

      it('should set correct date format when format is Mon-YY ', function() {

        v.el.format = 'MMM-yy';

        TextFieldHandler.visit(v);

        expect(DateFormatter.formatDate.calls[0].args[0]).toEqual('MMM-yy');
      });

      it('should set correct date format when format is MM/DD/YYYY hh:mm AM/PM',
          function() {

            v.el.format = 'MM/dd/yyyy HH:mm am/pm';

            TextFieldHandler.visit(v);

            expect(DateFormatter.formatDate.calls[0].args[0]).
                toEqual('MM/dd/yyyy HH:mm am/pm');
          });

      it('should set correct date format when format is ' +
          'MM/DD/YYYY hh:mm:ss AM/PM ', function() {

            v.el.format = 'MM/dd/yyyy HH:mm:ss am/pm';

            TextFieldHandler.visit(v);

            expect(DateFormatter.formatDate.calls[0].args[0]).
                toEqual('MM/dd/yyyy HH:mm:ss am/pm');
          });

      it('should set correct date format when format is hh:mm ', function() {

        v.el.format = 'HH:mm';

        TextFieldHandler.visit(v);

        expect(DateFormatter.formatDate.calls[0].args[0]).toEqual('HH:mm');
      });

      it('should set correct date format when format is hh:mm:ss ', function() {

        v.el.format = 'HH:mm:ss';

        TextFieldHandler.visit(v);

        expect(DateFormatter.formatDate.calls[0].args[0]).toEqual('HH:mm:ss');
      });

      it('should set correct date format when format is hh:mm AM/PM ',
          function() {

            v.el.format = 'HH:mm am/pm';

            TextFieldHandler.visit(v);

            expect(DateFormatter.formatDate.calls[0].args[0]).
                toEqual('HH:mm am/pm');
          });

      it('should set correct date format when format is hh:mm:ss: AM/PM ',
          function() {

            v.el.format = 'HH:mm:ss: am/pm';

            TextFieldHandler.visit(v);

            expect(DateFormatter.formatDate.calls[0].args[0]).
                toEqual('HH:mm:ss: am/pm');
          });

    });

  });
});
