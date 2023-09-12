define([
  'qowtRoot/utils/dateFormatter',
  'qowtRoot/utils/qoIntlFallback'
], function(
    DateFormatter,
    QOIntlFallback) {

  'use strict';

  describe('QOWT/utils/dateFormatter.js', function() {
    var languageFormatter = window.v8Intl || window.Intl || QOIntlFallback;
    var uniFormats;
    var expectedResult;
    var testDate;
    var formatter = {format: function() {}};

    beforeEach(function() {
      uniFormats = ['yyyy', 'yy', 'y', 'MMMM', 'MMM', 'MM', 'M', 'dddd', 'ddd',
        'dd', 'd', 'HH', 'h', 'mm', 'ss', 'am/pm'];
      expectedResult = ['2012', '12', '12', 'January', 'Jan', '01', '1',
        'Thursday', 'Thu', '12', '12', '13', '1', '20', '30', 'PM'];
      testDate = new Date('01/12/12 01:20:30 PM');

    });

    afterEach(function() {
      uniFormats = undefined;
      expectedResult = undefined;
      testDate = undefined;
    });

    describe('formatDate', function() {

      it('should be defined', function() {
        expect(DateFormatter.formatDate).toBeDefined();
        console.log(uniFormats.length);
      });
    });

    describe('Different outputs for all individual uniformats', function() {
      it('formats tests', function() {
        for (var index = 0; index < uniFormats.length; index++) {
          //console.log('Testing for =' + uniFormats[index] + ' == ' +
          // expectedResult[index] + " >>> " +
          // DateUtils.formatDate(uniFormats[index], testDate));
          expect(DateFormatter.formatDate(uniFormats[index], testDate)).toBe(
              expectedResult[index]);
        }
      });
    });

    describe('Test call to window.Intl for different formats', function() {
      it('should call Intl.DateFormatter().format() method', function() {
        spyOn(languageFormatter, 'DateTimeFormat').andReturn(formatter);
        spyOn(formatter, 'format');
        DateFormatter.formatDate('MMMM', testDate, 'bn-In');
        expect(formatter.format).toHaveBeenCalledWith(testDate);
      });

      it('MMMM', function() {
        spyOn(languageFormatter, 'DateTimeFormat').andReturn(formatter);
        DateFormatter.formatDate('MMMM', testDate, 'bn-In');
        expect(languageFormatter.DateTimeFormat).toHaveBeenCalledWith(
            ['bn-In', 'en'], {month: 'long'});
      });

      it('MMM', function() {
        spyOn(languageFormatter, 'DateTimeFormat').andReturn(formatter);
        DateFormatter.formatDate('MMM', testDate, 'bn-In');
        expect(languageFormatter.DateTimeFormat).toHaveBeenCalledWith(
            ['bn-In', 'en'], {month: 'short'});
      });

      it('dddd', function() {
        spyOn(languageFormatter, 'DateTimeFormat').andReturn(formatter);
        DateFormatter.formatDate('dddd', testDate, 'bn-In');
        expect(languageFormatter.DateTimeFormat).toHaveBeenCalledWith(
            ['bn-In', 'en'], {weekday: 'long'});
      });

      it('ddd', function() {
        spyOn(languageFormatter, 'DateTimeFormat').andReturn(formatter);
        DateFormatter.formatDate('ddd', testDate, 'bn-In');
        expect(languageFormatter.DateTimeFormat).toHaveBeenCalledWith(
            ['bn-In', 'en'], {weekday: 'short'});
      });

      it('when lang is not present', function() {
        spyOn(languageFormatter, 'DateTimeFormat').andReturn(formatter);
        DateFormatter.formatDate('ddd', testDate);
        expect(languageFormatter.DateTimeFormat).toHaveBeenCalledWith(
            ['en'], {weekday: 'short'});
      });
      it('when lang is present but undefined', function() {
        spyOn(languageFormatter, 'DateTimeFormat').andReturn(formatter);
        DateFormatter.formatDate('ddd', testDate, undefined);
        expect(languageFormatter.DateTimeFormat).toHaveBeenCalledWith(
            ['en'], {weekday: 'short'});
      });
    });

    describe('Test for diff. date formats ', function() {

      it('dd/MM/yy', function() {
        expect(DateFormatter.formatDate('dd/MM/yy', testDate)).toBe('12/01/12');
      });
      it('dd/MMM/yyyy', function() {
        expect(DateFormatter.formatDate('dd/MMM/yyyy', testDate)).toBe(
            '12/Jan/2012');
      });
      it('dd/MMM/yyyy', function() {
        expect(DateFormatter.formatDate('dd/MMM/yyyy', testDate)).toBe(
            '12/Jan/2012');
      });
      it('dddd, MMMM dd, yy', function() {
        expect(DateFormatter.formatDate('dddd, MMMM dd, yy', testDate)).toBe(
            'Thursday, January 12, 12');
      });
      it('MMMM dd,yy', function() {
        expect(DateFormatter.formatDate('MMMM dd,yy', testDate)).toBe(
            'January 12,12');
      });
      it('M/dd/yyyy', function() {
        expect(DateFormatter.formatDate('M/dd/yyyy', testDate)).toBe(
            '1/12/2012');
      });
      it('yyyy-MM-dd', function() {
        expect(DateFormatter.formatDate('yyyy-MM-dd', testDate)).toBe(
            '2012-01-12');
      });
      it('dd-MMMM-yy', function() {
        expect(DateFormatter.formatDate('dd-MMMM-yy', testDate)).toBe(
            '12-January-12');
      });
      it('M.dd.yy', function() {
        expect(DateFormatter.formatDate('M.dd.yy', testDate)).toBe('1.12.12');
      });
      it('MMM. dd,yy', function() {
        expect(DateFormatter.formatDate('MMM. dd,yy', testDate)).toBe(
            'Jan. 12,12');
      });
      it('dd MMMM yyyy', function() {
        expect(DateFormatter.formatDate('dd MMMM yyyy', testDate)).toBe(
            '12 January 2012');
      });
      it('MMMM,yy', function() {
        expect(DateFormatter.formatDate('MMMM,yy', testDate)).toBe(
            'January,12');
      });
      it('MMM-yy', function() {
        expect(DateFormatter.formatDate('MMM-yy', testDate)).toBe('Jan-12');
      });

      it('M/dd/yy h:mm AM/PM', function() {
        expect(DateFormatter.formatDate('M/dd/yy h:mm am/pm', testDate)).toBe(
            '1/12/12 1:20 PM');
      });
      it('M/dd/yy h:mm:ss AM/PM', function() {
        console.log(DateFormatter.formatDate('M/dd/yy h:mm:ss am/pm',
            testDate));
        expect(DateFormatter.formatDate('M/dd/yy h:mm:ss am/pm', testDate)).
            toBe('1/12/12 1:20:30 PM');
      });
      it('h:mm AM/PM', function() {
        expect(DateFormatter.formatDate('h:mm am/pm', testDate)).toBe(
            '1:20 PM');
      });
      it('h:mm:ss AM/PM', function() {
        expect(DateFormatter.formatDate('h:mm:ss am/pm', testDate)).toBe(
            '1:20:30 PM');
      });

      it('HH:mm', function() {
        expect(DateFormatter.formatDate('HH:mm', testDate)).toBe('13:20');
      });
      it('HH:mm:ss', function() {
        expect(DateFormatter.formatDate('HH:mm:ss', testDate)).toBe('13:20:30');
      });
    });

  });

});
